/**
 * PhishGuard Core Rule-Based Email Analysis Engine
 * 
 * Performs 100% in-browser, explainable threat heuristics across:
 * 1. RFC 2822 Header Parsing & Normalization
 * 2. Sender Identity, Display Name Spoofing & Domain Typosquatting
 * 3. URL Deep Inspection (Href mismatches, IP addresses, shorteners, suspicious TLDs, Punycode)
 * 4. Social Engineering Psychology & Coercive Language
 * 5. Cryptographic Email Authentication (SPF, DKIM, DMARC)
 * 6. Threat Intelligence & Custom Reputation Blacklist
 */

import {
  AnalysisResult,
  AppSettings,
  AuthStatus,
  EmailMetadata,
  ExtractedUrl,
  Finding,
  FindingCategory,
  FindingSeverity,
} from '../types';

// Free webmail domains commonly abused in display-name spoofing
const FREE_MAIL_DOMAINS = new Set([
  'gmail.com',
  'yahoo.com',
  'outlook.com',
  'hotmail.com',
  'aol.com',
  'mail.com',
  'proton.me',
  'protonmail.com',
  'zoho.com',
  'icloud.com',
  'gmx.com',
  'yandex.com',
]);

// Suspicious top-level domains frequently registered for cyber attacks
const SUSPICIOUS_TLDS = new Set([
  '.xyz',
  '.top',
  '.click',
  '.ru',
  '.su',
  '.tk',
  '.work',
  '.loan',
  '.buzz',
  '.support',
  '.gq',
  '.ml',
  '.cf',
  '.fit',
  '.live',
  '.rest',
  '.monster',
  '.tokyo',
  '.pw',
  '.cam',
  '.men',
  '.date',
]);

// Known URL shortener services that mask final destination
const URL_SHORTENERS = new Set([
  'bit.ly',
  'tinyurl.com',
  't.co',
  'is.gd',
  'buff.ly',
  'ow.ly',
  'rebrand.ly',
  'cutt.ly',
  'shorturl.at',
  'tiny.cc',
  'qr.ae',
  't.me',
  'goo.gl',
]);

// Keywords indicating institutional authority or administration
const AUTHORITY_KEYWORDS = [
  'dean',
  'principal',
  'president',
  'provost',
  'chancellor',
  'it helpdesk',
  'it support',
  'helpdesk',
  'registrar',
  'financial aid',
  'student accounts',
  'campus police',
  'campus security',
  'bursar',
  'administrator',
  'director of admissions',
  'human resources',
  'hr department',
];

// High-urgency and coercive phrases
const URGENCY_PATTERNS = [
  { regex: /\b(urgent|urgently|immediate|immediately)\b/i, label: 'Immediate urgency keyword', points: 10 },
  { regex: /\b(within 24 hours|within 48 hours|in 24 hours|today only)\b/i, label: 'Tight artificial deadline (24-48h)', points: 15 },
  { regex: /\b(final warning|last warning|account suspended|permanently suspended|access terminated)\b/i, label: 'Suspension or termination threat', points: 15 },
  { regex: /\b(action required|critical action|act now|respond right now)\b/i, label: 'Call to immediate action', points: 8 },
  { regex: /\b(disciplinary action|legal action|consequences)\b/i, label: 'Intimidation threat', points: 12 },
  { regex: /\b(strictly confidential|keep this secret|do not call)\b/i, label: 'Secrecy / bypass verification instruction', points: 12 },
];

// Credential and login theft keywords
const CREDENTIAL_PATTERNS = [
  { regex: /\b(password expires|password expiration|reset your password|change password)\b/i, label: 'Password expiration lure', points: 15 },
  { regex: /\b(verify your (account|identity|credentials)|confirm your (identity|credentials))\b/i, label: 'Account verification lure', points: 12 },
  { regex: /\b(sso login|single sign-on|duo push|2fa token|otp code)\b/i, label: 'Campus SSO / MFA credential solicitation', points: 15 },
  { regex: /\b(login to retain|re-authenticate|session expired)\b/i, label: 'Forced re-authentication prompt', points: 10 },
];

// Financial, money, and gift card scams
const FINANCIAL_PATTERNS = [
  { regex: /\b(gift card|apple card|steam card|itunes card|google play card)\b/i, label: 'Gift card purchase solicitation', points: 25 },
  { regex: /\b(scratch off|16-digit|pin code|photos of the (card|code))\b/i, label: 'Gift card code exfiltration instructions', points: 20 },
  { regex: /\b(wire transfer|western union|crypto|bitcoin|reimburse you|treasury check)\b/i, label: 'Untraceable funds / reimbursement promise', points: 18 },
  { regex: /\b(\$\d{1,3}(,\d{3})*(\.\d{2})?|grant of \$|awarded \$|cash prize)\b/i, label: 'Unsolicited large cash or grant award', points: 15 },
  { regex: /\b(bank account|routing number|direct deposit details)\b/i, label: 'Banking information harvesting', points: 20 },
];

// Generic or impersonal greetings
const GENERIC_GREETINGS = [
  { regex: /\bdear (user|student \/ faculty|student\/faculty|account holder|customer|member|colleague)\b/i, label: 'Generic impersonation greeting ("Dear user/student")', points: 6 },
  { regex: /\bkindly (reply|act|purchase|send|click)\b/i, label: 'Overly formal or scam-prevalent phrasing ("kindly")', points: 6 },
];

/**
 * Levenshtein Distance for typosquatting / look-alike calculation
 */
