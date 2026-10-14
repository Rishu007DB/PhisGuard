import React, { useState, useEffect } from 'react';
import {
  Presentation,
  ChevronLeft,
  ChevronRight,
  Maximize2,
  Minimize2,
  ShieldCheck,
  ShieldAlert,
  AlertTriangle,
  FileText,
  Search,
  Eye,
  BarChart3,
  Sparkles,
  Lock,
  Layers,
  Terminal,
  Cpu,
  CheckCircle2,
  HelpCircle,
} from 'lucide-react';

interface Slide {
  id: number;
  title: string;
  subtitle: string;
  badge: string;
  content: React.ReactNode;
  speakerNotes?: string;
}

export const PresentationDeck: React.FC = () => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isFullscreen, setIsFullscreen] = useState(false);

  const slides: Slide[] = [
    {
      id: 1,
      badge: 'Project Overview & Title',
      title: 'PhishGuard: Explainable Email Security & Phishing Investigation',
      subtitle: 'A zero-click, rule-based forensic analyzer for university cybersecurity hackathons',
      speakerNotes: `Good morning, judges and fellow hackers. Today, I am proud to present PhishGuard: an explainable email security and phishing investigation platform. 
As university students, our campus inboxes are bombarded daily with fake financial aid grants, urgent messages claiming our passwords expire in 24 hours, and emails impersonating college deans asking for gift cards.
Most modern security tools are "black boxes"—they give a vague score or quarantine an email without telling students WHY. PhishGuard changes that: every verdict is 100% transparent, backed by mathematical and forensic evidence that students can learn from.`,
      content: (
        <div className="space-y-6">
          <div className="p-8 rounded-2xl bg-gradient-to-br from-slate-900 via-slate-900 to-indigo-950/60 border border-slate-700/80 shadow-2xl relative overflow-hidden">
            <div className="absolute top-0 right-0 p-8 opacity-10 pointer-events-none">
              <ShieldAlert className="w-64 h-64 text-cyan-400" />
            </div>
            <div className="relative z-10 space-y-4 max-w-2xl">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold tracking-wider uppercase bg-cyan-500/20 text-cyan-300 border border-cyan-500/40">
                <Sparkles className="w-3.5 h-3.5" /> Hackathon Final Pitch
              </span>
              <h2 className="text-3xl sm:text-4xl font-black text-white tracking-tight leading-tight">
                Phish<span className="text-cyan-400">Guard</span>
              </h2>
              <p className="text-base text-slate-300 leading-relaxed font-medium">
                Demystifying email threats with instant, client-side, explainable forensics.
              </p>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-4 text-xs font-mono">
                <div className="bg-slate-950/80 p-3 rounded-xl border border-slate-800">
                  <span className="text-slate-400 block text-[10px]">ENGINE</span>
                  <span className="text-cyan-300 font-bold">100% In-Browser</span>
                </div>
                <div className="bg-slate-950/80 p-3 rounded-xl border border-slate-800">
                  <span className="text-slate-400 block text-[10px]">CORE MODEL</span>
                  <span className="text-emerald-300 font-bold">Rule-Based</span>
                </div>
                <div className="bg-slate-950/80 p-3 rounded-xl border border-slate-800">
                  <span className="text-slate-400 block text-[10px]">SANDBOX</span>
                  <span className="text-purple-300 font-bold">Zero-Click Safe</span>
                </div>
                <div className="bg-slate-950/80 p-3 rounded-xl border border-slate-800">
                  <span className="text-slate-400 block text-[10px]">AI EXPLAINER</span>
                  <span className="text-amber-300 font-bold">Gemini 3.8 Flash</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      ),
    },
    {
      id: 2,
      badge: 'The Problem Statement',
      title: 'The College Phishing Epidemic & The "Black-Box" Dilemma',
      subtitle: 'Why college students remain the #1 target for social engineering and credential theft',
      speakerNotes: `Let's look at the problem statement. Why did we build this?
First: College students are under immense academic pressure, working jobs, and constantly checking emails on mobile phones. Attackers exploit this with high-urgency lures: "Your password expires in 24 hours" or "Urgent research assistant position."
Second: The "Black-Box" Problem. Standard enterprise email gateways either silently dump emails into Spam or flag them with a generic warning like "Be careful with this email." Students never learn WHY it was flagged. Does it have an SPF failure? Is the domain co11ege.edu with two ones? Is the link text pointing to an external .xyz server?
Because students are kept in the dark, they copy-paste the URL or reply anyway, leading to account takeover and financial losses.`,
      content: (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-slate-900 border border-rose-500/30 rounded-2xl p-6 space-y-4">
            <div className="flex items-center gap-2 text-rose-400 font-bold text-sm">
              <AlertTriangle className="w-5 h-5" />
              <span>Pain Point 1: Campus Attack Tactics</span>
            </div>
            <ul className="space-y-3 text-xs text-slate-300 leading-relaxed">
              <li className="flex items-start gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-rose-400 mt-1.5 shrink-0" />
                <span><strong>Look-alike Domain Typosquatting:</strong> Subtle visual swaps like <code>co11ege.edu</code> or <code>college-edu.com</code> go unnoticed on small phone screens.</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-rose-400 mt-1.5 shrink-0" />
                <span><strong>Deceptive Anchor Links:</strong> The visible text reads <code>https://portal.college.edu</code>, but the underlying HTML <code>href</code> redirects to a phishing kit.</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-rose-400 mt-1.5 shrink-0" />
                <span><strong>Artificial 24-Hour Panics:</strong> Coercive psychological triggers force impulsive credential entry.</span>
              </li>
            </ul>
          </div>

          <div className="bg-slate-900 border border-amber-500/30 rounded-2xl p-6 space-y-4">
            <div className="flex items-center gap-2 text-amber-400 font-bold text-sm">
              <HelpCircle className="w-5 h-5" />
              <span>Pain Point 2: The Black-Box Education Gap</span>
            </div>
            <ul className="space-y-3 text-xs text-slate-300 leading-relaxed">
              <li className="flex items-start gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-amber-400 mt-1.5 shrink-0" />
                <span><strong>Zero Actionable Explanations:</strong> Generic spam filters say "Suspicious" with zero proof or forensic justification.</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-amber-400 mt-1.5 shrink-0" />
                <span><strong>No Investigative Agency:</strong> Students cannot see the SPF/DKIM/DMARC headers, reply-to rerouting, or hidden shorteners.</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-amber-400 mt-1.5 shrink-0" />
                <span><strong>Alert Fatigue:</strong> Over-filtering causes students to ignore actual security notices.</span>
              </li>
            </ul>
          </div>
        </div>
      ),
    },
    {
      id: 3,
      badge: 'The Proposed Solution',
      title: 'Our Solution: The 5-Pillar Explainable Triage Engine',
      subtitle: 'Deterministic, rule-based forensics coupled with student-friendly visual evidence',
      speakerNotes: `Our solution is PhishGuard: an interactive, explainable email investigation platform built from the ground up for clarity and speed.
Instead of relying on opaque heuristics, PhishGuard evaluates emails across Five Core Security Pillars:
1. Sender Identity & Typosquatting
2. Deep URL & Domain Inspection
3. Social Engineering Language & Psychological Coercion
4. Cryptographic Header Standards (SPF, DKIM, DMARC)
5. Custom Threat Intelligence & Reputation Blacklisting.
Every single rule outputs: the check name, a pass/warn/fail status, points added to a 0-100 risk score, the exact evidence snippet found, and a plain-English explanation answering "Why this matters for students."`,
      content: (
        <div className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-3 lg:grid-cols-5 gap-3 text-xs">
            <div className="bg-slate-900 p-4 rounded-xl border border-cyan-500/30 space-y-2">
              <div className="text-cyan-400 font-bold flex items-center gap-1.5">
                <Search className="w-4 h-4" /> 1. Sender
              </div>
              <p className="text-slate-300 text-[11px] leading-relaxed">
                Authority claims on free webmail (Gmail/Yahoo), Reply-To domain divergence, and homoglyph typosquatting.
              </p>
            </div>

            <div className="bg-slate-900 p-4 rounded-xl border border-rose-500/30 space-y-2">
              <div className="text-rose-400 font-bold flex items-center gap-1.5">
                <Eye className="w-4 h-4" /> 2. URLs
              </div>
              <p className="text-slate-300 text-[11px] leading-relaxed">
                Anchor text vs href mismatches, bit.ly shorteners, naked IP hosts, suspicious TLDs (.xyz, .ru), deep subdomains.
              </p>
            </div>

            <div className="bg-slate-900 p-4 rounded-xl border border-amber-500/30 space-y-2">
              <div className="text-amber-400 font-bold flex items-center gap-1.5">
                <AlertTriangle className="w-4 h-4" /> 3. Language
              </div>
              <p className="text-slate-300 text-[11px] leading-relaxed">
                Urgency (within 24h), credential requests (password/SSO/2FA), gift cards, wire transfer, and generic greetings.
              </p>
            </div>

            <div className="bg-slate-900 p-4 rounded-xl border border-emerald-500/30 space-y-2">
              <div className="text-emerald-400 font-bold flex items-center gap-1.5">
                <ShieldCheck className="w-4 h-4" /> 4. Auth
              </div>
              <p className="text-slate-300 text-[11px] leading-relaxed">
                Mathematical validation of SPF relay authorization, DKIM tamper-proof signatures, and DMARC alignment.
              </p>
            </div>

            <div className="bg-slate-900 p-4 rounded-xl border border-purple-500/30 space-y-2">
              <div className="text-purple-400 font-bold flex items-center gap-1.5">
                <Layers className="w-4 h-4" /> 5. Threat Intel
              </div>
              <p className="text-slate-300 text-[11px] leading-relaxed">
                Real-time matching against configurable known-bad malicious domains and phishing IOC feeds.
              </p>
            </div>
          </div>

          <div className="p-4 rounded-xl bg-slate-900/60 border border-slate-800 text-xs text-slate-300 flex items-center justify-between">
            <span className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-ping" />
              <strong>Scoring Formula:</strong> Risk points sum from 0 to 100 &rarr; 0-30 = Safe (Green), 31-60 = Suspicious (Amber), 61-100 = Phishing (Red).
            </span>
            <span className="text-cyan-400 font-mono">100% Deterministic &amp; Auditable</span>
          </div>
        </div>
      ),
    },
    {
      id: 4,
      badge: 'Feasibility & Engineering',
      title: 'System Architecture & Technical Feasibility',
      subtitle: 'Why PhishGuard is lightweight, ultra-fast, and zero-cost to deploy campus-wide',
      speakerNotes: `Now, let's talk about Technical Feasibility. How feasible is this in real-world deployment?
The answer: Extremely feasible, because the core analysis requires ZERO heavy backend servers, zero database costs, and zero network latency.
1. 100% Client-Side In-Memory Execution: Parsing raw RFC 2822 headers and HTML links happens directly inside the user's browser in under 15 milliseconds.
2. Zero Privacy Leakage & Zero-Click Sandbox: The analyzer NEVER fetches or pings suspicious URLs. This eliminates the risk of drive-by malware downloads or alerting attackers via tracking beacons.
3. Extensible Configuration: Campus IT can set their institutional domain (e.g. college.edu) and update threat lists via localStorage or enterprise sync.
4. Full-Stack Optional AI: We deployed an Express + Vite architecture where Gemini 3.8 Flash acts strictly as an optional educational tutor to explain findings without changing scores.`,
      content: (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-xs">
          <div className="bg-slate-900 border border-slate-800 p-5 rounded-xl space-y-3">
            <div className="text-cyan-400 font-bold text-sm flex items-center gap-2">
              <Cpu className="w-4 h-4" />
              <span>Zero Backend Dependency</span>
            </div>
            <p className="text-slate-300 leading-relaxed">
              The entire parsing and heuristic pipeline executes in pure TypeScript inside the browser. It scales to thousands of concurrent students with zero server CPU load or cloud hosting bills.
            </p>
            <div className="pt-2 text-[11px] text-slate-400 border-t border-slate-800">
              Benchmark: &lt;15ms per RFC 2822 email
            </div>
          </div>

          <div className="bg-slate-900 border border-slate-800 p-5 rounded-xl space-y-3">
            <div className="text-emerald-400 font-bold text-sm flex items-center gap-2">
              <Lock className="w-4 h-4" />
              <span>Zero-Click Forensic Sandbox</span>
            </div>
            <p className="text-slate-300 leading-relaxed">
              PhishGuard parses anchor tags and URLs textually without performing HTTP requests. This protects the student's device from drive-by zero-day browser exploits or web beacons.
            </p>
            <div className="pt-2 text-[11px] text-slate-400 border-t border-slate-800">
              Complete student privacy &amp; safety
            </div>
          </div>

          <div className="bg-slate-900 border border-slate-800 p-5 rounded-xl space-y-3">
            <div className="text-purple-400 font-bold text-sm flex items-center gap-2">
              <Terminal className="w-4 h-4" />
              <span>Modern Full-Stack Stack</span>
            </div>
            <p className="text-slate-300 leading-relaxed">
              Engineered with React 19, TypeScript, Tailwind CSS v4, Express server proxy with Google GenAI SDK (Gemini 3.8 Flash), and Recharts for live forensic visualization.
            </p>
            <div className="pt-2 text-[11px] text-slate-400 border-t border-slate-800">
              Standards-compliant &amp; fully responsive
            </div>
          </div>
        </div>
      ),
    },
    {
      id: 5,
      badge: 'Working Screenshots: Ingestion',
      title: 'App Walkthrough: Ingestion & Live Calibrated Samples',
      subtitle: 'Testing against 6 authentic college scenarios with real cryptographic headers',
      speakerNotes: `Let's walk through the working app. Here are the screenshots and interface workflows.
On the main screen, users have three seamless input methods:
1. They can paste raw emails with headers into a large syntax-aware text area.
2. They can drag-and-drop or upload standard .eml message files.
3. Or they can use the "Load Sample Emails" dropdown with 6 built-in calibrated samples.
We specifically tested 3 legitimate emails: Exam Schedule, Library Notice, and Scholarship Announcement—all three score Safe (0/100, Green).
And 3 real-world phishing attacks: Fake Principal asking for gift cards, Fake 24h password expiration, and Fake $5,000 grant with URL shorteners—all three score Phishing (Red).`,
      content: (
        <div className="space-y-4">
          <div className="bg-slate-950 border border-slate-800 rounded-2xl p-4 shadow-xl">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800 text-xs">
              <div className="flex items-center gap-2">
                <span className="w-3 h-3 rounded-full bg-rose-500/80" />
                <span className="w-3 h-3 rounded-full bg-amber-500/80" />
                <span className="w-3 h-3 rounded-full bg-emerald-500/80" />
                <span className="ml-2 font-mono text-slate-400">PhishGuard Ingestion UI</span>
              </div>
              <span className="text-cyan-400 font-mono text-[11px]">RFC 2822 Parser Active</span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-4 text-xs">
              <div className="bg-slate-900 p-4 rounded-xl border border-slate-800 space-y-2">
                <span className="text-emerald-400 font-bold block text-sm">3 Legitimate College Samples:</span>
                <div className="space-y-1.5 text-slate-300">
                  <div className="p-2 bg-slate-950 rounded border border-slate-800 font-mono text-[11px]">
                    1. exams@college.edu (Midterm Exam Schedule) &rarr; <span className="text-emerald-400 font-bold">Score: 0 (Safe)</span>
                  </div>
                  <div className="p-2 bg-slate-950 rounded border border-slate-800 font-mono text-[11px]">
                    2. library-services@college.edu (Circulation Notice) &rarr; <span className="text-emerald-400 font-bold">Score: 0 (Safe)</span>
                  </div>
                  <div className="p-2 bg-slate-950 rounded border border-slate-800 font-mono text-[11px]">
                    3. financialaid@college.edu (Merit Applications) &rarr; <span className="text-emerald-400 font-bold">Score: 0 (Safe)</span>
                  </div>
                </div>
              </div>

              <div className="bg-slate-900 p-4 rounded-xl border border-slate-800 space-y-2">
                <span className="text-rose-400 font-bold block text-sm">3 Real-World Phishing Attacks:</span>
                <div className="space-y-1.5 text-slate-300">
                  <div className="p-2 bg-slate-950 rounded border border-slate-800 font-mono text-[11px]">
                    4. principal.office2491@gmail.com (Gift Card Scam) &rarr; <span className="text-rose-400 font-bold">Score: 100 (Phish)</span>
                  </div>
                  <div className="p-2 bg-slate-950 rounded border border-slate-800 font-mono text-[11px]">
                    5. support@co11ege.edu (24h Password Expiration) &rarr; <span className="text-rose-400 font-bold">Score: 100 (Phish)</span>
                  </div>
                  <div className="p-2 bg-slate-950 rounded border border-slate-800 font-mono text-[11px]">
                    6. awards@college-edu.com (bit.ly Shortener Lure) &rarr; <span className="text-rose-400 font-bold">Score: 100 (Phish)</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      ),
    },
    {
      id: 6,
      badge: 'Working Screenshots: Triage UI',
      title: 'App Walkthrough: Speedometer Gauge & Interactive Highlighter',
      subtitle: 'Visual evidence presentation that students can immediately understand and trust',
      speakerNotes: `Once analyzed, PhishGuard presents a stunning, cyber-themed triage dashboard.
Notice our SVG Speedometer Gauge:
- An animated arc with real-time score calculation (0 to 100).
- Color-coded badges: Green for Safe, Amber for Suspicious, Red for Phishing.
- Next, our Interactive Forensic Highlighter:
It highlights the suspicious parts right inside the email body!
Red for malicious links and look-alike domains.
Orange for urgency words like "within 24 hours".
Purple for financial requests like gift cards or wire transfers.
Students can hover over any highlighted word to see a tooltip explaining the attacker's psychological trick.`,
      content: (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 text-xs">
          {/* Mock Gauge & Evidence */}
          <div className="bg-slate-900 border border-rose-500/30 rounded-2xl p-5 space-y-3">
            <div className="flex items-center justify-between">
              <span className="font-bold text-white text-sm">Verdict Banner &amp; Speedometer</span>
              <span className="px-2 py-0.5 rounded bg-rose-500/20 text-rose-300 border border-rose-500/40 text-[10px] font-bold">
                100/100 RISK
              </span>
            </div>

            <div className="p-4 bg-slate-950 rounded-xl border border-slate-800 flex items-center justify-between">
              <div>
                <div className="text-rose-400 font-extrabold text-lg">HIGH RISK PHISHING</div>
                <p className="text-slate-400 text-[11px] max-w-xs mt-1">
                  Multiple critical spoofing, deceptive anchor links, and credential-harvesting indicators confirmed.
                </p>
              </div>
              <div className="w-16 h-16 rounded-full border-4 border-rose-500 flex items-center justify-center font-black text-xl text-white">
                100
              </div>
            </div>

            <div className="space-y-1.5">
              <span className="text-slate-400 text-[10px] uppercase font-bold tracking-wider">Ranked Evidence Cards:</span>
              <div className="p-2 bg-slate-950 rounded border border-rose-500/30 text-rose-300 text-[11px]">
                &bull; Deceptive Hyperlink Text: Display says portal.college.edu &rarr; navigates to .xyz
              </div>
              <div className="p-2 bg-slate-950 rounded border border-rose-500/30 text-rose-300 text-[11px]">
                &bull; Typosquatting: Domain co11ege.edu mimics campus using double 1s
              </div>
            </div>
          </div>

          {/* Mock Highlighter */}
          <div className="bg-slate-900 border border-cyan-500/30 rounded-2xl p-5 space-y-3">
            <div className="flex items-center justify-between">
              <span className="font-bold text-white text-sm">Interactive Forensic Highlighter</span>
              <span className="text-slate-400 text-[10px]">Hover Tooltips Active</span>
            </div>

            <div className="p-3 bg-slate-950 rounded-xl border border-slate-800 font-mono text-[11px] leading-relaxed text-slate-300 space-y-2">
              <div>
                <span className="bg-yellow-500/20 text-yellow-300 px-1 rounded border-b border-yellow-500">
                  Dear Student / Faculty,
                </span>
              </div>
              <div>
                FINAL WARNING: Your Single Sign-On credentials expire{' '}
                <span className="bg-amber-500/20 text-amber-300 px-1 rounded border-b border-amber-500">
                  within 24 hours
                </span>
                .
              </div>
              <div>
                Verify immediately at:{' '}
                <span className="bg-rose-500/20 text-rose-300 px-1 rounded border-b border-rose-500">
                  https://portal.college.edu/reset-password
                </span>{' '}
                [Href points to account-auth.xyz]
              </div>
            </div>

            <div className="flex flex-wrap gap-2 text-[10px]">
              <span className="px-2 py-0.5 rounded bg-rose-500/10 text-rose-300 border border-rose-500/30">Red = Malicious URL</span>
              <span className="px-2 py-0.5 rounded bg-amber-500/10 text-amber-300 border border-amber-500/30">Orange = Urgency</span>
              <span className="px-2 py-0.5 rounded bg-purple-500/10 text-purple-300 border border-purple-500/30">Purple = Gift Card</span>
            </div>
          </div>
        </div>
      ),
    },
    {
      id: 7,
      badge: 'Deep Dive: Security Forensics',
      title: 'Under the Hood: Typosquatting & Email Auth (SPF/DKIM/DMARC)',
      subtitle: 'Rigorous mathematical verification replacing guesswork with cryptographic proof',
      speakerNotes: `Let's dive deeper into the technical algorithms behind our checks:
1. Typosquatting Detection: We implemented a Levenshtein Distance homoglyph scanner. If an attacker swaps the letters 'l' for the number '1', or 'o' for '0', or inserts a hyphen like college-edu.com, our engine detects the homoglyph variant immediately.
2. Email Authentication Chips: We parse SPF (Sender Policy Framework), DKIM (DomainKeys Identified Mail), and DMARC alignment. If an attacker spoofs an official college domain from a random server IP, SPF will return softfail or fail, and DMARC fails alignment.
3. Link Text Mismatch: The engine parses HTML anchor tags. When an attacker writes portal.college.edu in the text but points the href to account-auth.xyz, we flag it as Critical (+30 points).`,
      content: (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
          <div className="bg-slate-900 border border-slate-800 p-4 rounded-xl space-y-2.5">
            <span className="text-cyan-400 font-bold block text-sm">1. Typosquatting Logic</span>
            <p className="text-slate-300 leading-relaxed text-[11px]">
              Compares candidate domains against the configured campus domain (e.g. <code>college.edu</code>) using:
            </p>
            <ul className="list-disc pl-4 space-y-1 text-slate-400 text-[11px]">
              <li>Homoglyphs: <code>1 &harr; l</code>, <code>0 &harr; o</code>, <code>rn &harr; m</code></li>
              <li>Levenshtein Edit Distance (&le; 2)</li>
              <li>Brand hyphenation (<code>college-edu.com</code>)</li>
            </ul>
          </div>

          <div className="bg-slate-900 border border-slate-800 p-4 rounded-xl space-y-2.5">
            <span className="text-emerald-400 font-bold block text-sm">2. Cryptographic Auth</span>
            <p className="text-slate-300 leading-relaxed text-[11px]">
              Evaluates internet protocol authentication:
            </p>
            <ul className="list-disc pl-4 space-y-1 text-slate-400 text-[11px]">
              <li><strong>SPF:</strong> Authorized mail relay server IP</li>
              <li><strong>DKIM:</strong> Public key digital signature integrity</li>
              <li><strong>DMARC:</strong> From header alignment policy</li>
            </ul>
          </div>

          <div className="bg-slate-900 border border-slate-800 p-4 rounded-xl space-y-2.5">
            <span className="text-rose-400 font-bold block text-sm">3. Anchor Text Disparity</span>
            <p className="text-slate-300 leading-relaxed text-[11px]">
              Cross-references visible anchor strings with true link destinations:
            </p>
            <ul className="list-disc pl-4 space-y-1 text-slate-400 text-[11px]">
              <li>Detects deceptive portal URLs masking evil servers</li>
              <li>Flags bit.ly shorteners &amp; raw IP addresses</li>
              <li>Alerts on high-risk TLDs (.xyz, .top, .ru)</li>
            </ul>
          </div>
        </div>
      ),
    },
    {
      id: 8,
      badge: 'Dashboard & AI Explainer',
      title: 'Session Analytics, Threat Intel & AI Explainability',
      subtitle: 'Recharts analytics, printable PDF reports, and Gemini 3.8 Flash tutoring',
      speakerNotes: `Beyond analyzing individual emails, PhishGuard provides enterprise-grade session intelligence:
1. Threat Analytics Dashboard: Powered by Recharts, it displays verdict distributions (Safe vs Suspicious vs Phishing), radar breakdown of threat pillars, and a list of most prevalent campus threat indicators.
2. Printable Incident Reports: Students or IT interns can click "Download Report" to instantly trigger a clean, formatted PDF triage report ready for incident handlers.
3. "Explain with AI": Using the modern Google GenAI SDK with Gemini 3.8 Flash, students can click a single button to get a concise, student-friendly explanation of the findings. Crucially, the AI is NOT allowed to change the score—it acts strictly as an educational translator!`,
      content: (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
          <div className="bg-slate-900 border border-slate-800 p-5 rounded-xl space-y-3">
            <div className="flex items-center gap-2 text-cyan-400 font-bold text-sm">
              <BarChart3 className="w-4 h-4" />
              <span>Real-Time Recharts Dashboard</span>
            </div>
            <p className="text-slate-300 leading-relaxed">
              Maintains complete triage history in local storage. Computes mean risk score, total scans, and top red-flag frequencies across all session investigations.
            </p>
            <div className="p-3 bg-slate-950 rounded-lg border border-slate-800 text-[11px] text-slate-400 font-mono flex items-center justify-between">
              <span>Export formats:</span>
              <span className="text-cyan-300">Printable PDF &bull; JSON Data</span>
            </div>
          </div>

          <div className="bg-slate-900 border border-purple-500/30 p-5 rounded-xl space-y-3">
            <div className="flex items-center gap-2 text-purple-400 font-bold text-sm">
              <Sparkles className="w-4 h-4" />
              <span>AI Explainer (Gemini 3.8 Flash)</span>
            </div>
            <p className="text-slate-300 leading-relaxed">
              Provides non-technical students with a friendly 3-bullet breakdown answering: What is this email trying to achieve? What are the key clues? What should you do right now?
            </p>
            <div className="p-3 bg-slate-950 rounded-lg border border-slate-800 text-[11px] text-purple-300 font-mono">
              Strict Guardrail: Rule-based score is immutable.
            </div>
          </div>
        </div>
      ),
    },
    {
      id: 9,
      badge: 'Actionable Safety & Impact',
      title: 'Actionable Safety Checklist & Hackathon Feasibility',
      subtitle: 'Closing the loop: What students should do next when an attack is caught',
      speakerNotes: `Finally, how does PhishGuard close the loop?
Detection without response is useless. That's why PhishGuard includes a "Safety Recommendations" checklist:
1. Do not click or reply: Replying confirms your email address is active to the cyber criminal.
2. Verify out-of-band: Never call the phone number in the email; look up the official college directory.
3. Report to Campus IT: One-click export to forward to security@college.edu.
4. Incident Response Steps: If a student already clicked and entered credentials, we provide immediate steps: Reset SSO password now, terminate active Google/Microsoft sessions, and alert helpdesk.`,
      content: (
        <div className="space-y-4 text-xs">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div className="bg-slate-900 border border-slate-800 p-4 rounded-xl space-y-2">
              <span className="text-rose-400 font-bold block text-sm">1. Isolation</span>
              <p className="text-slate-300 leading-relaxed text-[11px]">
                Strict instructions: Never click, open attachments, or reply. Type university portal URLs directly.
              </p>
            </div>

            <div className="bg-slate-900 border border-slate-800 p-4 rounded-xl space-y-2">
              <span className="text-cyan-400 font-bold block text-sm">2. Out-of-Band Check</span>
              <p className="text-slate-300 leading-relaxed text-[11px]">
                Always verify urgent monetary or dean requests by calling the public campus office directory.
              </p>
            </div>

            <div className="bg-slate-900 border border-slate-800 p-4 rounded-xl space-y-2">
              <span className="text-amber-400 font-bold block text-sm">3. Containment</span>
              <p className="text-slate-300 leading-relaxed text-[11px]">
                Immediate triage if clicked: reset SSO password, terminate active sessions, notify IT Helpdesk.
              </p>
            </div>
          </div>

          <div className="p-4 rounded-xl bg-slate-900 border border-emerald-500/30 text-slate-300 space-y-1">
            <span className="font-bold text-emerald-400 text-sm block">Hackathon Impact Summary:</span>
            <p className="text-xs leading-relaxed">
              PhishGuard bridges the gap between advanced cybersecurity telemetry and student education. It transforms everyday phishing scares into interactive, explainable learning moments.
            </p>
          </div>
        </div>
      ),
    },
    {
      id: 10,
      badge: 'Conclusion & Q&A',
      title: 'Conclusion, Key Takeaways & Thank You',
      subtitle: 'Questions & Answers &middot; Live Demo Ready',
      speakerNotes: `In conclusion: PhishGuard proves that phishing defense doesn't have to be a mysterious black box. By combining 100% in-browser deterministic heuristics, interactive token highlighting, cryptographic header parsing, and optional AI explanations, we empower students to spot and stop cyber attacks before damage occurs.
Thank you so much for your time. I would love to answer any questions and walk you through a live demonstration!`,
      content: (
        <div className="p-8 rounded-2xl bg-gradient-to-br from-slate-900 via-slate-900 to-cyan-950/40 border border-cyan-500/40 shadow-2xl text-center space-y-6">
          <div className="w-16 h-16 rounded-2xl bg-cyan-500/20 border border-cyan-500/40 flex items-center justify-center mx-auto text-cyan-400">
            <CheckCircle2 className="w-8 h-8" />
          </div>

          <div className="space-y-2">
            <h3 className="text-2xl font-black text-white">Thank You!</h3>
            <p className="text-sm text-slate-300 max-w-md mx-auto leading-relaxed">
              PhishGuard is ready for live interactive testing against all 6 calibrated college email samples.
            </p>
          </div>

          <div className="flex flex-wrap justify-center gap-3 pt-2 text-xs">
            <span className="px-3 py-1.5 rounded-lg bg-slate-950 border border-slate-800 text-slate-300">
              ⚡ 100% Client-Side In-Browser Engine
            </span>
            <span className="px-3 py-1.5 rounded-lg bg-slate-950 border border-slate-800 text-slate-300">
              🛡️ 5-Pillar Explainable Forensics
            </span>
            <span className="px-3 py-1.5 rounded-lg bg-slate-950 border border-slate-800 text-slate-300">
              ✨ Gemini 3.8 Flash Educational Explainer
            </span>
          </div>

          <div className="text-xs font-mono text-cyan-400 pt-2">
            Questions &amp; Live Interactive Demo
          </div>
        </div>
      ),
    },
  ];

  const slide = slides[currentSlide];

  const handleNext = () => {
    if (currentSlide < slides.length - 1) setCurrentSlide(currentSlide + 1);
  };

  const handlePrev = () => {
    if (currentSlide > 0) setCurrentSlide(currentSlide - 1);
  };

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'ArrowRight' || e.key === 'Space') {
        handleNext();
      } else if (e.key === 'ArrowLeft') {
        handlePrev();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [currentSlide]);

  return (
    <div className={`space-y-6 ${isFullscreen ? 'fixed inset-0 z-50 bg-slate-950 p-6 overflow-y-auto' : ''}`}>
      {/* Presentation Top Control Bar */}
      <div className="flex flex-wrap items-center justify-between gap-4 bg-slate-900 border border-slate-800 p-4 rounded-2xl shadow-lg">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-cyan-500/10 rounded-xl border border-cyan-500/30">
            <Presentation className="w-5 h-5 text-cyan-400" />
          </div>
          <div>
            <h3 className="font-bold text-white text-sm">
              Hackathon Pitch Deck &middot; Slide {currentSlide + 1} of {slides.length}
            </h3>
            <p className="text-xs text-slate-400">
              Use &larr; / &rarr; keys or buttons below to navigate during your presentation.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {/* Fullscreen toggle */}
          <button
            onClick={() => setIsFullscreen(!isFullscreen)}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 border border-slate-700 transition-colors text-xs font-semibold cursor-pointer"
            title={isFullscreen ? 'Exit Fullscreen' : 'Fullscreen Deck'}
          >
            {isFullscreen ? <Minimize2 className="w-4 h-4" /> : <Maximize2 className="w-4 h-4" />}
            <span>{isFullscreen ? 'Exit Fullscreen' : 'Fullscreen'}</span>
          </button>
        </div>
      </div>

      {/* Main Slide Stage */}
      <div className="bg-slate-950 border border-slate-800 rounded-3xl p-6 sm:p-10 shadow-2xl relative min-h-[500px] flex flex-col justify-between">
        {/* Slide Header */}
        <div className="space-y-2 border-b border-slate-800/80 pb-5">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold uppercase tracking-wider px-3 py-1 rounded-full bg-cyan-500/10 text-cyan-300 border border-cyan-500/30">
              {slide.badge}
            </span>
            <span className="text-xs font-mono text-slate-500">
              Slide {currentSlide + 1} / {slides.length}
            </span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
            {slide.title}
          </h2>
          <p className="text-xs sm:text-sm text-slate-400 leading-relaxed font-medium">
            {slide.subtitle}
          </p>
        </div>

        {/* Slide Body Content */}
        <div className="py-6 flex-1">{slide.content}</div>

        {/* Slide Footer Navigation */}
        <div className="flex items-center justify-between pt-6 border-t border-slate-800/80 gap-4">
          <button
            onClick={handlePrev}
            disabled={currentSlide === 0}
            className="flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold text-slate-200 bg-slate-800 hover:bg-slate-700 disabled:opacity-40 disabled:cursor-not-allowed transition-all cursor-pointer"
          >
            <ChevronLeft className="w-4 h-4" />
            <span>Previous</span>
          </button>

          {/* Slide dots */}
          <div className="flex items-center gap-1.5">
            {slides.map((_, idx) => (
              <button
                key={idx}
                onClick={() => setCurrentSlide(idx)}
                className={`h-2 rounded-full transition-all cursor-pointer ${
                  currentSlide === idx
                    ? 'w-6 bg-cyan-400'
                    : 'w-2 bg-slate-800 hover:bg-slate-700'
                }`}
                title={`Jump to slide ${idx + 1}`}
              />
            ))}
          </div>

          <button
            onClick={handleNext}
            disabled={currentSlide === slides.length - 1}
            className="flex items-center gap-1.5 px-5 py-2 rounded-xl text-xs font-bold text-white bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 disabled:opacity-40 disabled:cursor-not-allowed transition-all shadow-lg shadow-cyan-500/20 cursor-pointer"
          >
            <span>Next Slide</span>
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};
