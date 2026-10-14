import React, { useState } from 'react';
import { AnalysisResult } from '../types';
import { Eye, Code, Copy, Check, AlertCircle, ExternalLink, HelpCircle } from 'lucide-react';

interface Props {
  result: AnalysisResult;
}

interface HighlightSpan {
  text: string;
  type: 'danger-url' | 'urgency' | 'financial' | 'credential' | 'greeting' | 'normal';
  tooltip?: string;
  detail?: string;
}

export const EmailHighlighter: React.FC<Props> = ({ result }) => {
  const [viewMode, setViewMode] = useState<'highlighted' | 'raw'>('highlighted');
  const [copied, setCopied] = useState(false);
  const [activeTooltip, setActiveTooltip] = useState<{
    text: string;
    type: string;
    explanation: string;
    x: number;
    y: number;
  } | null>(null);

  const rawContent = result.metadata.bodyText || result.metadata.raw;

  const copyToClipboard = () => {
    navigator.clipboard.writeText(result.metadata.raw);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  // Build segmented spans for highlighting
  const buildHighlightedSpans = (): HighlightSpan[] => {
    const text = rawContent;
    if (!text) return [{ text: 'No message body available', type: 'normal' }];

    // Regex list of targets with types
    const rules: { regex: RegExp; type: HighlightSpan['type']; tooltip: string; detail: string }[] = [];

    // 1. Add flagged URLs
    for (const urlItem of result.metadata.extractedUrls) {
      if (
        urlItem.isMismatch ||
        urlItem.isShortener ||
        urlItem.isIpAddress ||
        urlItem.isSuspiciousTld ||
        urlItem.isHttpNotHttps ||
        urlItem.isLookalikeDomain ||
        urlItem.isBlacklisted
      ) {
        const escaped = urlItem.raw.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
        rules.push({
          regex: new RegExp(escaped, 'gi'),
          type: 'danger-url',
          tooltip: urlItem.isMismatch
            ? `Deceptive link: points to ${urlItem.domain}`
            : urlItem.flags[0] || 'Suspicious URL destination',
          detail: `Actual Target: ${urlItem.url} (Domain: ${urlItem.domain})`,
        });
      }
    }

    // 2. Add Urgency phrases
    rules.push({
      regex: /\b(within 24 hours|within 48 hours|in 24 hours|today only|immediate attention|immediately|urgently|urgent|final warning|permanently suspended|access terminated|act now)\b/gi,
      type: 'urgency',
      tooltip: 'Artificial deadline / coercion designed to induce panic',
      detail: 'Psychological trigger used to bypass verification before contacting official campus IT.',
    });

    // 3. Add Financial phrases
    rules.push({
      regex: /\b(gift cards?|apple card|steam card|itunes card|\$5,000|\$100 each|\$400 total|scratch off|16-digit|wire transfer|western union|treasury check|honorarium|routing number|bank account)\b/gi,
      type: 'financial',
      tooltip: 'Gift card / untraceable financial request',
      detail: 'Official university leaders never request retail gift cards or private wire transfers.',
    });

    // 4. Add Credential phrases
    rules.push({
      regex: /\b(password expires|password expiration|reset your password|verify your credentials|sso login|duo push|2fa token|otp code)\b/gi,
      type: 'credential',
      tooltip: 'Credential harvesting target',
      detail: 'Attempts to lure student into entering campus directory password and 2FA authentication tokens.',
    });

    // 5. Add Generic Greetings
    rules.push({
      regex: /\b(dear student(\s*\/|\s+and)?\s*faculty|dear student|dear user|dear account holder|dear member|kindly (reply|act|purchase))\b/gi,
      type: 'greeting',
      tooltip: 'Impersonal mass-spray salutation',
      detail: 'Standard collegiate notices address recipients by roster name rather than broad catch-alls.',
    });

    // Find all matches with start and end indices
    interface MatchRecord {
      start: number;
      end: number;
      type: HighlightSpan['type'];
      tooltip: string;
      detail: string;
      matchedText: string;
    }

    const matches: MatchRecord[] = [];

    for (const rule of rules) {
      let m: RegExpExecArray | null;
      const re = new RegExp(rule.regex.source, rule.regex.flags);
      while ((m = re.exec(text)) !== null) {
        matches.push({
          start: m.index,
          end: m.index + m[0].length,
          type: rule.type,
          tooltip: rule.tooltip,
          detail: rule.detail,
          matchedText: m[0],
        });
      }
    }

    if (matches.length === 0) {
      return [{ text, type: 'normal' }];
    }

    // Sort matches by start position
    matches.sort((a, b) => a.start - b.start || b.end - a.end);

    // Merge overlapping / take non-overlapping matches
    const nonOverlapping: MatchRecord[] = [];
    let lastEnd = 0;
    for (const m of matches) {
      if (m.start >= lastEnd) {
        nonOverlapping.push(m);
        lastEnd = m.end;
      }
    }

    // Build span array
    const spans: HighlightSpan[] = [];
    let currentIndex = 0;

    for (const m of nonOverlapping) {
      if (m.start > currentIndex) {
        spans.push({
          text: text.slice(currentIndex, m.start),
          type: 'normal',
        });
      }
      spans.push({
        text: text.slice(m.start, m.end),
        type: m.type,
        tooltip: m.tooltip,
        detail: m.detail,
      });
      currentIndex = m.end;
    }

    if (currentIndex < text.length) {
      spans.push({
        text: text.slice(currentIndex),
        type: 'normal',
      });
    }

    return spans;
  };

  const spans = buildHighlightedSpans();

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-xl overflow-hidden shadow-xl">
      {/* Header bar */}
      <div className="flex flex-wrap items-center justify-between px-5 py-3.5 bg-slate-950/80 border-b border-slate-800 gap-3">
        <div className="flex items-center gap-2">
          <Eye className="w-4 h-4 text-cyan-400" />
          <h3 className="font-semibold text-slate-200 text-sm tracking-wide">
            Interactive Email Forensic Highlighter
          </h3>
          <span className="text-xs bg-slate-800 text-slate-400 px-2 py-0.5 rounded-full border border-slate-700/60">
            Hover highlights to inspect rationale
          </span>
        </div>

        <div className="flex items-center gap-2">
          {/* View toggle */}
          <div className="flex items-center bg-slate-900 p-0.5 rounded-lg border border-slate-800">
            <button
              onClick={() => setViewMode('highlighted')}
              className={`flex items-center gap-1.5 px-3 py-1 rounded text-xs font-medium transition-all ${
                viewMode === 'highlighted'
                  ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40 shadow-sm'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <Eye className="w-3.5 h-3.5" />
              Highlighted View
            </button>
            <button
              onClick={() => setViewMode('raw')}
              className={`flex items-center gap-1.5 px-3 py-1 rounded text-xs font-medium transition-all ${
                viewMode === 'raw'
                  ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40 shadow-sm'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <Code className="w-3.5 h-3.5" />
              Raw RFC Headers
            </button>
          </div>

          <button
            onClick={copyToClipboard}
            className="flex items-center gap-1 px-2.5 py-1 text-xs bg-slate-800 hover:bg-slate-700 text-slate-300 rounded border border-slate-700 transition-colors"
            title="Copy email to clipboard"
          >
            {copied ? (
              <>
                <Check className="w-3.5 h-3.5 text-emerald-400" />
                <span className="text-emerald-400">Copied</span>
              </>
            ) : (
              <>
                <Copy className="w-3.5 h-3.5" />
                <span>Copy</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* Legend bar when in highlighted mode */}
      {viewMode === 'highlighted' && (
        <div className="flex flex-wrap items-center gap-x-4 gap-y-2 px-5 py-2.5 bg-slate-950/40 border-b border-slate-800/80 text-xs text-slate-300">
          <span className="text-slate-400 font-medium">Indicator Legend:</span>
          <div className="flex items-center gap-1.5">
            <span className="w-3 h-3 rounded bg-rose-500/30 border border-rose-500"></span>
            <span>Suspicious URL / Look-alike</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-3 h-3 rounded bg-amber-500/30 border border-amber-500"></span>
            <span>Urgency / Artificial Deadline</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-3 h-3 rounded bg-purple-500/30 border border-purple-500"></span>
            <span>Financial / Gift Card Lure</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-3 h-3 rounded bg-red-500/30 border border-red-500"></span>
            <span>Credential Theft Request</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-3 h-3 rounded bg-yellow-500/30 border border-yellow-500"></span>
            <span>Generic Mass Salutation</span>
          </div>
        </div>
      )}

      {/* Content area */}
      <div className="p-6 relative">
        {viewMode === 'highlighted' ? (
          <div className="font-mono text-sm leading-relaxed whitespace-pre-wrap text-slate-300 max-h-[500px] overflow-y-auto pr-2 selection:bg-cyan-500/30">
            {spans.map((span, idx) => {
              if (span.type === 'normal') {
                return <span key={idx}>{span.text}</span>;
              }

              let styleClasses = '';
              let badgeColor = '';
              switch (span.type) {
                case 'danger-url':
                  styleClasses =
                    'bg-rose-500/20 text-rose-200 border-b-2 border-rose-500 px-1 py-0.5 rounded hover:bg-rose-500/35 cursor-help transition-colors font-medium';
                  badgeColor = 'text-rose-400';
                  break;
                case 'urgency':
                  styleClasses =
                    'bg-amber-500/20 text-amber-200 border-b-2 border-amber-500 px-1 py-0.5 rounded hover:bg-amber-500/35 cursor-help transition-colors font-medium';
                  badgeColor = 'text-amber-400';
                  break;
                case 'financial':
                  styleClasses =
                    'bg-purple-500/20 text-purple-200 border-b-2 border-purple-500 px-1 py-0.5 rounded hover:bg-purple-500/35 cursor-help transition-colors font-medium';
                  badgeColor = 'text-purple-400';
                  break;
                case 'credential':
                  styleClasses =
                    'bg-red-500/20 text-red-200 border-b-2 border-red-500 px-1 py-0.5 rounded hover:bg-red-500/35 cursor-help transition-colors font-medium';
                  badgeColor = 'text-red-400';
                  break;
                case 'greeting':
                  styleClasses =
                    'bg-yellow-500/20 text-yellow-200 border-b-2 border-yellow-500 px-1 py-0.5 rounded hover:bg-yellow-500/35 cursor-help transition-colors font-medium';
                  badgeColor = 'text-yellow-400';
                  break;
              }

              return (
                <mark
                  key={idx}
                  className={styleClasses}
                  title={`${span.tooltip}\n\n${span.detail || ''}`}
                >
                  {span.text}
                </mark>
              );
            })}
          </div>
        ) : (
          <div className="font-mono text-xs leading-relaxed whitespace-pre text-slate-400 max-h-[500px] overflow-auto bg-slate-950 p-4 rounded-lg border border-slate-800">
            {result.metadata.raw}
          </div>
        )}
      </div>

      {/* Footer hint */}
      <div className="px-5 py-2.5 bg-slate-950/60 border-t border-slate-800 flex items-center justify-between text-xs text-slate-400">
        <span className="flex items-center gap-1.5">
          <AlertCircle className="w-3.5 h-3.5 text-cyan-400" />
          <span>
            {result.metadata.extractedUrls.length} total hyperlink(s) extracted &middot;{' '}
            {result.metadata.bodyText.length} characters analyzed
          </span>
        </span>
        <span className="text-slate-500 text-[11px]">RFC 2822 Safe Render Mode (no scripts or remote tracking executed)</span>
      </div>
    </div>
  );
};