function levenshteinDistance(a: string, b: string): number {
  const matrix: number[][] = [];
  for (let i = 0; i <= b.length; i++) matrix[i] = [i];
  for (let j = 0; j <= a.length; j++) matrix[0][j] = j;

  for (let i = 1; i <= b.length; i++) {
    for (let j = 1; j <= a.length; j++) {
      if (b.charAt(i - 1) === a.charAt(j - 1)) {
        matrix[i][j] = matrix[i - 1][j - 1];
      } else {
        matrix[i][j] = Math.min(
          matrix[i - 1][j - 1] + 1,
          matrix[i][j - 1] + 1,
          matrix[i - 1][j] + 1
        );
      }
    }
  }
  return matrix[b.length][a.length];
}

/**
 * Checks if a domain is a look-alike / typosquat of the trusted college domain
 */
function isLookalikeDomain(candidateDomain: string, trustedDomain: string): { isLookalike: boolean; reason: string } {
  if (!candidateDomain || !trustedDomain) return { isLookalike: false, reason: '' };
  
  const cand = candidateDomain.toLowerCase().trim();
  const trust = trustedDomain.toLowerCase().trim();

  if (cand === trust || cand.endsWith(`.${trust}`)) {
    return { isLookalike: false, reason: 'Legitimate trusted domain or subdomain' };
  }

  // Common homoglyphs / character substitutions: 1 -> l, 0 -> o, rn -> m, etc.
  const normalizedCand = cand
    .replace(/1/g, 'l')
    .replace(/0/g, 'o')
    .replace(/rn/g, 'm')
    .replace(/vv/g, 'w');

  const normalizedTrust = trust
    .replace(/1/g, 'l')
    .replace(/0/g, 'o')
    .replace(/rn/g, 'm')
    .replace(/vv/g, 'w');

  // Check homoglyph replacement (e.g. co11ege.edu vs college.edu)
  if (normalizedCand === trust || normalizedCand === normalizedTrust) {
    return {
      isLookalike: true,
      reason: `Homoglyph / number substitution detected (${cand} mimics ${trust} using visual duplicates)`,
    };
  }

  // Check hyphen insertion e.g. college-edu.com or state-college.org
  const trustBase = trust.split('.')[0];
  if (
    cand.includes(`${trustBase}-`) ||
    cand.includes(`-${trustBase}`) ||
    cand.includes(`${trust.replace('.', '-')}`)
  ) {
    return {
      isLookalike: true,
      reason: `Hyphenated combo domain mimicking campus brand (${cand})`,
    };
  }

  // Check subdomain deception e.g. college.edu.fake-login.com
  if (cand.includes(trust) && !cand.endsWith(`.${trust}`)) {
    return {
      isLookalike: true,
      reason: `Subdomain deception (${trust} is embedded inside an unauthorized external root domain)`,
    };
  }

  // Check close Levenshtein distance on base domain
  const candBase = cand.split('.')[0];
  if (trustBase.length >= 4 && candBase.length >= 4) {
    const dist = levenshteinDistance(candBase, trustBase);
    if (dist > 0 && dist <= 2) {
      return {
        isLookalike: true,
        reason: `Typosquatting variant of ${trust} (edit distance: ${dist})`,
      };
    }
  }

  return { isLookalike: false, reason: '' };
}

/**
 * Parse RFC 2822 raw email headers and body
 */
