import React from 'react';
import { AnalysisResult } from '../types';

interface Props {
  result: AnalysisResult;
}

export const PrintableReport: React.FC<Props> = ({ result }) => {
  return (
    <div id="phishguard-printable-report" className="hidden print:block p-8 bg-white text-black font-sans">
      {/* Report Header */}
      <div className="border-b-2 border-black pb-4 mb-6 flex justify-between items-start">
        <div>
          <h1 className="text-2xl font-black uppercase tracking-wide">
            PhishGuard Security Investigation Report
          </h1>
          <p className="text-xs text-gray-600 mt-1">
            College Cybersecurity Operations Center &middot; Forensic Email Triage
          </p>
        </div>
        <div className="text-right text-xs">
          <div>
            <strong>Report ID:</strong> {result.id}
          </div>
          <div>
            <strong>Generated:</strong> {new Date(result.timestamp).toLocaleString()}
          </div>
          <div>
            <strong>Engine:</strong> PhishGuard Rule-Based Scanner v2.4
          </div>
        </div>
      </div>

      {/* Verdict & Score Summary Box */}
      <div className="border-2 border-black p-4 mb-6 flex justify-between items-center bg-gray-50">
        <div>
          <div className="text-xs uppercase font-bold text-gray-600">Final Triage Assessment</div>
          <div className="text-2xl font-black uppercase tracking-tight mt-0.5">
            Verdict: {result.verdict}
          </div>
          <p className="text-xs text-gray-700 mt-1 max-w-lg">{result.confidenceNote}</p>
        </div>
        <div className="text-center px-6 py-2 border-l-2 border-black">
          <div className="text-4xl font-black">{result.score}/100</div>
          <div className="text-xs font-bold uppercase tracking-wider text-gray-600">Risk Score</div>
        </div>
      </div>

      {/* Email Identification Table */}
      <div className="mb-6">
        <h2 className="text-sm font-bold uppercase tracking-wider border-b border-black pb-1 mb-2">
          1. Message Headers &amp; Identification
        </h2>
        <table className="w-full text-xs border border-gray-300">
          <tbody>
            <tr className="border-b border-gray-300">
              <td className="w-1/4 p-2 font-bold bg-gray-100">Subject:</td>
              <td className="p-2 font-medium">{result.metadata.subject}</td>
            </tr>
            <tr className="border-b border-gray-300">
              <td className="p-2 font-bold bg-gray-100">Visible From:</td>
              <td className="p-2 font-mono">
                {result.metadata.fromName} &lt;{result.metadata.fromAddress}&gt;
              </td>
            </tr>
            <tr className="border-b border-gray-300">
              <td className="p-2 font-bold bg-gray-100">From Domain:</td>
              <td className="p-2 font-mono">{result.metadata.fromDomain || 'N/A'}</td>
            </tr>
            <tr className="border-b border-gray-300">
              <td className="p-2 font-bold bg-gray-100">Reply-To:</td>
              <td className="p-2 font-mono">
                {result.metadata.replyToAddress || '(Same as From)'}
              </td>
            </tr>
            <tr className="border-b border-gray-300">
              <td className="p-2 font-bold bg-gray-100">SPF / DKIM / DMARC:</td>
              <td className="p-2 font-mono">
                SPF: {result.metadata.auth.spf.status.toUpperCase()} | DKIM:{' '}
                {result.metadata.auth.dkim.status.toUpperCase()} | DMARC:{' '}
                {result.metadata.auth.dmarc.status.toUpperCase()}
              </td>
            </tr>
            <tr>
              <td className="p-2 font-bold bg-gray-100">Origination Date:</td>
              <td className="p-2 font-mono">{result.metadata.date || 'N/A'}</td>
            </tr>
          </tbody>
        </table>
      </div>

      {/* Discovered Threat Evidence */}
      <div className="mb-6">
        <h2 className="text-sm font-bold uppercase tracking-wider border-b border-black pb-1 mb-2">
          2. Forensic Evidence &amp; Rule Violations
        </h2>
        <table className="w-full text-xs border border-gray-300">
          <thead className="bg-gray-100 text-left border-b border-gray-300">
            <tr>
              <th className="p-2 font-bold w-1/4">Check / Rule</th>
              <th className="p-2 font-bold w-20">Severity</th>
              <th className="p-2 font-bold w-16">Points</th>
              <th className="p-2 font-bold">Findings &amp; Discovered Evidence</th>
            </tr>
          </thead>
          <tbody>
            {result.findings.map((f, i) => (
              <tr key={i} className="border-b border-gray-300">
                <td className="p-2 font-semibold">{f.name}</td>
                <td className="p-2 uppercase font-bold">{f.severity}</td>
                <td className="p-2 font-bold">+{f.points}</td>
                <td className="p-2">
                  <div>{f.explanation}</div>
                  {f.evidence && (
                    <div className="font-mono text-[10px] text-gray-700 mt-1">
                      Evidence: {f.evidence}
                    </div>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Extracted URLs */}
      {result.metadata.extractedUrls.length > 0 && (
        <div className="mb-6">
          <h2 className="text-sm font-bold uppercase tracking-wider border-b border-black pb-1 mb-2">
            3. Hyperlinks &amp; Destination Analysis
          </h2>
          <table className="w-full text-xs border border-gray-300">
            <thead className="bg-gray-100 text-left border-b border-gray-300">
              <tr>
                <th className="p-2 font-bold">Visible Text</th>
                <th className="p-2 font-bold">Actual Target URL</th>
                <th className="p-2 font-bold">Domain</th>
                <th className="p-2 font-bold">Risk Assessment</th>
              </tr>
            </thead>
            <tbody>
              {result.metadata.extractedUrls.map((u, i) => (
                <tr key={i} className="border-b border-gray-300">
                  <td className="p-2 font-mono truncate max-w-xs">{u.displayText}</td>
                  <td className="p-2 font-mono break-all">{u.url}</td>
                  <td className="p-2 font-mono">{u.domain}</td>
                  <td className="p-2">
                    {u.flags.length > 0 ? (
                      <span className="font-bold text-red-700">{u.flags.join(', ')}</span>
                    ) : (
                      'Clean'
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Recommendations */}
      <div className="border-t-2 border-black pt-4 text-xs">
        <h2 className="text-sm font-bold uppercase tracking-wider mb-2">
          4. Recommended Containment &amp; Student Actions
        </h2>
        <ul className="list-disc pl-5 space-y-1">
          <li>Do NOT click any links, open attachments, or reply to this message.</li>
          <li>
            Forward the raw email (.eml format) to Campus Information Security at{' '}
            <code>security@college.edu</code>.
          </li>
          <li>
            If passwords or 2FA credentials were entered, immediately reset your campus SSO password
            and terminate active web sessions.
          </li>
          <li>
            Verify any purported administrative requests in person or via the verified phone
            directory.
          </li>
        </ul>
      </div>
    </div>
  );
};
