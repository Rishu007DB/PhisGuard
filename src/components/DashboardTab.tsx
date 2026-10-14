import React from 'react';
import { AnalysisResult } from '../types';
import {
  PieChart,
  Pie,
  Cell,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from 'recharts';
import {
  ShieldCheck,
  AlertTriangle,
  ShieldAlert,
  History,
  Trash2,
  Download,
  FolderOpen,
  TrendingUp,
  BarChart2,
  PieChart as PieIcon,
  Flame,
} from 'lucide-react';

interface Props {
  history: AnalysisResult[];
  onSelectResult: (result: AnalysisResult) => void;
  onClearHistory: () => void;
}

const VERDICT_COLORS: Record<string, string> = {
  Safe: '#10b981', // emerald-500
  Suspicious: '#f59e0b', // amber-500
  Phishing: '#f43f5e', // rose-500
};

export const DashboardTab: React.FC<Props> = ({
  history,
  onSelectResult,
  onClearHistory,
}) => {
  const totalAnalyzed = history.length;
  const safeCount = history.filter((h) => h.verdict === 'Safe').length;
  const suspCount = history.filter((h) => h.verdict === 'Suspicious').length;
  const phishCount = history.filter((h) => h.verdict === 'Phishing').length;

  const averageScore =
    totalAnalyzed > 0
      ? Math.round(history.reduce((acc, curr) => acc + curr.score, 0) / totalAnalyzed)
      : 0;

  // Pie chart data
  const pieData = [
    { name: 'Safe', value: safeCount, color: VERDICT_COLORS.Safe },
    { name: 'Suspicious', value: suspCount, color: VERDICT_COLORS.Suspicious },
    { name: 'Phishing', value: phishCount, color: VERDICT_COLORS.Phishing },
  ].filter((d) => d.value > 0);

  // Compute top red flags across all history
  const flagFrequencies: Record<string, number> = {};
  for (const item of history) {
    for (const f of item.findings) {
      if (f.status === 'fail' || f.status === 'warn') {
        flagFrequencies[f.name] = (flagFrequencies[f.name] || 0) + 1;
      }
    }
  }

  const topFlagsData = Object.entries(flagFrequencies)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 6)
    .map(([name, count]) => ({
      name: name.length > 25 ? name.slice(0, 23) + '...' : name,
      fullName: name,
      count,
    }));

  // Average pillar score distribution
  const categoryTotals = { sender: 0, urls: 0, language: 0, auth: 0, reputation: 0 };
  for (const item of history) {
    categoryTotals.sender += item.categoryScores.sender || 0;
    categoryTotals.urls += item.categoryScores.urls || 0;
    categoryTotals.language += item.categoryScores.language || 0;
    categoryTotals.auth += item.categoryScores.auth || 0;
    categoryTotals.reputation += item.categoryScores.reputation || 0;
  }

  const pillarData = [
    { name: 'Sender', score: totalAnalyzed ? Math.round(categoryTotals.sender / totalAnalyzed) : 0 },
    { name: 'Links/URLs', score: totalAnalyzed ? Math.round(categoryTotals.urls / totalAnalyzed) : 0 },
    { name: 'Language', score: totalAnalyzed ? Math.round(categoryTotals.language / totalAnalyzed) : 0 },
    { name: 'Auth', score: totalAnalyzed ? Math.round(categoryTotals.auth / totalAnalyzed) : 0 },
    { name: 'Reputation', score: totalAnalyzed ? Math.round(categoryTotals.reputation / totalAnalyzed) : 0 },
  ];

  const exportHistoryJson = () => {
    const dataStr = 'data:text/json;charset=utf-8,' + encodeURIComponent(JSON.stringify(history, null, 2));
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute('href', dataStr);
    downloadAnchor.setAttribute('download', `phishguard-triage-history-${Date.now()}.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
  };

  return (
    <div className="space-y-8">
      {/* Top Banner & Quick Controls */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-slate-900 border border-slate-800 p-6 rounded-2xl shadow-lg">
        <div>
          <h2 className="text-xl sm:text-2xl font-bold text-white tracking-tight flex items-center gap-2.5">
            <TrendingUp className="w-6 h-6 text-cyan-400" />
            <span>Campus Email Threat Analytics &amp; Triage History</span>
          </h2>
          <p className="text-xs text-slate-400 mt-1">
            Aggregated metrics across all analyzed samples during this hackathon session.
          </p>
        </div>

        <div className="flex items-center gap-2">
          {totalAnalyzed > 0 && (
            <>
              <button
                onClick={exportHistoryJson}
                className="flex items-center gap-1.5 px-3 py-2 text-xs font-medium text-slate-300 bg-slate-800 hover:bg-slate-700 rounded-xl border border-slate-700 transition-colors"
                title="Export history data as JSON"
              >
                <Download className="w-3.5 h-3.5" />
                <span>Export JSON</span>
              </button>

              <button
                onClick={onClearHistory}
                className="flex items-center gap-1.5 px-3 py-2 text-xs font-medium text-rose-300 bg-rose-500/10 hover:bg-rose-500/20 rounded-xl border border-rose-500/30 transition-colors"
                title="Clear all stored triage history"
              >
                <Trash2 className="w-3.5 h-3.5" />
                <span>Clear History</span>
              </button>
            </>
          )}
        </div>
      </div>

      {/* KPI Stats Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-5 gap-4">
        {/* Total Scanned */}
        <div className="bg-slate-900 border border-slate-800 p-4 rounded-xl shadow">
          <div className="text-slate-400 text-xs font-medium flex items-center justify-between">
            <span>Total Analyzed</span>
            <History className="w-4 h-4 text-cyan-400" />
          </div>
          <div className="text-3xl font-extrabold text-white mt-2">{totalAnalyzed}</div>
          <div className="text-[11px] text-slate-500 mt-1">Logged in session</div>
        </div>

        {/* Phishing Count */}
        <div className="bg-slate-900 border border-slate-800 p-4 rounded-xl shadow">
          <div className="text-rose-400 text-xs font-semibold flex items-center justify-between">
            <span>Phishing Confirmed</span>
            <ShieldAlert className="w-4 h-4 text-rose-400" />
          </div>
          <div className="text-3xl font-extrabold text-rose-400 mt-2">{phishCount}</div>
          <div className="text-[11px] text-slate-500 mt-1">
            {totalAnalyzed > 0 ? Math.round((phishCount / totalAnalyzed) * 100) : 0}% of all emails
          </div>
        </div>

        {/* Suspicious Count */}
        <div className="bg-slate-900 border border-slate-800 p-4 rounded-xl shadow">
          <div className="text-amber-400 text-xs font-semibold flex items-center justify-between">
            <span>Suspicious</span>
            <AlertTriangle className="w-4 h-4 text-amber-400" />
          </div>
          <div className="text-3xl font-extrabold text-amber-400 mt-2">{suspCount}</div>
          <div className="text-[11px] text-slate-500 mt-1">Elevated risk</div>
        </div>

        {/* Safe Count */}
        <div className="bg-slate-900 border border-slate-800 p-4 rounded-xl shadow">
          <div className="text-emerald-400 text-xs font-semibold flex items-center justify-between">
            <span>Verified Safe</span>
            <ShieldCheck className="w-4 h-4 text-emerald-400" />
          </div>
          <div className="text-3xl font-extrabold text-emerald-400 mt-2">{safeCount}</div>
          <div className="text-[11px] text-slate-500 mt-1">Passed all tests</div>
        </div>

        {/* Average Risk Score */}
        <div className="bg-slate-900 border border-slate-800 p-4 rounded-xl shadow col-span-2 sm:col-span-1">
          <div className="text-slate-400 text-xs font-medium flex items-center justify-between">
            <span>Avg Risk Score</span>
            <TrendingUp className="w-4 h-4 text-purple-400" />
          </div>
          <div className="text-3xl font-extrabold text-white mt-2">
            {averageScore}
            <span className="text-xs text-slate-500 font-normal">/100</span>
          </div>
          <div className="text-[11px] text-slate-500 mt-1">Mean threat level</div>
        </div>
      </div>

      {totalAnalyzed === 0 ? (
        <div className="bg-slate-900/60 border border-slate-800 rounded-2xl p-12 text-center">
          <FolderOpen className="w-12 h-12 text-slate-600 mx-auto mb-3" />
          <h3 className="text-base font-semibold text-slate-300">No Emails Analyzed Yet</h3>
          <p className="text-xs text-slate-500 max-w-md mx-auto mt-1">
            Switch to the Analyzer tab, select a sample email or paste raw headers, and click
            "Analyze Email" to start logging forensic history.
          </p>
        </div>
      ) : (
        <>
          {/* Charts Row */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Donut Chart: Verdict Distribution */}
            <div className="bg-slate-900 border border-slate-800 p-6 rounded-xl shadow-xl flex flex-col justify-between">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                  <PieIcon className="w-4 h-4 text-cyan-400" />
                  <h3 className="text-sm font-bold text-slate-100">
                    Email Verdict Distribution
                  </h3>
                </div>
                <span className="text-xs text-slate-400">{totalAnalyzed} samples</span>
              </div>

              <div className="h-64 w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={pieData}
                      dataKey="value"
                      nameKey="name"
                      cx="50%"
                      cy="50%"
                      innerRadius={55}
                      outerRadius={85}
                      paddingAngle={4}
                    >
                      {pieData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} stroke="#0f172a" strokeWidth={2} />
                      ))}
                    </Pie>
                    <Tooltip
                      contentStyle={{
                        backgroundColor: '#0f172a',
                        borderColor: '#334155',
                        borderRadius: '0.5rem',
                        color: '#f8fafc',
                        fontSize: '12px',
                      }}
                    />
                    <Legend
                      verticalAlign="bottom"
                      height={36}
                      formatter={(val) => <span className="text-xs text-slate-300 mr-2">{val}</span>}
                    />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* Bar Chart: Pillar Threat Impact */}
            <div className="bg-slate-900 border border-slate-800 p-6 rounded-xl shadow-xl flex flex-col justify-between">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                  <BarChart2 className="w-4 h-4 text-cyan-400" />
                  <h3 className="text-sm font-bold text-slate-100">
                    Average Risk Points by Attack Pillar
                  </h3>
                </div>
                <span className="text-xs text-slate-400">Heuristic weight</span>
              </div>

              <div className="h-64 w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={pillarData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                    <XAxis dataKey="name" stroke="#64748b" fontSize={11} tickLine={false} />
                    <YAxis stroke="#64748b" fontSize={11} tickLine={false} />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: '#0f172a',
                        borderColor: '#334155',
                        borderRadius: '0.5rem',
                        color: '#f8fafc',
                        fontSize: '12px',
                      }}
                      formatter={(value: any) => [`+${value} avg pts`, 'Risk Impact']}
                    />
                    <Bar dataKey="score" fill="#38bdf8" radius={[4, 4, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>

          {/* Top Red Flags Frequency */}
          {topFlagsData.length > 0 && (
            <div className="bg-slate-900 border border-slate-800 p-6 rounded-xl shadow-xl">
              <div className="flex items-center gap-2 mb-4">
                <Flame className="w-4 h-4 text-rose-400" />
                <h3 className="text-sm font-bold text-slate-100">
                  Most Prevalent Threat Indicators Detected
                </h3>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                {topFlagsData.map((flag, idx) => (
                  <div
                    key={idx}
                    className="p-3 bg-slate-950/80 rounded-lg border border-slate-800 flex items-center justify-between"
                  >
                    <div className="text-xs text-slate-200 font-medium truncate pr-2" title={flag.fullName}>
                      {flag.fullName}
                    </div>
                    <span className="text-xs font-bold px-2 py-0.5 rounded bg-rose-500/15 text-rose-300 border border-rose-500/30 shrink-0">
                      {flag.count} hit{flag.count > 1 ? 's' : ''}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Recent Analysis Table */}
          <div className="bg-slate-900 border border-slate-800 rounded-xl overflow-hidden shadow-xl">
            <div className="px-6 py-4 bg-slate-950/80 border-b border-slate-800 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <History className="w-4 h-4 text-cyan-400" />
                <h3 className="font-semibold text-slate-100 text-sm tracking-wide">
                  Recent Email Investigations
                </h3>
              </div>
              <span className="text-xs text-slate-400">
                Click any row to reopen analysis details
              </span>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs text-slate-300">
                <thead className="bg-slate-950 text-slate-400 uppercase text-[11px] tracking-wider border-b border-slate-800">
                  <tr>
                    <th className="px-5 py-3 font-semibold">Timestamp</th>
                    <th className="px-5 py-3 font-semibold">Subject</th>
                    <th className="px-5 py-3 font-semibold">Visible Sender</th>
                    <th className="px-5 py-3 font-semibold text-center">Score</th>
                    <th className="px-5 py-3 font-semibold">Verdict</th>
                    <th className="px-5 py-3 font-semibold text-right">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/80">
                  {history.map((item) => (
                    <tr
                      key={item.id}
                      onClick={() => onSelectResult(item)}
                      className="hover:bg-slate-800/50 cursor-pointer transition-colors"
                    >
                      <td className="px-5 py-3 text-slate-400 font-mono">
                        {new Date(item.timestamp).toLocaleTimeString([], {
                          hour: '2-digit',
                          minute: '2-digit',
                          second: '2-digit',
                        })}
                      </td>

                      <td className="px-5 py-3 font-medium text-slate-100 max-w-xs truncate">
                        {item.metadata.subject}
                      </td>

                      <td className="px-5 py-3 font-mono text-slate-300 max-w-xs truncate">
                        {item.metadata.fromName || item.metadata.fromAddress}
                      </td>

                      <td className="px-5 py-3 font-black text-center">
                        <span
                          className={`px-2 py-0.5 rounded text-xs ${
                            item.score >= 61
                              ? 'text-rose-400 bg-rose-500/10'
                              : item.score >= 31
                              ? 'text-amber-400 bg-amber-500/10'
                              : 'text-emerald-400 bg-emerald-500/10'
                          }`}
                        >
                          {item.score}
                        </span>
                      </td>

                      <td className="px-5 py-3">
                        <span
                          className={`px-2.5 py-0.5 rounded-full font-semibold uppercase text-[10px] tracking-wider border ${
                            item.verdict === 'Phishing'
                              ? 'bg-rose-500/15 text-rose-300 border-rose-500/40'
                              : item.verdict === 'Suspicious'
                              ? 'bg-amber-500/15 text-amber-300 border-amber-500/40'
                              : 'bg-emerald-500/15 text-emerald-300 border-emerald-500/40'
                          }`}
                        >
                          {item.verdict}
                        </span>
                      </td>

                      <td className="px-5 py-3 text-right">
                        <button className="text-cyan-400 hover:text-cyan-300 font-medium">
                          Inspect &rarr;
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </>
      )}
    </div>
  );
};