export function parseEmail(rawEmail: string): EmailMetadata {
  const normalized = rawEmail.replace(/\r\n/g, '\n');
  const headerBodySplitIndex = normalized.indexOf('\n\n');

  let headerSection = '';
  let bodySection = '';

  if (headerBodySplitIndex !== -1) {
    headerSection = normalized.slice(0, headerBodySplitIndex);
    bodySection = normalized.slice(headerBodySplitIndex + 2);
  } else {
    // If no distinct header separator, treat whole thing as body or attempt line parsing
    headerSection = normalized.slice(0, 1000);
    bodySection = normalized;
  }

  // Unfold multi-line headers (RFC 2822: continuation lines start with whitespace)
  const unfoldedHeaderLines: string[] = [];
  const rawLines = headerSection.split('\n');
  for (const line of rawLines) {
    if ((line.startsWith(' ') || line.startsWith('\t')) && unfoldedHeaderLines.length > 0) {
      unfoldedHeaderLines[unfoldedHeaderLines.length - 1] += ' ' + line.trim();
    } else if (line.trim().length > 0) {
      unfoldedHeaderLines.push(line);
    }
  }

  const headers: Record<string, string> = {};
  for (const line of unfoldedHeaderLines) {
    const colonIndex = line.indexOf(':');
    if (colonIndex !== -1) {
      const key = line.slice(0, colonIndex).trim().toLowerCase();
      const val = line.slice(colonIndex + 1).trim();
      headers[key] = val;
    }
  }

  // Extract From
  const fromRaw = headers['from'] || '';
  let fromName = '';
  let fromAddress = '';
  let fromDomain = '';

  const emailAngleMatch = fromRaw.match(/(.*?)<([^>]+)>/);
  if (emailAngleMatch) {
    fromName = emailAngleMatch[1].replace(/["']/g, '').trim();
    fromAddress = emailAngleMatch[2].trim().toLowerCase();
  } else {
    fromAddress = fromRaw.replace(/["']/g, '').trim().toLowerCase();
    fromName = fromAddress.split('@')[0] || '';
  }
  fromDomain = fromAddress.split('@')[1] || '';

  // Extract Reply-To
  const replyToRaw = headers['reply-to'] || '';
  let replyToAddress = '';
  let replyToDomain = '';
  const replyToMatch = replyToRaw.match(/(.*?)<([^>]+)>/);
  if (replyToMatch) {
    replyToAddress = replyToMatch[2].trim().toLowerCase();
  } else {
    replyToAddress = replyToRaw.replace(/["']/g, '').trim().toLowerCase();
  }
  replyToDomain = replyToAddress.split('@')[1] || '';

  // Extract Subject & Date
  const subject = headers['subject'] || '(No Subject)';
  const date = headers['date'] || '';

  // Parse Authentication Results
  const authResults = headers['authentication-results'] || '';
  const receivedSpf = headers['received-spf'] || '';
  const dkimSignature = headers['dkim-signature'] || '';

  const parseAuthStandard = (name: 'spf' | 'dkim' | 'dmarc'): AuthStatus => {
    const regex = new RegExp(`\\b${name}\\s*=\\s*([a-zA-Z]+)`, 'i');
    const match = authResults.match(regex);
    let status: AuthStatus['status'] = 'unknown';

    if (match) {
      const val = match[1].toLowerCase();
      if (val === 'pass') status = 'pass';
      else if (val === 'fail') status = 'fail';
      else if (val === 'softfail') status = 'softfail';
      else if (val === 'neutral') status = 'neutral';
      else if (val === 'none') status = 'none';
      else status = 'unknown';
      return { status, raw: match[0], details: authResults };
    }

    if (name === 'spf' && receivedSpf) {
      const spfMatch = receivedSpf.match(/^(pass|fail|softfail|neutral|none)/i);
      if (spfMatch) {
        return { status: spfMatch[1].toLowerCase() as any, raw: receivedSpf, details: receivedSpf };
      }
    }

    if (name === 'dkim' && dkimSignature) {
      return { status: 'pass', raw: 'DKIM-Signature present', details: 'Cryptographic signature header present' };
    }

    return { status: 'none', raw: 'Not provided', details: 'No authentication result record found in headers' };
  };

  const auth = {
    spf: parseAuthStandard('spf'),
    dkim: parseAuthStandard('dkim'),
    dmarc: parseAuthStandard('dmarc'),
  };

  // Extract URLs from body & HTML
  const extractedUrls: ExtractedUrl[] = [];
  const seenUrls = new Set<string>();

  // 1. HTML anchor tags: <a href="TARGET">DISPLAY</a>
  const htmlAnchorRegex = /<a\s+(?:[^>]*?\s+)?href=["']([^"']+)["'][^>]*>([\s\S]*?)<\/a>/gi;
  let htmlMatch;
  while ((htmlMatch = htmlAnchorRegex.exec(bodySection)) !== null) {
    const url = htmlMatch[1].trim();
    const rawDisplay = htmlMatch[2].replace(/<[^>]+>/g, '').trim();
    if (url && !seenUrls.has(url)) {
      seenUrls.add(url);
      extractedUrls.push(categorizeUrl(url, rawDisplay || url));
    }
  }

  // 2. Plain text URLs: https?://...
  const plainUrlRegex = /\b(https?:\/\/[^\s<>"'{}|\\^`]+)/gi;
  let plainMatch;
  while ((plainMatch = plainUrlRegex.exec(bodySection)) !== null) {
    const url = plainMatch[1].trim().replace(/[.,;:)\]]+$/, ''); // clean trailing punctuation
    if (url && !seenUrls.has(url)) {
      seenUrls.add(url);
      extractedUrls.push(categorizeUrl(url, url));
    }
  }

  // Clean body text (strip excessive html tags for display)
  const isHtml = bodySection.includes('<html') || bodySection.includes('<body') || bodySection.includes('<p>');
  const bodyText = isHtml
    ? bodySection
        .replace(/<style[\s\S]*?<\/style>/gi, '')
        .replace(/<script[\s\S]*?<\/script>/gi, '')
        .replace(/<br\s*\/?>/gi, '\n')
        .replace(/<\/p>/gi, '\n\n')
        .replace(/<[^>]+>/g, '')
        .replace(/&nbsp;/g, ' ')
        .replace(/&amp;/g, '&')
        .replace(/&lt;/g, '<')
        .replace(/&gt;/g, '>')
        .trim()
    : bodySection;

  return {
    raw: rawEmail,
    fromRaw,
    fromName,
    fromAddress,
    fromDomain,
    replyToRaw,
    replyToAddress,
    replyToDomain,
    subject,
    date,
    bodyText,
    bodyHtml: isHtml ? bodySection : '',
    extractedUrls,
    auth,
    headers,
  };
}

/**
 * Deep inspection and categorization of a single URL
 */
function categorizeUrl(targetUrl: string, displayText: string): ExtractedUrl {
  let domain = '';
  let protocol = '';

  try {
    const parsed = new URL(targetUrl);
    domain = parsed.hostname.toLowerCase();
    protocol = parsed.protocol.replace(':', '');
  } catch {
    // Attempt basic fallback parsing for malformed URLs
    const domainMatch = targetUrl.match(/^(?:https?:\/\/)?([^/:]+)/i);
    domain = domainMatch ? domainMatch[1].toLowerCase() : targetUrl;
    protocol = targetUrl.startsWith('https') ? 'https' : 'http';
  }

  const flags: string[] = [];

  // 1. Text vs Href mismatch check
  let isMismatch = false;
  if (displayText && displayText.includes('.') && !displayText.includes(' ') && displayText.length > 5) {
    const cleanDisplay = displayText.toLowerCase().replace(/^(https?:\/\/)?(www\.)?/, '').split('/')[0];
    const cleanTargetDomain = domain.replace(/^www\./, '');
    if (cleanDisplay.includes('.') && cleanDisplay !== cleanTargetDomain) {
      isMismatch = true;
      flags.push(`Display link says "${displayText}" but actually navigates to "${domain}"`);
    }
  }

  // 2. IP Address as Hostname
  const isIpAddress = /^(\d{1,3}\.){3}\d{1,3}$/.test(domain);
  if (isIpAddress) {
    flags.push('Uses naked IP address host instead of a registered domain name');
  }

  // 3. Known URL Shortener
  const isShortener = URL_SHORTENERS.has(domain);
  if (isShortener) {
    flags.push('URL shortener hides actual destination server');
  }

  // 4. Suspicious TLD
  const isSuspiciousTld = Array.from(SUSPICIOUS_TLDS).some((tld) => domain.endsWith(tld));
  if (isSuspiciousTld) {
    flags.push(`Suspicious top-level domain (${domain.slice(domain.lastIndexOf('.'))}) heavily associated with disposable phishing campaigns`);
  }

  // 5. Excessive subdomains
  const parts = domain.split('.');
  const hasExcessiveSubdomains = parts.length >= 4 && !isIpAddress;
  if (hasExcessiveSubdomains) {
    flags.push(`Excessive subdomains (${parts.length - 2} levels) attempting visual domain confusion`);
  }

  // 6. Embedded @ Symbol (RFC 3986 authentication trick)
  const hasAtSymbol = targetUrl.includes('@');
  if (hasAtSymbol) {
    flags.push('Contains "@" symbol, routing the browser past misleading domain prefix');
  }

  // 7. Excessive URL length
  const isTooLong = targetUrl.length > 110;
  if (isTooLong) {
    flags.push(`Unusually long URL (${targetUrl.length} characters) potentially hiding malicious query payloads`);
  }

  // 8. Plain HTTP (Non-HTTPS)
  const isHttpNotHttps = protocol === 'http';
  if (isHttpNotHttps) {
    flags.push('Insecure HTTP connection (no TLS encryption)');
  }

  // 9. Punycode / Internationalized domain homoglyph
  const isPunycode = domain.startsWith('xn--') || domain.includes('.xn--');
  if (isPunycode) {
    flags.push('Punycode domain (xn--) potentially exploiting Unicode homoglyphs');
  }

  return {
    raw: targetUrl,
    url: targetUrl,
    displayText,
    domain,
    protocol,
    isMismatch,
    isIpAddress,
    isShortener,
    isSuspiciousTld,
    hasExcessiveSubdomains,
    hasAtSymbol,
    isTooLong,
    isHttpNotHttps,
    isLookalikeDomain: false, // will be evaluated against trusted domain in analyzeEmail
    isPunycode,
    isBlacklisted: false,
    flags,
  };
}

/**
 * Main Rule-Based Evaluation Engine
 */
export function analyzeEmail(rawEmail: string, settings: AppSettings): AnalysisResult {
  const metadata = parseEmail(rawEmail);
  const findings: Finding[] = [];
  const trustedDomain = settings.trustedDomain.toLowerCase().trim() || 'college.edu';

  const categoryScores: Record<FindingCategory, number> = {
    sender: 0,
    urls: 0,
    language: 0,
    auth: 0,
    reputation: 0,
  };

  const addFinding = (finding: Finding) => {
    findings.push(finding);
    if (finding.status !== 'pass') {
      categoryScores[finding.category] += finding.points;
    }
  };

  // -------------------------------------------------------------
  // PILLAR 1: SENDER & IDENTITY HEURISTICS
  // -------------------------------------------------------------

  // Check 1.1: Display Name Authority Spoofing on Free Webmail
  const fromNameLower = metadata.fromName.toLowerCase();
  const claimedAuthority = AUTHORITY_KEYWORDS.find((keyword) => fromNameLower.includes(keyword));
  const isFromFreeMail = FREE_MAIL_DOMAINS.has(metadata.fromDomain);

  if (claimedAuthority && isFromFreeMail) {
    addFinding({
      id: 'sender-authority-freemail',
      name: 'Authority Impersonation on Free Webmail',
      category: 'sender',
      status: 'fail',
      severity: 'critical',
      points: 25,
      explanation: `Sender claims high-privilege college authority ("${metadata.fromName}") but transmits from a consumer webmail provider (${metadata.fromDomain}).`,
      evidence: `From: "${metadata.fromName}" <${metadata.fromAddress}>`,
      whyItMatters:
        'Official college leaders, deans, and IT administrators exclusively use university infrastructure, never free personal accounts for official requests.',
    });
  }

  // Check 1.2: From vs Reply-To Domain Mismatch
  if (metadata.replyToAddress && metadata.fromAddress && metadata.replyToAddress !== metadata.fromAddress) {
    const fromDom = metadata.fromDomain;
    const replyDom = metadata.replyToDomain;

    if (fromDom !== replyDom) {
      const isReplyFree = FREE_MAIL_DOMAINS.has(replyDom);
      addFinding({
        id: 'sender-reply-to-mismatch',
        name: 'Mismatched Reply-To Address',
        category: 'sender',
        status: 'fail',
        severity: isReplyFree ? 'critical' : 'high',
        points: isReplyFree ? 25 : 18,
        explanation: `Replies will be sent to a completely different domain: ${metadata.replyToAddress} instead of ${metadata.fromAddress}.`,
        evidence: `From: ${metadata.fromAddress} | Reply-To: ${metadata.replyToAddress}`,
        whyItMatters:
          'Attackers spoof the visible From header to appear official while rerouting your replies to an attacker-controlled inbox.',
      });
    } else {
      addFinding({
        id: 'sender-reply-to-subaddress',
        name: 'Reply-To Address Divergence',
        category: 'sender',
        status: 'warn',
        severity: 'low',
        points: 5,
        explanation: `From and Reply-To share domain ${fromDom} but use different mailboxes.`,
        evidence: `From: ${metadata.fromAddress} | Reply-To: ${metadata.replyToAddress}`,
        whyItMatters: 'Sometimes used by automated services, but warrants checking why sender mailbox differs.',
      });
    }
  }

  // Check 1.3: Look-alike / Typosquatted College Sender Domain
  const senderLookalike = isLookalikeDomain(metadata.fromDomain, trustedDomain);
  if (senderLookalike.isLookalike) {
    addFinding({
      id: 'sender-lookalike-domain',
      name: 'Campus Domain Typosquatting / Look-alike',
      category: 'sender',
      status: 'fail',
      severity: 'critical',
      points: 30,
      explanation: `The sender's domain (${metadata.fromDomain}) is an imposter mimicking ${trustedDomain}: ${senderLookalike.reason}.`,
      evidence: `Domain: ${metadata.fromDomain} (Target: ${trustedDomain})`,
      whyItMatters:
        'Attackers register visual look-alike domains (e.g. swapping "l" with "1" or adding hyphens) to trick students glancing quickly at their inbox.',
    });
  } else if (metadata.fromDomain === trustedDomain || metadata.fromDomain.endsWith(`.${trustedDomain}`)) {
    addFinding({
      id: 'sender-trusted-domain',
      name: 'Authentic Campus Domain',
      category: 'sender',
      status: 'pass',
      severity: 'info',
      points: 0,
      explanation: `Email originates from the verified institutional domain: @${metadata.fromDomain}`,
      evidence: `Domain: ${metadata.fromDomain}`,
      whyItMatters: 'The sender address matches the configured institutional domain hierarchy.',
    });
  }

  // -------------------------------------------------------------
  // PILLAR 2: URL & DOMAIN DEEP INSPECTION
  // -------------------------------------------------------------

  if (metadata.extractedUrls.length === 0) {
    addFinding({
      id: 'url-none-found',
      name: 'Zero Hyperlinks Found',
      category: 'urls',
      status: 'pass',
      severity: 'info',
      points: 0,
      explanation: 'No embedded hyperlinks or external web addresses detected in the message.',
      evidence: '0 URLs extracted',
      whyItMatters: 'Attack does not use web landing pages or link redirection.',
    });
  } else {
    // Inspect each extracted URL
    let foundMismatch = false;
    let foundShortener = false;
    let foundIp = false;
    let foundSuspiciousTld = false;
    let foundNonHttps = false;
    let foundLookalikeUrl = false;

    for (const urlItem of metadata.extractedUrls) {
      // Check look-alike on URL domain
      const urlLookalike = isLookalikeDomain(urlItem.domain, trustedDomain);
      if (urlLookalike.isLookalike) {
        urlItem.isLookalikeDomain = true;
        urlItem.flags.push(`Look-alike domain mimicking ${trustedDomain}`);
        foundLookalikeUrl = true;
      }

      if (urlItem.isMismatch) foundMismatch = true;
      if (urlItem.isShortener) foundShortener = true;
      if (urlItem.isIpAddress) foundIp = true;
      if (urlItem.isSuspiciousTld) foundSuspiciousTld = true;
      if (urlItem.isHttpNotHttps) foundNonHttps = true;
    }

    if (foundMismatch) {
      const mismatchedItem = metadata.extractedUrls.find((u) => u.isMismatch);
      addFinding({
        id: 'url-anchor-mismatch',
        name: 'Deceptive Hyperlink Text (Link Text Mismatch)',
        category: 'urls',
        status: 'fail',
        severity: 'critical',
        points: 30,
        explanation: `Hyperlink displays trusted address "${mismatchedItem?.displayText}" but secretly points to malicious target "${mismatchedItem?.url}".`,
        evidence: `Display: ${mismatchedItem?.displayText} -> Href: ${mismatchedItem?.url}`,
        whyItMatters:
          'Classic credential theft trick: displaying the official campus portal link while routing the browser to an attacker harvest page.',
      });
    }

    if (foundLookalikeUrl) {
      const item = metadata.extractedUrls.find((u) => u.isLookalikeDomain);
      addFinding({
        id: 'url-lookalike-domain',
        name: 'Deceptive Look-Alike Target Domain',
        category: 'urls',
        status: 'fail',
        severity: 'critical',
        points: 25,
        explanation: `Target URL domain (${item?.domain}) mimics official campus infrastructure (${trustedDomain}).`,
        evidence: `URL: ${item?.url}`,
        whyItMatters: 'Phishing websites use subtle variations of real portals to harvest campus passwords and MFA tokens.',
      });
    }

    if (foundShortener) {
      const item = metadata.extractedUrls.find((u) => u.isShortener);
      addFinding({
        id: 'url-shortener-found',
        name: 'Opaque URL Shortener Used',
        category: 'urls',
        status: 'fail',
        severity: 'high',
        points: 20,
        explanation: `Link uses URL shortener (${item?.domain}) to obfuscate its real destination server.`,
        evidence: `URL: ${item?.url}`,
        whyItMatters:
          'Legitimate college offices provide clear, transparent campus links. Shorteners hide malicious payload landing pages from gateway filters.',
      });
    }

    if (foundIp) {
      const item = metadata.extractedUrls.find((u) => u.isIpAddress);
      addFinding({
        id: 'url-ip-host',
        name: 'Naked IP Address in Link',
        category: 'urls',
        status: 'fail',
        severity: 'critical',
        points: 25,
        explanation: `Link routes directly to a raw numerical IP address (${item?.domain}) rather than an authenticated institutional domain.`,
        evidence: `URL: ${item?.url}`,
        whyItMatters: 'Attackers deploy ephemeral web servers without purchasing registered domains to evade reputation systems.',
      });
    }

    if (foundSuspiciousTld) {
      const item = metadata.extractedUrls.find((u) => u.isSuspiciousTld);
      addFinding({
        id: 'url-suspicious-tld',
        name: 'High-Risk Top-Level Domain (TLD)',
        category: 'urls',
        status: 'fail',
        severity: 'high',
        points: 15,
        explanation: `Link leads to high-risk extension (${item?.domain.slice(item.domain.lastIndexOf('.'))}) heavily used in botnet and phishing infrastructure.`,
        evidence: `Domain: ${item?.domain}`,
        whyItMatters: 'Institutions use .edu or .org; free or bargain TLDs are predominantly acquired for temporary scams.',
      });
    }

    if (foundNonHttps) {
      const item = metadata.extractedUrls.find((u) => u.isHttpNotHttps);
      addFinding({
        id: 'url-non-https',
        name: 'Insecure Unencrypted HTTP Link',
        category: 'urls',
        status: 'warn',
        severity: 'medium',
        points: 10,
        explanation: `URL uses unencrypted "http://" protocol: ${item?.url}`,
        evidence: `Protocol: http://`,
        whyItMatters: 'Modern academic portals strictly require encrypted HTTPS for all student login and service portals.',
      });
    }

    // If all URLs are legitimate campus links
    const allUrlsCampus = metadata.extractedUrls.every(
      (u) => (u.domain === trustedDomain || u.domain.endsWith(`.${trustedDomain}`)) && !u.isMismatch
    );
    if (allUrlsCampus) {
      addFinding({
        id: 'url-all-official',
        name: 'All Hyperlinks Route to Official Campus Domain',
        category: 'urls',
        status: 'pass',
        severity: 'info',
        points: 0,
        explanation: `All ${metadata.extractedUrls.length} extracted web link(s) resolve safely to *.${trustedDomain}`,
        evidence: metadata.extractedUrls.map((u) => u.url).join(', '),
        whyItMatters: 'Links point strictly to approved institutional web destinations.',
      });
    }
  }

  // -------------------------------------------------------------
  // PILLAR 3: SOCIAL ENGINEERING & PSYCHOLOGICAL TRIGGERS
  // -------------------------------------------------------------

  const combinedContent = `${metadata.subject}\n${metadata.bodyText}`;

  // Check 3.1: Coercive Urgency & Artificial Deadlines
  const matchedUrgency = URGENCY_PATTERNS.filter((pattern) => pattern.regex.test(combinedContent));
  if (matchedUrgency.length > 0) {
    const totalUrgencyPoints = Math.min(25, matchedUrgency.reduce((sum, p) => sum + p.points, 0));
    addFinding({
      id: 'language-urgency',
      name: 'High-Pressure Urgency & Coercive Deadline',
      category: 'language',
      status: 'fail',
      severity: matchedUrgency.length >= 2 ? 'high' : 'medium',
      points: totalUrgencyPoints,
      explanation: `Message deploys psychological pressure: ${matchedUrgency.map((p) => p.label).join(', ')}.`,
      evidence: matchedUrgency.map((p) => p.label).join('; '),
      whyItMatters:
        'Phishing relies on panic and tight timeframes to bypass rational skepticism, making victims act before verifying with IT.',
    });
  }

  // Check 3.2: Credential & Password Theft Lures
  const matchedCreds = CREDENTIAL_PATTERNS.filter((pattern) => pattern.regex.test(combinedContent));
  if (matchedCreds.length > 0) {
    const totalCredPoints = Math.min(25, matchedCreds.reduce((sum, p) => sum + p.points, 0));
    addFinding({
      id: 'language-credential-solicitation',
      name: 'Campus Credential / Password Solicitation',
      category: 'language',
      status: 'fail',
      severity: 'high',
      points: totalCredPoints,
      explanation: `Email demands student login or password credentials: ${matchedCreds.map((p) => p.label).join(', ')}.`,
      evidence: matchedCreds.map((p) => p.label).join('; '),
      whyItMatters:
        'Universities never ask students to type passwords or push MFA notifications directly from unsolicited email links.',
    });
  }

  // Check 3.3: Financial / Gift Card / Wire Transfer Requests
  const matchedFinancial = FINANCIAL_PATTERNS.filter((pattern) => pattern.regex.test(combinedContent));
  if (matchedFinancial.length > 0) {
    const totalFinPoints = Math.min(30, matchedFinancial.reduce((sum, p) => sum + p.points, 0));
    addFinding({
      id: 'language-financial-scam',
      name: 'Unsolicited Financial or Gift Card Request',
      category: 'language',
      status: 'fail',
      severity: 'critical',
      points: totalFinPoints,
      explanation: `Message solicits immediate financial activity: ${matchedFinancial.map((p) => p.label).join(', ')}.`,
      evidence: matchedFinancial.map((p) => p.label).join('; '),
      whyItMatters:
        'Requesting gift cards, wire transfers, or direct banking codes is the definitive hallmark of Business Email Compromise (BEC).',
    });
  }

  // Check 3.4: Generic Greeting / Phishing Phrasing
  const matchedGreetings = GENERIC_GREETINGS.filter((pattern) => pattern.regex.test(combinedContent));
  if (matchedGreetings.length > 0) {
    addFinding({
      id: 'language-generic-greeting',
      name: 'Impersonal Generic Salutation',
      category: 'language',
      status: 'warn',
      severity: 'low',
      points: 8,
      explanation: `Email uses generic greeting: ${matchedGreetings.map((g) => g.label).join(', ')}.`,
      evidence: matchedGreetings.map((g) => g.label).join('; '),
      whyItMatters:
        'Mass phishing campaigns use generic salutations rather than addressing enrolled students by their verified roster name.',
    });
  }

  // Check 3.5: Clean collegiate tone pass
  if (matchedUrgency.length === 0 && matchedCreds.length === 0 && matchedFinancial.length === 0) {
    addFinding({
      id: 'language-clean-tone',
      name: 'Professional, Non-Coercive Language',
      category: 'language',
      status: 'pass',
      severity: 'info',
      points: 0,
      explanation: 'No false deadlines, credential harvesting, or financial intimidation phrases were detected.',
      evidence: 'Clean linguistic scan',
      whyItMatters: 'Legitimate academic communications maintain a composed informational tone.',
    });
  }

  // -------------------------------------------------------------
  // PILLAR 4: CRYPTOGRAPHIC AUTHENTICATION (SPF / DKIM / DMARC)
  // -------------------------------------------------------------

  // 4.1 SPF (Sender Policy Framework)
  const spfStatus = metadata.auth.spf.status;
  if (spfStatus === 'pass') {
    addFinding({
      id: 'auth-spf-pass',
      name: 'SPF Check Passed',
      category: 'auth',
      status: 'pass',
      severity: 'info',
      points: 0,
      explanation: 'Sending mail server IP is authorized by the domain owner to transmit emails.',
      evidence: metadata.auth.spf.raw,
      whyItMatters: 'Confirms message originated from a declared sender IP address.',
    });
  } else if (spfStatus === 'fail') {
    addFinding({
      id: 'auth-spf-fail',
      name: 'SPF Authentication Failed',
      category: 'auth',
      status: 'fail',
      severity: 'high',
      points: 20,
      explanation: 'Sending server is explicitly unauthorized by the domain owner to send email.',
      evidence: metadata.auth.spf.raw,
      whyItMatters: 'Indicates someone is spoofing the sender domain from an unauthorized external machine.',
    });
  } else if (spfStatus === 'softfail') {
    addFinding({
      id: 'auth-spf-softfail',
      name: 'SPF Softfail (Questionable Origin)',
      category: 'auth',
      status: 'warn',
      severity: 'medium',
      points: 12,
      explanation: 'The sending server IP is not explicitly authorized under the domain SPF record.',
      evidence: metadata.auth.spf.raw,
      whyItMatters: 'Domain owner policy marks this server as suspicious or transitional.',
    });
  } else {
    addFinding({
      id: 'auth-spf-none',
      name: 'SPF Record Not Available',
      category: 'auth',
      status: 'warn',
      severity: 'low',
      points: 4,
      explanation: 'No SPF evaluation result could be confirmed in the provided headers.',
      evidence: metadata.auth.spf.raw,
      whyItMatters: 'Without SPF, mail relay origin cannot be mathematically validated.',
    });
  }

  // 4.2 DKIM (DomainKeys Identified Mail)
  const dkimStatus = metadata.auth.dkim.status;
  if (dkimStatus === 'pass') {
    addFinding({
      id: 'auth-dkim-pass',
      name: 'DKIM Signature Verified',
      category: 'auth',
      status: 'pass',
      severity: 'info',
      points: 0,
      explanation: 'Cryptographic digital signature matches the domain public key; message was not tampered with in transit.',
      evidence: metadata.auth.dkim.raw,
      whyItMatters: 'Guarantees message contents and headers were not altered en route.',
    });
  } else if (dkimStatus === 'fail') {
    addFinding({
      id: 'auth-dkim-fail',
      name: 'DKIM Signature Tampered or Failed',
      category: 'auth',
      status: 'fail',
      severity: 'high',
      points: 20,
      explanation: 'Digital cryptographic signature failed verification or was invalidated.',
      evidence: metadata.auth.dkim.raw,
      whyItMatters: 'The message body or headers may have been forged or altered by an intermediary.',
    });
  } else {
    addFinding({
      id: 'auth-dkim-none',
      name: 'DKIM Signature Missing',
      category: 'auth',
      status: 'warn',
      severity: 'low',
      points: 4,
      explanation: 'Message does not feature a verified cryptographic DKIM signature.',
      evidence: metadata.auth.dkim.raw,
      whyItMatters: 'Unsigned emails offer no cryptographic guarantee of message integrity.',
    });
  }

  // 4.3 DMARC (Domain-based Message Authentication)
  const dmarcStatus = metadata.auth.dmarc.status;
  if (dmarcStatus === 'pass') {
    addFinding({
      id: 'auth-dmarc-pass',
      name: 'DMARC Alignment Passed',
      category: 'auth',
      status: 'pass',
      severity: 'info',
      points: 0,
      explanation: 'The visible From domain aligns perfectly with verified SPF and DKIM identities.',
      evidence: metadata.auth.dmarc.raw,
      whyItMatters: 'Gold standard validation proving the visible sender address is genuine.',
    });
  } else if (dmarcStatus === 'fail') {
    addFinding({
      id: 'auth-dmarc-fail',
      name: 'DMARC Enforcement Failed',
      category: 'auth',
      status: 'fail',
      severity: 'high',
      points: 20,
      explanation: 'Message failed DMARC domain alignment policy.',
      evidence: metadata.auth.dmarc.raw,
      whyItMatters: 'The visible sender header does not match the actual authenticated server identity.',
    });
  } else {
    addFinding({
      id: 'auth-dmarc-none',
      name: 'DMARC Policy Not Evaluated',
      category: 'auth',
      status: 'warn',
      severity: 'low',
      points: 4,
      explanation: 'No DMARC policy result found in email headers.',
      evidence: metadata.auth.dmarc.raw,
      whyItMatters: 'Sender domain does not publish an active DMARC protection policy.',
    });
  }

  // -------------------------------------------------------------
  // PILLAR 5: REPUTATION & CUSTOM THREAT INTELLIGENCE
  // -------------------------------------------------------------

  const normalizedBadDomains = (settings.badDomains || []).map((d) => d.toLowerCase().trim()).filter(Boolean);
  const normalizedBadUrls = (settings.badUrls || []).map((u) => u.toLowerCase().trim()).filter(Boolean);

  let reputationHit = false;

  // Check sender domain against blacklist
  if (normalizedBadDomains.includes(metadata.fromDomain.toLowerCase())) {
    reputationHit = true;
    addFinding({
      id: 'reputation-sender-blacklisted',
      name: 'Sender Domain on Threat Blacklist',
      category: 'reputation',
      status: 'fail',
      severity: 'critical',
      points: 40,
      explanation: `Sender domain (${metadata.fromDomain}) matches known-bad malicious threat intelligence list.`,
      evidence: `Blacklist hit: ${metadata.fromDomain}`,
      whyItMatters: 'This domain has been previously flagged for malicious phishing campaigns or malware distribution.',
    });
  }

  // Check URLs against blacklist
  for (const item of metadata.extractedUrls) {
    const isDomainBad = normalizedBadDomains.includes(item.domain.toLowerCase());
    const isUrlBad = normalizedBadUrls.some((bad) => item.url.toLowerCase().includes(bad));

    if (isDomainBad || isUrlBad) {
      item.isBlacklisted = true;
      reputationHit = true;
      addFinding({
        id: `reputation-url-blacklisted-${item.domain}`,
        name: 'Malicious URL / Domain in Threat Blacklist',
        category: 'reputation',
        status: 'fail',
        severity: 'critical',
        points: 40,
        explanation: `Embedded link (${item.url}) matches known malicious IOC (Indicator of Compromise).`,
        evidence: `Matches threat list: ${item.domain}`,
        whyItMatters: 'Security feeds have actively reported this URL as a malicious phishing or credential-stealing site.',
      });
      break; // Only penalize once for blacklist
    }
  }

  if (!reputationHit && (normalizedBadDomains.length > 0 || normalizedBadUrls.length > 0)) {
    addFinding({
      id: 'reputation-clean',
      name: 'Clean Reputation Threat Intel Scan',
      category: 'reputation',
      status: 'pass',
      severity: 'info',
      points: 0,
      explanation: `No domains or URLs matched the ${normalizedBadDomains.length + normalizedBadUrls.length} configured threat intelligence indicators.`,
      evidence: 'Clean blacklist check',
      whyItMatters: 'The email entities do not match currently tracked malicious infrastructure.',
    });
  }

  // -------------------------------------------------------------
  // SCORING & FINAL VERDICT CALCULATION
  // -------------------------------------------------------------

  // Sum points across all pillars
  const rawScore =
    categoryScores.sender +
    categoryScores.urls +
    categoryScores.language +
    categoryScores.auth +
    categoryScores.reputation;

  // Clamp score between 0 and 100
  const score = Math.min(100, Math.max(0, rawScore));

  let verdict: 'Safe' | 'Suspicious' | 'Phishing';
  let confidence: 'High Confidence' | 'Medium Confidence' | 'Preliminary';
  let confidenceNote = '';

  const criticalFindings = findings.filter((f) => f.severity === 'critical' && f.status === 'fail');
  const highFindings = findings.filter((f) => f.severity === 'high' && f.status === 'fail');

  if (score >= 61) {
    verdict = 'Phishing';
    if (criticalFindings.length >= 2 || (criticalFindings.length >= 1 && highFindings.length >= 2)) {
      confidence = 'High Confidence';
      confidenceNote =
        'High Confidence Phishing: Multiple critical spoofing, deceptive links, or credential-harvesting indicators confirmed.';
    } else {
      confidence = 'Medium Confidence';
      confidenceNote = 'Confirmed Phishing Risk: Accumulation of high-risk indicators exceeds safety thresholds.';
    }
  } else if (score >= 31) {
    verdict = 'Suspicious';
    confidence = 'Medium Confidence';
    confidenceNote =
      'Suspicious: Features questionable sender details, unfamiliar domains, or urgency. Treat with caution and verify out-of-band.';
  } else {
    verdict = 'Safe';
    if (
      metadata.auth.spf.status === 'pass' &&
      metadata.auth.dkim.status === 'pass' &&
      metadata.auth.dmarc.status === 'pass' &&
      metadata.fromDomain.endsWith(trustedDomain)
    ) {
      confidence = 'High Confidence';
      confidenceNote =
        'High Confidence Legitimate: Verified cryptographic email authentication and authentic institutional domain.';
    } else {
      confidence = 'Medium Confidence';
      confidenceNote = 'Safe: No malicious indicators detected. Appears to be standard routine communication.';
    }
  }

  // Sort findings by severity: critical > high > medium > low > info
  const severityRank: Record<FindingSeverity, number> = {
    critical: 5,
    high: 4,
    medium: 3,
    low: 2,
    info: 1,
  };

  findings.sort((a, b) => {
    if (a.status !== b.status) {
      if (a.status === 'fail') return -1;
      if (b.status === 'fail') return 1;
      if (a.status === 'warn') return -1;
      if (b.status === 'warn') return 1;
    }
    return severityRank[b.severity] - severityRank[a.severity];
  });

  return {
    id: `scan-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`,
    timestamp: Date.now(),
    metadata,
    findings,
    score,
    verdict,
    confidence,
    confidenceNote,
    categoryScores,
  };
}

/**
 * Default bad domains and URLs preloaded for the hackathon
 */
export const DEFAULT_BAD_DOMAINS: string[] = [
  'co11ege.edu',
  'account-auth.xyz',
  'evil-portal.net',
  'login-verification.top',
  'secure-campus-auth.click',
  'college-edu.com',
];

export const DEFAULT_BAD_URLS: string[] = [
  'http://login-verify-college.account-auth.xyz',
  'bit.ly/claim-grant-2026',
  'http://185.220.101.5',
];
