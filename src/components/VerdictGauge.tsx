import React from 'react';
import { AnalysisResult } from '../types';
import { ShieldCheck, AlertTriangle, ShieldAlert, Sparkles, Printer, CheckCircle2, XCircle } from 'lucide-react';

interface Props {
  result: AnalysisResult;
  onExplainAi: () => void;
  aiAvailable: boolean;
  onPrintReport: () => void;
}

export const VerdictGauge: React.FC<Props> = ({
  result,
  onExplainAi,
  aiAvailable,
  onPrintReport,
}) => {
  const { score, verdict, confidence, confidenceNote, categoryScores } = result;

  // Colors and config based on verdict
  let statusColor = '';
  let badgeBg = '';
  let borderColor = '';
  let gaugeStroke = '';
  let glowEffect = '';
  let IconComponent = ShieldCheck;

  if (verdict === 'Phishing') {
    statusColor = 'text-rose-400';
    badgeBg = 'bg-rose-500/10 text-rose-300 border-rose-500/40';
    borderColor = 'border-rose-500/30';
    gaugeStroke = '#f43f5e';
    glowEffect = 'shadow-[0_0_30px_rgba(244,63,94,0.25)]';
    IconComponent = ShieldAlert;
  } else if (verdict === 'Suspicious') {
    statusColor = 'text-amber-400';
    badgeBg = 'bg-amber-500/10 text-amber-300 border-amber-500/40';
    borderColor = 'border-amber-500/30';
    gaugeStroke = '#f59e0b';
    glowEffect = 'shadow-[0_0_30px_rgba(245,158,11,0.25)]';
    IconComponent = AlertTriangle;
  } else {
    statusColor = 'text-emerald-400';
    badgeBg = 'bg-emerald-500/10 text-emerald-300 border-emerald-500/40';
    borderColor = 'border-emerald-500/30';
    gaugeStroke = '#10b981';
    glowEffect = 'shadow-[0_0_30px_rgba(16,185,129,0.2)]';
    IconComponent = ShieldCheck;
  }

  // Circular gauge calculations
  // Radius = 65, circumference = 2 * PI * 65 ≈ 408.4
  // We make a 270-degree arc or full circle
  const radius = 68;
  const strokeWidth = 12;
  const normalizedRadius = radius - strokeWidth / 2;
  const circumference = normalizedRadius * 2 * Math.PI;
  // Use 240-degree arc for speedometer gauge feel
  const strokeDashoffset = circumference - (score / 100) * (circumference * 0.75);

  return (
    <div
      className={`relative overflow-hidden bg-gradient-to-b from-slate-900 to-slate-950 border ${borderColor} rounded-2xl p-6 sm:p-8 transition-all ${glowEffect}`}
    >
      {/* Background cyber grid accent */}
      <div className="absolute inset-0 bg-[radial-gradient(#1e293b_1px,transparent_1px)] [background-size:16px_16px] opacity-30 pointer-events-none" />

      <div className="relative z-10 flex flex-col lg:flex-row items-center justify-between gap-8">
        {/* Left Section: Verdict Title & Confidence */}
        <div className="flex-1 space-y-4 text-center lg:text-left">
          <div className="flex flex-wrap items-center justify-center lg:justify-start gap-3">
            <span
              className={`inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full text-xs font-semibold uppercase tracking-wider border ${badgeBg}`}
            >
              <IconComponent className="w-3.5 h-3.5" />
              Verdict: {verdict.toUpperCase()}
            </span>

            <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-medium bg-slate-800 text-slate-300 border border-slate-700">
              {confidence}
            </span>
          </div>

          <div>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight flex items-center justify-center lg:justify-start gap-2.5">
              <span>Threat Level:</span>
              <span className={statusColor}>
                {verdict === 'Phishing'
                  ? 'High Risk Phishing'
                  : verdict === 'Suspicious'
                  ? 'Suspicious (Elevated Caution)'
                  : 'Safe (Verified Authentic)'}
              </span>
            </h2>
            <p className="mt-2 text-sm text-slate-300 leading-relaxed max-w-xl">
              {confidenceNote}
            </p>
          </div>

          {/* Category score pills */}
          <div className="pt-2">
            <div className="text-xs uppercase tracking-wider font-semibold text-slate-400 mb-2">
              Pillar Risk Breakdown
            </div>
            <div className="flex flex-wrap gap-2 justify-center lg:justify-start">
              {[
                { label: 'Sender', val: categoryScores.sender },
                { label: 'Links & URLs', val: categoryScores.urls },
                { label: 'Language', val: categoryScores.language },
                { label: 'Auth (SPF/DKIM)', val: categoryScores.auth },
                { label: 'Reputation', val: categoryScores.reputation },
              ].map((cat) => (
                <div
                  key={cat.label}
                  className={`text-xs px-2.5 py-1 rounded-lg border flex items-center gap-1.5 ${
                    cat.val > 0
                      ? 'bg-slate-800/80 border-slate-700 text-slate-200'
                      : 'bg-slate-950/40 border-slate-800/80 text-slate-400'
                  }`}
                >
                  <span>{cat.label}:</span>
                  <span
                    className={`font-semibold ${
                      cat.val > 20
                        ? 'text-rose-400'
                        : cat.val > 0
                        ? 'text-amber-400'
                        : 'text-emerald-400'
                    }`}
                  >
                    +{cat.val} pts
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Center / Right: Circular Animated Gauge */}
        <div className="flex flex-col items-center justify-center">
          <div className="relative w-44 h-44 flex items-center justify-center">
            {/* SVG Speedometer Arc */}
            <svg className="w-full h-full -rotate-90 transform" viewBox="0 0 160 160">
              {/* Background track circle */}
              <circle
                cx="80"
                cy="80"
                r={normalizedRadius}
                stroke="#1e293b"
                strokeWidth={strokeWidth}
                fill="transparent"
                strokeDasharray={circumference}
                strokeDashoffset={circumference * 0.25}
                strokeLinecap="round"
              />
              {/* Active animated meter */}
              <circle
                cx="80"
                cy="80"
                r={normalizedRadius}
                stroke={gaugeStroke}
                strokeWidth={strokeWidth}
                fill="transparent"
                strokeDasharray={circumference}
                strokeDashoffset={strokeDashoffset}
                strokeLinecap="round"
                style={{
                  transition: 'stroke-dashoffset 0.8s cubic-bezier(0.4, 0, 0.2, 1)',
                }}
              />
            </svg>

            {/* Inner Center Score Display */}
            <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
              <span className="text-4xl font-black text-white tracking-tighter">
                {score}
              </span>
              <span className="text-xs uppercase tracking-widest font-semibold text-slate-400">
                / 100 Risk
              </span>
              <span
                className={`text-[11px] font-bold mt-0.5 px-2 py-0.5 rounded ${
                  score >= 61
                    ? 'text-rose-400 bg-rose-500/10'
                    : score >= 31
                    ? 'text-amber-400 bg-amber-500/10'
                    : 'text-emerald-400 bg-emerald-500/10'
                }`}
              >
                {verdict}
              </span>
            </div>
          </div>

          <div className="flex items-center gap-3 text-xs text-slate-400 mt-2">
            <span className="flex items-center gap-1">
              <span className="w-2 h-2 rounded-full bg-emerald-400"></span> 0-30 Safe
            </span>
            <span className="flex items-center gap-1">
              <span className="w-2 h-2 rounded-full bg-amber-400"></span> 31-60 Warn
            </span>
            <span className="flex items-center gap-1">
              <span className="w-2 h-2 rounded-full bg-rose-400"></span> 61-100 Phish
            </span>
          </div>
        </div>

        {/* Far Right Action Buttons */}
        <div className="flex flex-col sm:flex-row lg:flex-col gap-3 w-full lg:w-auto">
          {aiAvailable && (
            <button
              onClick={onExplainAi}
              className="flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl font-semibold text-xs tracking-wide bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-white shadow-lg shadow-cyan-500/25 transition-all cursor-pointer"
            >
              <Sparkles className="w-4 h-4 text-cyan-100 animate-pulse" />
              <span>Explain with AI</span>
            </button>
          )}

          <button
            onClick={onPrintReport}
            className="flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl font-medium text-xs text-slate-200 bg-slate-800/90 hover:bg-slate-700 border border-slate-700 transition-all cursor-pointer"
          >
            <Printer className="w-4 h-4 text-slate-300" />
            <span>Download Report</span>
          </button>
        </div>
      </div>
    </div>
  );
};
