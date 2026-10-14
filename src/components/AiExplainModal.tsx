import React, { useState } from 'react';
import { AnalysisResult } from '../types';
import { Sparkles, X, Copy, Check, ShieldCheck, AlertCircle, Loader2 } from 'lucide-react';

interface Props {
  result: AnalysisResult;
  isOpen: boolean;
  onClose: () => void;
  aiExplanation?: string;
  isLoading: boolean;
  error?: string | null;
  onRegenerate: () => void;
}

export const AiExplainModal: React.FC<Props> = ({
  result,
  isOpen,
  onClose,
  aiExplanation,
  isLoading,
  error,
  onRegenerate,
}) => {
  const [copied, setCopied] = useState(false);

  if (!isOpen) return null;

  const handleCopy = () => {
    if (!aiExplanation) return;
    navigator.clipboard.writeText(aiExplanation);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm animate-fade-in">
      <div className="bg-slate-900 border border-slate-700/80 rounded-2xl w-full max-w-2xl overflow-hidden shadow-2xl flex flex-col max-h-[90vh]">
        {/* Modal Header */}
        <div className="flex items-center justify-between px-6 py-4 bg-slate-950 border-b border-slate-800">
          <div className="flex items-center gap-2.5">
            <div className="p-1.5 bg-cyan-500/10 rounded-lg border border-cyan-500/30">
              <Sparkles className="w-5 h-5 text-cyan-400" />
            </div>
            <div>
              <h3 className="font-bold text-white text-base">
                AI Forensic Verdict Explanation
              </h3>
              <p className="text-xs text-slate-400">
                Ground-truth explanation synthesized from rule-based findings
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="text-slate-400 hover:text-white p-1 rounded-lg hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6 overflow-y-auto space-y-4 text-slate-200">
          {/* Email context pill */}
          <div className="bg-slate-950/80 p-3 rounded-xl border border-slate-800/80 text-xs flex flex-wrap items-center justify-between gap-2">
            <div>
              <span className="text-slate-400">Subject: </span>
              <span className="text-white font-medium">{result.metadata.subject}</span>
            </div>
            <div className="flex items-center gap-2">
              <span
                className={`px-2 py-0.5 rounded font-bold uppercase text-[11px] ${
                  result.verdict === 'Phishing'
                    ? 'text-rose-400 bg-rose-500/10 border border-rose-500/30'
                    : result.verdict === 'Suspicious'
                    ? 'text-amber-400 bg-amber-500/10 border border-amber-500/30'
                    : 'text-emerald-400 bg-emerald-500/10 border border-emerald-500/30'
                }`}
              >
                {result.verdict} ({result.score}/100)
              </span>
            </div>
          </div>

          {isLoading ? (
            <div className="py-12 flex flex-col items-center justify-center text-center space-y-3">
              <Loader2 className="w-8 h-8 text-cyan-400 animate-spin" />
              <div className="text-sm font-semibold text-slate-300">
                Synthesizing student-friendly explanation...
              </div>
              <p className="text-xs text-slate-500 max-w-sm">
                Gemini 3.8 Flash is analyzing the rule-based heuristic findings to compose an educational breakdown.
              </p>
            </div>
          ) : error ? (
            <div className="p-4 bg-rose-950/20 border border-rose-500/40 rounded-xl space-y-2">
              <div className="flex items-center gap-2 text-rose-400 font-semibold text-sm">
                <AlertCircle className="w-4 h-4" />
                <span>Unable to Generate AI Explanation</span>
              </div>
              <p className="text-xs text-rose-200">{error}</p>
              <button
                onClick={onRegenerate}
                className="mt-2 px-3 py-1 text-xs bg-rose-500/20 hover:bg-rose-500/30 text-rose-300 rounded border border-rose-500/40 transition-colors"
              >
                Retry
              </button>
            </div>
          ) : (
            <div className="prose prose-invert max-w-none text-xs sm:text-sm text-slate-300 leading-relaxed space-y-3 whitespace-pre-wrap">
              {aiExplanation}
            </div>
          )}
        </div>

        {/* Modal Footer */}
        <div className="flex items-center justify-between px-6 py-3 bg-slate-950 border-t border-slate-800 text-xs">
          <span className="text-[11px] text-slate-500">
            Powered by Gemini 3.8 Flash &middot; Score remains strictly rule-based
          </span>

          <div className="flex items-center gap-2">
            {aiExplanation && !isLoading && (
              <button
                onClick={handleCopy}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 transition-colors"
              >
                {copied ? (
                  <>
                    <Check className="w-3.5 h-3.5 text-emerald-400" />
                    <span className="text-emerald-400">Copied</span>
                  </>
                ) : (
                  <>
                    <Copy className="w-3.5 h-3.5" />
                    <span>Copy Text</span>
                  </>
                )}
              </button>
            )}

            <button
              onClick={onClose}
              className="px-4 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 font-medium transition-colors"
            >
              Close
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
