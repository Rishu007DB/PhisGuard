# PhishGuard: Phishing Investigation & Email Analyzer

[![TypeScript](https://img.shields.io/badge/Language-TypeScript_ES2022-blue.svg)](https://www.typescriptlang.org/)
[![React](https://img.shields.io/badge/Frontend-React_19-61dafb.svg)](https://react.dev/)
[![Tailwind CSS](https://img.shields.io/badge/Styling-Tailwind_CSS_v4-38bdf8.svg)](https://tailwindcss.com/)
[![Express](https://img.shields.io/badge/Backend-Express_4-green.svg)](https://expressjs.com/)
[![AI Engine](https://img.shields.io/badge/AI_Tutor-Gemini_3.8_Flash-orange.svg)](https://ai.google.dev/)
[![License](https://img.shields.io/badge/License-Apache_2.0-blue.svg)](LICENSE)

> **A 100% in-browser, explainable email forensic investigation and phishing triage platform designed for college cybersecurity hackathons, university SOCs, and student security awareness.**

---

## 📌 Executive Overview

Campus email systems are inundated daily with social engineering attacks: fraudulent financial aid grants, Dean impersonations soliciting gift cards, and coercive notices claiming student Single Sign-On (SSO) credentials will expire in 24 hours.

Standard email gateways act as **"black boxes"**—quarantining or labeling emails with vague warnings without explaining *why*. This leads to **alert fatigue**, leaving students unaware of how to spot forged headers, look-alike domains, or anchor text disparities.

**PhishGuard** transforms every suspicious email into an **explainable, interactive learning moment**. Every verdict is mathematically grounded across **Five Core Security Pillars**, breaking down risk scores with clear evidence, tokenized body highlighting, cryptographic protocol validation, and step-by-step incident response guidance.

---

## 🛡️ Core Features

- **Multi-Source Email Ingestion:**
  - Direct paste of raw RFC 2822 emails including multi-line unfolded headers.
  - Drag-and-drop or file upload for standard `.eml` and `.msg` message files.
  - Dropdown preloaded with **6 realistic college email samples** (3 authentic, 3 active phishing attacks).
- **100% Client-Side Rule Engine:**
  - Deterministic scoring executed in pure TypeScript inside the browser in `< 15ms`.
  - Zero external database requirements and zero server compute bottleneck.
- **Zero-Click Forensic Sandbox:**
  - Extracts and analyzes hyperlinks, query parameters, and anchor tags strictly as text strings.
  - **Never pings, fetches, or navigates to remote URLs**, protecting student devices from drive-by browser exploits and IP tracking beacons.
- **Dynamic 0–100 Speedometer Risk Gauge:**
  - Animated SVG arc with instant verdict classification:
    - **0 – 30:** `Safe` (Verified Authentic — Green)
    - **31 – 60:** `Suspicious` (Elevated Caution — Amber)
    - **61 – 100:** `Phishing` (High Risk Active Threat — Red)
- **Interactive Forensic Token Highlighter:**
  - Tokenizes the email body with color-coded syntax highlights:
    - 🔴 **Red:** Deceptive anchor links, look-alike domains, and blacklisted URLs.
    - 🟠 **Orange:** Coercive deadlines and artificial urgency (*"within 24 hours"*).
    - 🟣 **Purple:** Retail gift card and wire transfer solicitations (*BEC*).
    - 🔴 **Dark Red:** Campus password and Duo 2FA credential harvesting lures.
    - 🟡 **Yellow:** Generic mass salutations (*"Dear Student / Faculty"*).
  - Hover tooltips detailing the exact psychological or technical trick behind each token.
- **Ranked Evidence Cards:**
  - Displays each heuristic check sorted by severity (Critical, High, Medium, Low, Info) with exact discovered evidence snippets and a *"Why this matters for students"* explanation.
- **Cryptographic Protocol Inspection:**
  - Evaluates **SPF** (Sender Policy Framework IP authorization), **DKIM** (DomainKeys Identified Mail cryptographic signatures), and **DMARC** (Domain alignment policy) headers.
- **Actionable Safety Checklist & Incident Response:**
  - 4-step actionable containment protocol (Isolation, Out-of-band verification, One-click escalation to `security@college.edu`, and Emergency credential/session revocation).
- **Printable Formal Incident Dossier:**
  - One-click **"Download Report"** generates a high-contrast black-and-white incident report via `@media print` for campus SOC analysts.
- **Recharts-Powered Threat Intelligence Dashboard:**
  - Aggregates session triage telemetry: Donut Chart of verdict distributions, Bar Chart of pillar weights, top indicator frequency rankings, and recent investigation history.
- **AI Explainer (Gemini 3.8 Flash):**
  - Optional AI tutor providing a concise, 3-bullet plain-English breakdown.
  - **Strict Guardrail:** The rule-based score is immutable; the AI cannot alter the deterministic triage verdict.
- **Integrated Full-Screen Pitch Deck:**
  - Built-in 10-slide hackathon presentation deck accessible via the top navigation bar with keyboard arrow navigation (`←` / `→`) and fullscreen mode.

---

## 🔬 The 5 Pillars of Threat Analysis

PhishGuard inspects emails across five structured security disciplines:

```
                          ┌─────────────────────────────────────┐
                          │     Incoming Email (.eml / RFC 2822)│
                          └──────────────────┬──────────────────┘
                                             │
             ┌───────────────────────────────┼───────────────────────────────┐
             │                               │                               │
             ▼                               ▼                               ▼
    [Pillar 1: Sender]              [Pillar 2: URLs]               [Pillar 3: Language]
    • Free Webmail Spoofing         • Anchor Text Mismatch         • 24h Artificial Urgency
    • Reply-To Divergence           • Opaque URL Shorteners        • Credential / SSO Lures
    • Homoglyph Typosquatting       • Naked IP Host Addresses      • Gift Card / BEC Solicitations
    • Levenshtein Distance          • Suspicious TLDs (.xyz, .ru)  • Generic Salutations
             │                               │                               │
             └───────────────────────────────┼───────────────────────────────┘
                                             │
                             ┌───────────────┴───────────────┐
                             │                               │
                             ▼                               ▼
                   [Pillar 4: Auth]                [Pillar 5: Threat Intel]
                   • SPF Relay Authorization       • Known-Bad Malicious Domains
                   • DKIM Digital Signature        • Phishing Landing Page URLs
                   • DMARC Domain Alignment        • Custom Campus IOC Feeds
                             │                               │
                             └───────────────┬───────────────┘
                                             │
                                             ▼
                             ┌───────────────────────────────┐
                             │     Aggregated Risk Score     │
                             │     0-30: Safe (Green)        │
                             │     31-60: Suspicious (Amber) │
                             │     61-100: Phishing (Red)    │
                             └───────────────────────────────┘
```

### 1. Sender Identity & Domain Typosquatting
- **Authority on Free Webmail:** Detects when display names claim high administrative status (`Dean`, `Principal`, `IT Support`, `Registrar`) but transmit from free consumer webmail (`gmail.com`, `yahoo.com`, `outlook.com`).
- **Reply-To Divergence:** Identifies when replies are covertly routed to an external inbox differing from the visible `From:` address.
- **Homoglyph Normalization:** Swaps visual look-alikes (`1` $\leftrightarrow$ `l`, `0` $\leftrightarrow$ `o`, `rn` $\leftrightarrow$ `m`) to unmask domain clones like `co11ege.edu`.
- **Levenshtein Distance:** Computes single-character edit distances against the trusted campus domain (`college.edu`).

### 2. Deep Hyperlink & Domain Inspection
- **Anchor Text vs. Href Disparity:** Flags when visible link text reads `https://portal.college.edu` while the underlying HTML `href` navigates to `http://account-auth.xyz`.
- **URL Shorteners:** Detects opaque link masking services (`bit.ly`, `tinyurl.com`, `t.co`, `is.gd`).
- **Naked IP Hosts:** Flags URLs routing directly to numerical server IPs rather than registered hostnames.
- **High-Risk TLDs:** Alerts on disposable, fraud-prevalent extensions (`.xyz`, `.top`, `.click`, `.ru`, `.su`, `.loan`, `.work`).
- **RFC 3986 "@" Abuse:** Detects credential prefix tricks (`http://portal.college.edu@evil-server.com`).
- **Punycode (IDN):** Flags internationalized domain names (`xn--`) mimicking ASCII characters.

### 3. Behavioral Psychology & Coercive Language
- **Artificial Deadlines:** Scans for high-pressure panic keywords (`within 24 hours`, `immediate attention`, `permanently suspended`).
- **Credential Prompts:** Identifies demands for institutional credentials (`password expires`, `SSO login`, `Duo push token`, `2FA code`).
- **Financial BEC Solicitations:** Detects retail gift cards (`Apple/Steam card`, `$100 each`, `scratch off PIN`), wire transfers, and advance-fee grant scams.
- **Impersonal Salutations:** Flags mass spray-and-pray greetings (`Dear Student / Faculty`, `Dear user`).

### 4. Cryptographic Authentication Protocols
- **SPF (RFC 7208):** Verifies if the sending server IP is authorized by the domain's DNS TXT record.
- **DKIM (RFC 6376):** Validates the asymmetric RSA-SHA256 digital signature to prove message contents were not modified in transit.
- **DMARC (RFC 7489):** Ensures alignment between SPF/DKIM authenticated identities and the visible `From:` header.
- **Proportional Weighting:** Handles missing headers gracefully (+4 pts) while penalizing active forged failures (+20 pts).

### 5. Threat Intelligence & Custom Reputation Blacklists
- Allows security administrators and students to inject custom Indicators of Compromise (IOCs) via the **Reputation Tab**. Any hit triggers an immediate Critical Threat penalty (+40 pts).

---

## 🧪 Calibrated Academic Benchmark Suite

PhishGuard includes six preloaded, fully realistic email scenarios with complete RFC 2822 headers:

| Sample Scenario | Sender | Reply-To | Core Indicators | Target Verdict | Benchmark Score |
| :--- | :--- | :--- | :--- | :--- | :--- |
| **1. Midterm Exam Schedule** | `exams@college.edu` | `exams@college.edu` | SPF pass, DKIM pass, DMARC pass, legitimate campus portal links | **Safe** | `0 / 100` |
| **2. Library Circulation Notice** | `library-services@college.edu` | `library-services@college.edu` | Full cryptographic auth pass, routine academic notice tone | **Safe** | `0 / 100` |
| **3. Merit Scholarship Notice** | `financialaid@college.edu` | `financialaid@college.edu` | Official institutional links, office hours at Student Union, verified auth | **Safe** | `0 / 100` |
| **4. Fake Principal Gift Cards** | `principal.office2491@gmail.com` | `confidential-task@outlook.com` | Authority on free webmail, mismatched Reply-To, gift card solicitation, urgency | **Phishing** | `100 / 100` |
| **5. 24h Password Expiration** | `support@co11ege.edu` | `verify-account@co11ege.edu` | Typosquatted `co11ege.edu`, link text mismatch to `.xyz`, SPF softfail, urgency | **Phishing** | `100 / 100` |
| **6. Fake $5,000 Dean's Grant** | `awards@college-edu.com` | `deansgrantclaim@yahoo.com` | Look-alike `college-edu.com`, Yahoo Reply-To, `bit.ly` shortener, wire transfer | **Phishing** | `100 / 100` |

---

## 🏗️ Architecture & Technology Stack

| Layer | Technology | Key Implementation |
| :--- | :--- | :--- |
| **Frontend Framework** | React 19 (`tsx`) | Component modularity, functional hooks, virtual DOM updates. |
| **Type Safety** | TypeScript (ES2022 Strict) | Compile-time validation, RFC 2822 AST definitions, zero `any` slips. |
| **Styling & Theme** | Tailwind CSS v4 & CSS3 | Dark cyber theme (`slate-950`), custom scrollbars, `@media print`. |
| **Data Visualization** | Recharts & SVG | 240° speedometer gauge, donut verdict chart, pillar risk bar charts. |
| **Icons & Visuals** | Lucide React | High-contrast cybersecurity status and severity glyphs. |
| **Server & Proxy** | Express 4 + TSX on Node.js | Client-key isolation, dev middleware mode, `/api/ai/*` proxy. |
| **AI Integration** | `@google/genai` | Gemini 3.8 Flash for on-demand educational student tutoring. |

---

## 📁 Repository Directory Structure

```text
├── index.html                    # Single-page entry point with synced meta & fonts
├── metadata.json                 # AI Studio capability & permission configurations
├── package.json                  # Dependencies & start scripts ("tsx server.ts")
├── tsconfig.json                 # Strict TypeScript configuration
├── vite.config.ts                # Tailwind CSS v4 & Vite build configuration
├── server.ts                     # Express server & Gemini API proxy endpoint
├── src/
│   ├── main.tsx                  # React DOM mount point
│   ├── App.tsx                   # Top-level state, tab router, and storage persistence
│   ├── index.css                 # Global Tailwind imports & print layout rules
│   ├── types/
│   │   └── index.ts              # TypeScript interfaces (AnalysisResult, Finding, etc.)
│   ├── engine/
│   │   └── analyzer.ts           # 5-Pillar rule engine, Levenshtein formulas, RFC parser
│   ├── data/
│   │   └── sampleEmails.ts       # 6 calibrated legitimate and phishing test samples
│   └── components/
│       ├── Navbar.tsx            # Header with status indicator and tab navigation
│       ├── AnalyzerTab.tsx       # Ingestion bar, sample loader, and result orchestrator
│       ├── VerdictGauge.tsx      # SVG speedometer gauge (0-100) and confidence badge
│       ├── EvidenceList.tsx      # Ranked evidence cards with severity chips and rationale
│       ├── EmailHighlighter.tsx  # Interactive span highlighter with hover tooltips
│       ├── ExtractedDetails.tsx  # Header details, auth status chips, and URL sandbox table
│       ├── SafetyRecommendations.tsx # 4-step student incident response checklist
│       ├── DashboardTab.tsx      # Recharts analytics, threat frequency, and scan history
│       ├── SettingsTab.tsx       # Institutional domain & custom IOC blacklist panel
│       ├── AboutTab.tsx          # Educational guide on phishing attack vectors
│       ├── PresentationDeck.tsx  # 10-slide clean hackathon pitch deck with fullscreen
│       ├── PrintableReport.tsx   # Formal PDF incident dossier formatted for @media print
│       └── AiExplainModal.tsx    # Gemini 3.8 Flash plain-English student explanation
```

---

## 🚀 Getting Started & Local Setup

### Prerequisites
- **Node.js**: v18.0.0 or higher
- **npm**: v9.0.0 or higher

### 1. Clone & Install Dependencies
```bash
git clone https://github.com/your-username/phishguard.git
cd phishguard
npm install
```

### 2. Configure Environment Secrets (Optional for AI Tutor)
Copy the example environment configuration:
```bash
cp .env.example .env
```
Inside `.env`, configure your Gemini API key (optional—the core rule-based analysis engine runs 100% locally without an API key):
```env
GEMINI_API_KEY="your-gemini-api-key"
PORT=3000
```

### 3. Launch Development Server
```bash
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) in your web browser.

### 4. Build for Production
```bash
npm run build
npm start
```

---

## 🔒 Security & Privacy Compliance

- **FERPA & GDPR Compliance:** PhishGuard does not transmit raw student emails, grades, or personal information to any cloud database. Analysis executes **strictly in browser memory**.
- **Zero-Click Sandbox Safety:** All hyperlinks and images are extracted textually; no outbound HTTP requests, web beacons, or asset pre-fetches are ever initiated.
- **Strict AI Score Immutability:** When using the optional Gemini 3.8 Flash explainer, the rule-based risk score is locked. The LLM acts solely as a pedagogical translator.

---

## 🎓 Hackathon Presentation Guide

PhishGuard includes a **built-in pitch deck** accessible directly from the top navigation bar:
1. Click the **"Pitch Deck"** tab in the navigation bar.
2. Use **Left / Right arrow keys** (`←` / `→`) or on-screen buttons to step through slides.
3. Click **"Fullscreen"** to project full-bleed slides during your judging demo.
4. Switch back to the **"Analyzer"** tab to run a live demonstration on any sample or custom email.

---

## 📄 License

This project is licensed under the Apache 2.0 License - see the [LICENSE](LICENSE) file for details.
