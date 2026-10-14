import React from 'react';
import {
  Shield,
  Layers,
  GraduationCap,
  KeyRound,
  AlertTriangle,
  Lock,
  MailCheck,
  CheckCircle2,
  ExternalLink,
} from 'lucide-react';

export const AboutTab: React.FC = () => {
  return (
    <div className="max-w-4xl mx-auto space-y-8">
      {/* Hero card */}
      <div className="bg-gradient-to-r from-slate-900 via-slate-900 to-indigo-950/40 border border-slate-800 p-8 rounded-2xl shadow-xl relative overflow-hidden">
        <div className="relative z-10 space-y-3">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-500/10 text-cyan-300 border border-cyan-500/30 text-xs font-semibold uppercase tracking-wider">
            <GraduationCap className="w-3.5 h-3.5" />
            Cybersecurity Hackathon Triage Platform
          </div>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
            About PhishGuard
          </h2>
          <p className="text-sm text-slate-300 leading-relaxed max-w-2xl">
            PhishGuard was built specifically for college students, faculty, and cybersecurity teams to investigate suspicious emails. Unlike "black box" detection systems that simply output a mysterious score, PhishGuard is <strong>100% explainable</strong>: every single point of risk is backed by verifiable forensic evidence, cryptographic protocol validation, and student-friendly takeaways.
          </p>
        </div>
      </div>

      {/* The 5 Pillars of Phishing Detection */}
      <div className="space-y-4">
        <div className="flex items-center gap-2">
          <Layers className="w-5 h-5 text-cyan-400" />
          <h3 className="text-lg font-bold text-white">
            The 5 Pillars of Rule-Based Email Analysis
          </h3>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
          {/* Pillar 1 */}
          <div className="bg-slate-900 border border-slate-800 p-5 rounded-xl space-y-2">
            <div className="flex items-center gap-2 text-cyan-400 font-bold text-sm">
              <span className="w-6 h-6 rounded-full bg-cyan-500/20 flex items-center justify-center text-xs">1</span>
              <span>Sender Identity &amp; Typosquatting</span>
            </div>
            <p className="text-slate-300 leading-relaxed">
              Detects display name spoofing (e.g. pretending to be the College Dean from a free Gmail account), From vs Reply-To address mismatches, and visual typosquatting variants of the campus domain (e.g. <code className="text-cyan-300">co11ege.edu</code> instead of <code className="text-emerald-400">college.edu</code>).
            </p>
          </div>

          {/* Pillar 2 */}
          <div className="bg-slate-900 border border-slate-800 p-5 rounded-xl space-y-2">
            <div className="flex items-center gap-2 text-rose-400 font-bold text-sm">
              <span className="w-6 h-6 rounded-full bg-rose-500/20 flex items-center justify-center text-xs">2</span>
              <span>Hyperlink Deep Inspection</span>
            </div>
            <p className="text-slate-300 leading-relaxed">
              Unmasks anchor text deception (where the link text says <code>portal.college.edu</code> but the hidden HTML <code>href</code> points to a phishing server), naked IP address URLs, opaque URL shorteners (bit.ly), deep subdomains, and suspicious TLDs (.xyz, .top, .ru).
            </p>
          </div>

          {/* Pillar 3 */}
          <div className="bg-slate-900 border border-slate-800 p-5 rounded-xl space-y-2">
            <div className="flex items-center gap-2 text-amber-400 font-bold text-sm">
              <span className="w-6 h-6 rounded-full bg-amber-500/20 flex items-center justify-center text-xs">3</span>
              <span>Social Engineering &amp; Urgency</span>
            </div>
            <p className="text-slate-300 leading-relaxed">
              Scans for psychological manipulation tactics: artificial 24-hour deadlines, threats of account termination or disciplinary action, requests to bypass normal campus verification, and demands for gift cards or wire transfers.
            </p>
          </div>

          {/* Pillar 4 */}
          <div className="bg-slate-900 border border-slate-800 p-5 rounded-xl space-y-2">
            <div className="flex items-center gap-2 text-emerald-400 font-bold text-sm">
              <span className="w-6 h-6 rounded-full bg-emerald-500/20 flex items-center justify-center text-xs">4</span>
              <span>Cryptographic Authentication</span>
            </div>
            <p className="text-slate-300 leading-relaxed">
              Parses SPF (Sender Policy Framework IP authorization), DKIM (DomainKeys Identified Mail cryptographic signatures), and DMARC (domain alignment policy). Forged emails will fail or softfail these checks.
            </p>
          </div>

          {/* Pillar 5 */}
          <div className="bg-slate-900 border border-slate-800 p-5 rounded-xl space-y-2 md:col-span-2">
            <div className="flex items-center gap-2 text-purple-400 font-bold text-sm">
              <span className="w-6 h-6 rounded-full bg-purple-500/20 flex items-center justify-center text-xs">5</span>
              <span>Threat Intelligence &amp; Reputation Blacklist</span>
            </div>
            <p className="text-slate-300 leading-relaxed">
              Allows security analysts to inject custom IOCs (Indicators of Compromise). Any email referencing a blacklisted domain or URL triggers an immediate critical risk violation.
            </p>
          </div>
        </div>
      </div>

      {/* Common College Phishing Vectors */}
      <div className="bg-slate-900 border border-slate-800 p-6 rounded-xl space-y-4 shadow-lg">
        <h3 className="text-base font-bold text-white flex items-center gap-2">
          <AlertTriangle className="w-4 h-4 text-amber-400" />
          <span>Top 3 Cyber Threats Targeting University Students</span>
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
          <div className="bg-slate-950 p-4 rounded-lg border border-slate-800/80 space-y-1.5">
            <div className="font-semibold text-rose-300">1. Dean / Professor Gift Card Scam</div>
            <p className="text-slate-400 leading-relaxed">
              The attacker claims to be in a closed meeting and asks a student or teaching assistant to discreetly buy Apple/Steam gift cards and send photos of the codes. No university leader will ever request this.
            </p>
          </div>

          <div className="bg-slate-950 p-4 rounded-lg border border-slate-800/80 space-y-1.5">
            <div className="font-semibold text-amber-300">2. Password / Duo MFA Expiration</div>
            <p className="text-slate-400 leading-relaxed">
              An email claiming your campus Single Sign-On (SSO) expires in 24 hours. Clicking the link takes you to a fake login page that steals your username, password, and Duo 2FA push code.
            </p>
          </div>

          <div className="bg-slate-950 p-4 rounded-lg border border-slate-800/80 space-y-1.5">
            <div className="font-semibold text-cyan-300">3. Fake Emergency Grants &amp; Jobs</div>
            <p className="text-slate-400 leading-relaxed">
              Lures offering $5,000 emergency grants or $400/week virtual assistant jobs with shortened links (bit.ly) asking for banking direct deposit info or advance fee payments.
            </p>
          </div>
        </div>
      </div>

      {/* Zero Risk Architecture */}
      <div className="bg-slate-900 border border-slate-800 p-6 rounded-xl space-y-3 shadow-lg">
        <div className="flex items-center gap-2 text-slate-100 font-semibold text-sm">
          <Lock className="w-4 h-4 text-cyan-400" />
          <span>Privacy &amp; Zero-Click Sandbox Safety</span>
        </div>
        <p className="text-xs text-slate-400 leading-relaxed">
          PhishGuard operates as a safe forensic sandbox. It analyzes email headers and text purely in memory within your browser session. It <strong>never navigates to, loads, fetches, or executes</strong> any embedded hyperlinks, ensuring complete safety from malware drive-by attacks or active IP beacons.
        </p>
      </div>
    </div>
  );
};
