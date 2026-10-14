export interface ExtractedUrl {
  raw: string;
  url: string;
  displayText: string;
  domain: string;
  protocol: string;
  isMismatch: boolean;
  isIpAddress: boolean;
  isShortener: boolean;
  isSuspiciousTld: boolean;
  hasExcessiveSubdomains: boolean;
  hasAtSymbol: boolean;
  isTooLong: boolean;
  isHttpNotHttps: boolean;
  isLookalikeDomain: boolean;
  isPunycode: boolean;
  isBlacklisted: boolean;
  flags: string[];
}

export interface AuthStatus {
  status: 'pass' | 'fail' | 'softfail' | 'neutral' | 'none' | 'unknown';
  raw: string;
  details?: string;
}

export interface EmailMetadata {
  raw: string;
  fromRaw: string;
  fromName: string;
  fromAddress: string;
  fromDomain: string;
  replyToRaw: string;
  replyToAddress: string;
  replyToDomain: string;
  subject: string;
  date: string;
  bodyText: string;
  bodyHtml: string;
  extractedUrls: ExtractedUrl[];
  auth: {
    spf: AuthStatus;
    dkim: AuthStatus;
    dmarc: AuthStatus;
  };
  headers: Record<string, string>;
}

export type FindingSeverity = 'critical' | 'high' | 'medium' | 'low' | 'info';
export type FindingCategory = 'sender' | 'urls' | 'language' | 'auth' | 'reputation';

export interface Finding {
  id: string;
  name: string;
  category: FindingCategory;
  status: 'pass' | 'warn' | 'fail';
  severity: FindingSeverity;
  points: number;
  explanation: string;
  evidence: string;
  whyItMatters: string;
}

export interface AnalysisResult {
  id: string;
  timestamp: number;
  metadata: EmailMetadata;
  findings: Finding[];
  score: number; // 0 - 100
  verdict: 'Safe' | 'Suspicious' | 'Phishing';
  confidence: 'High Confidence' | 'Medium Confidence' | 'Preliminary';
  confidenceNote: string;
  categoryScores: Record<FindingCategory, number>;
  aiExplanation?: string;
}

export interface AppSettings {
  trustedDomain: string;
  badDomains: string[];
  badUrls: string[];
}

export interface EmailSample {
  id: string;
  title: string;
  category: 'legitimate' | 'phishing';
  description: string;
  rawEmail: string;
}
