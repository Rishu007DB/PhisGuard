import React, { useState } from 'react';
import { Finding, FindingSeverity } from '../types';
import {
  AlertOctagon,
  AlertTriangle,
  Info,
  CheckCircle2,
  Shield,
  HelpCircle,
  ChevronDown,
  ChevronUp,
  Filter,
} from 'lucide-react';

interface Props {
  findings: Finding[];
}

export const EvidenceList: React.FC<Props> = ({ findings }) => {
  const [filter, setFilter] = useState<'all' | 'fail' | 'warn' | 'pass'>('all');
  const [expandedId, setExpandedId] = useState<string | null>(null);

  const filteredFindings = findings.filter((f) => {
    if (filter === 'all') return true;
    return f.status === filter;
  });

  const getSeverityBadge = (severity: FindingSeverity, status: Finding['status']) => {
    if (status === 'pass') {
      return (
        <span className="inline-flex items-center gap-1 text-[11px] font-semibold uppercase px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-400 border border-emerald-500/30">
          <CheckCircle2 className="w-3 h-3" />
          Pass (0 pts)
        </span>
      );
    }

    switch (severity) {
      case 'critical':
        return (
          <span className="inline-flex items-center gap-1 text-[11px] font-semibold uppercase px-2 py-0.5 rounded bg-rose-500/15 text-rose-300 border border-rose-500/40">
            <AlertOctagon className="w-3 h-3 text-rose-400" />
            Critical Threat
          </span>
        );
      case 'high':
        return (
          <span className="inline-flex items-center gap-1 text-[11px] font-semibold uppercase px-2 py-0.5 rounded bg-orange-500/15 text-orange-300 border border-orange-500/40">
            <AlertTriangle className="w-3 h-3 text-orange-400" />
            High Risk
          </span>
        );
      case 'medium':
        return (
          <span className="inline-flex items-center gap-1 text-[11px] font-semibold uppercase px-2 py-0.5 rounded bg-amber-500/15 text-amber-300 border border-amber-500/40">
            <AlertTriangle className="w-3 h-3 text-amber-400" />
            Moderate Risk
          </span>
        );
      case 'low':
        return (
          <span className="inline-flex items-center gap-1 text-[11px] font-semibold uppercase px-2 py-0.5 rounded bg-blue-500/15 text-blue-300 border border-blue-500/40">
            <Info className="w-3 h-3 text-blue-400" />
            Minor Flaw
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center gap-1 text-[11px] font-semibold uppercase px-2 py-0.5 rounded bg-slate-800 text-slate-400 border border-slate-700">
            <Shield className="w-3 h-3" />
            Informational
          </span>
        );
    }
  };

  const toggleExpand = (id: string) => {
    setExpandedId(expandedId === id ? null : id);
  };

  const threatCount = findings.filter((f) => f.status === 'fail').length;
  const warnCount = findings.filter((f) => f.status === 'warn').length;
  const passCount = findings.filter((f) => f.status === 'pass').length;

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-xl overflow-hidden shadow-xl">
      {/* Header with filters */}
      <div className="px-6 py-4 bg-slate-950/80 border-b border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h3 className="font-bold text-slate-100 text-base tracking-wide flex items-center gap-2">
            <span>Why is this flagged? (Ranked Evidence)</span>
            <span className="text-xs font-normal text-slate-400 bg-slate-800 px-2 py-0.5 rounded-full border border-slate-700">
              {findings.length} checks performed
            </span>
          </h3>
          <p className="text-xs text-slate-400 mt-0.5">
            Every score penalty is mapped to explicit forensic evidence and plain-English rationale.
          </p>
        </div>

        {/* Filter buttons */}
        <div className="flex items-center gap-1.5 self-start sm:self-center bg-slate-900 p-1 rounded-lg border border-slate-800">
          <button
            onClick={() => setFilter('all')}
            className={`px-2.5 py-1 rounded text-xs font-medium transition-all ${
              filter === 'all'
                ? 'bg-slate-800 text-slate-100 border border-slate-700 shadow-sm'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            All ({findings.length})
          </button>
          <button
            onClick={() => setFilter('fail')}
            className={`px-2.5 py-1 rounded text-xs font-medium transition-all ${
              filter === 'fail'
                ? 'bg-rose-500/20 text-rose-300 border border-rose-500/40 shadow-sm'
                : 'text-rose-400 hover:text-rose-300'
            }`}
          >
            Threats ({threatCount})
          </button>
          <button
            onClick={() => setFilter('warn')}
            className={`px-2.5 py-1 rounded text-xs font-medium transition-all ${
              filter === 'warn'
                ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40 shadow-sm'
                : 'text-amber-400 hover:text-amber-300'
            }`}
          >
            Warnings ({warnCount})
          </button>
          <button
            onClick={() => setFilter('pass')}
            className={`px-2.5 py-1 rounded text-xs font-medium transition-all ${
              filter === 'pass'
                ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 shadow-sm'
                : 'text-emerald-400 hover:text-emerald-300'
            }`}
          >
            Passed ({passCount})
          </button>
        </div>
      </div>

      {/* Evidence Cards List */}
      <div className="divide-y divide-slate-800/80 p-4 space-y-3">
        {filteredFindings.length === 0 ? (
          <div className="text-center py-8 text-slate-400 text-sm">
            No checks match the selected filter.
          </div>
        ) : (
          filteredFindings.map((finding) => {
            const isExpanded = expandedId === finding.id;

            let cardBorder = 'border-slate-800 bg-slate-900/60';
            if (finding.status === 'fail') {
              cardBorder =
                finding.severity === 'critical'
                  ? 'border-rose-500/40 bg-rose-950/10 hover:border-rose-500/60'
                  : 'border-orange-500/30 bg-orange-950/10 hover:border-orange-500/50';
            } else if (finding.status === 'warn') {
              cardBorder = 'border-amber-500/30 bg-amber-950/10 hover:border-amber-500/50';
            } else {
              cardBorder = 'border-slate-800 bg-slate-900/40 hover:border-slate-700';
            }

            return (
              <div
                key={finding.id}
                className={`rounded-xl border p-4.5 transition-all ${cardBorder}`}
              >
                <div
                  className="flex items-start justify-between gap-3 cursor-pointer select-none"
                  onClick={() => toggleExpand(finding.id)}
                >
                  <div className="space-y-1.5 flex-1">
                    <div className="flex flex-wrap items-center gap-2">
                      {getSeverityBadge(finding.severity, finding.status)}
                      <h4 className="font-semibold text-slate-100 text-sm">
                        {finding.name}
                      </h4>
                      {finding.points > 0 && (
                        <span className="text-xs font-bold text-rose-400 bg-rose-500/10 px-2 py-0.5 rounded border border-rose-500/30">
                          +{finding.points} risk pts
                        </span>
                      )}
                    </div>

                    <p className="text-sm text-slate-300 leading-normal">
                      {finding.explanation}
                    </p>
                  </div>

                  <button className="text-slate-400 hover:text-slate-200 mt-1 p-1">
                    {isExpanded ? (
                      <ChevronUp className="w-4 h-4" />
                    ) : (
                      <ChevronDown className="w-4 h-4" />
                    )}
                  </button>
                </div>

                {/* Evidence snippet */}
                {finding.evidence && (
                  <div className="mt-3 bg-slate-950/80 border border-slate-800/80 rounded-lg p-2.5 font-mono text-xs text-slate-300 break-all">
                    <span className="text-slate-500 select-none mr-2 font-sans font-medium uppercase tracking-wider text-[10px]">
                      Discovered Evidence:
                    </span>
                    <span className="text-cyan-300">{finding.evidence}</span>
                  </div>
                )}

                {/* Expanded "Why It Matters" student rationale */}
                {isExpanded && (
                  <div className="mt-3 pt-3 border-t border-slate-800/80 bg-slate-950/40 -mx-4 -mb-4 p-4 rounded-b-xl space-y-2">
                    <div className="flex items-start gap-2 text-xs text-slate-300">
                      <HelpCircle className="w-4 h-4 text-cyan-400 shrink-0 mt-0.5" />
                      <div>
                        <strong className="text-cyan-300 block font-semibold mb-0.5">
                          Why this matters for students:
                        </strong>
                        <p className="leading-relaxed text-slate-300">
                          {finding.whyItMatters}
                        </p>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};
