import React from 'react';
import { EmailMetadata, ExtractedUrl } from '../types';
import {
  Mail,
  CornerDownRight,
  Shield,
  Link2,
  Calendar,
  AlertTriangle,
  CheckCircle2,
  XCircle,
  HelpCircle,
  ExternalLink,
} from 'lucide-react';

interface Props {
  metadata: EmailMetadata;
}

export const ExtractedDetails: React.FC<Props> = ({ metadata }) => {
  const getAuthChip = (title: string, status: string, raw: string, meaning: string) => {
    let chipStyle = '';
    let icon = <CheckCircle2 className="w-3.5 h-3.5" />;

    if (status === 'pass') {
      chipStyle = 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30';
      icon = <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />;
    } else if (status === 'fail') {
      chipStyle = 'bg-rose-500/10 text-rose-400 border-rose-500/30';
      icon = <XCircle className="w-3.5 h-3.5 text-rose-400" />;
    } else if (status === 'softfail') {
      chipStyle = 'bg-amber-500/10 text-amber-400 border-amber-500/30';
      icon = <AlertTriangle className="w-3.5 h-3.5 text-amber-400" />;
    } else {
      chipStyle = 'bg-slate-800 text-slate-400 border-slate-700';
      icon = <HelpCircle className="w-3.5 h-3.5 text-slate-400" />;
    }

    return (
      <div
        className={`p-3 rounded-xl border ${chipStyle} flex flex-col justify-between`}
      >
        <div className="flex items-center justify-between">
          <span className="font-bold text-xs uppercase tracking-wider">{title}</span>
          <span className="flex items-center gap-1 text-xs font-semibold uppercase">
            {icon}
            {status}
          </span>
        </div>
        <p className="text-[11px] mt-1.5 opacity-90 leading-tight">{meaning}</p>
        <div className="mt-2 text-[10px] font-mono truncate text-slate-400 border-t border-slate-800/60 pt-1.5">
          {raw}
        </div>
      </div>
    );
  };

  const hasReplyMismatch =
    metadata.replyToAddress &&
    metadata.fromAddress &&
    metadata.replyToDomain !== metadata.fromDomain;

  return (
    <div className="space-y-6">
      {/* Top Grid: Sender & Authentication */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Sender & Header Identity Details */}
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 shadow-lg">
          <div className="flex items-center gap-2 mb-4 text-slate-200 font-semibold text-sm">
            <Mail className="w-4 h-4 text-cyan-400" />
            <span>Extracted Header &amp; Sender Information</span>
          </div>

          <div className="space-y-3 text-xs">
            {/* From */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-2 border-b border-slate-800/80 gap-1">
              <span className="text-slate-400 font-medium">Visible From:</span>
              <div className="font-mono text-slate-200 text-right">
                <span className="text-white font-semibold">{metadata.fromName}</span>
                {metadata.fromAddress && (
                  <span className="text-cyan-300 ml-1.5">&lt;{metadata.fromAddress}&gt;</span>
                )}
              </div>
            </div>

            {/* Sender Domain */}
            <div className="flex items-center justify-between pb-2 border-b border-slate-800/80">
              <span className="text-slate-400 font-medium">From Domain:</span>
              <span className="font-mono text-slate-200 bg-slate-950 px-2 py-0.5 rounded border border-slate-800">
                {metadata.fromDomain || 'Unknown'}
              </span>
            </div>

            {/* Reply-To */}
            <div className="flex flex-col sm:flex-row sm:items-start justify-between pb-2 border-b border-slate-800/80 gap-1">
              <span className="text-slate-400 font-medium flex items-center gap-1">
                <CornerDownRight className="w-3.5 h-3.5 text-slate-500" />
                Reply-To Address:
              </span>
              <div className="text-right">
                <span className="font-mono text-slate-200">
                  {metadata.replyToAddress || '(Same as From)'}
                </span>
                {hasReplyMismatch && (
                  <span className="block mt-1 text-[11px] text-rose-400 font-semibold bg-rose-500/10 px-2 py-0.5 rounded border border-rose-500/30">
                    Warning: Mismatched domain (@{metadata.replyToDomain})
                  </span>
                )}
              </div>
            </div>

            {/* Subject */}
            <div className="flex flex-col sm:flex-row sm:items-start justify-between pb-2 border-b border-slate-800/80 gap-1">
              <span className="text-slate-400 font-medium">Subject:</span>
              <span className="font-medium text-slate-100 text-right max-w-sm">
                {metadata.subject}
              </span>
            </div>

            {/* Date */}
            <div className="flex items-center justify-between">
              <span className="text-slate-400 font-medium flex items-center gap-1">
                <Calendar className="w-3.5 h-3.5 text-slate-500" />
                Origination Date:
              </span>
              <span className="font-mono text-slate-300">
                {metadata.date || 'Not specified in headers'}
              </span>
            </div>
          </div>
        </div>

        {/* Cryptographic Authentication Details */}
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 shadow-lg flex flex-col justify-between">
          <div>
            <div className="flex items-center gap-2 mb-2 text-slate-200 font-semibold text-sm">
              <Shield className="w-4 h-4 text-cyan-400" />
              <span>Cryptographic Protocol Authentication</span>
            </div>
            <p className="text-xs text-slate-400 mb-4">
              Internet email standards verify server identity and tamper-proofing.
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              {getAuthChip(
                'SPF',
                metadata.auth.spf.status,
                metadata.auth.spf.raw,
                metadata.auth.spf.status === 'pass'
                  ? 'Server IP is authorized'
                  : metadata.auth.spf.status === 'fail'
                  ? 'Unauthorized relay IP'
                  : 'Not verified'
              )}

              {getAuthChip(
                'DKIM',
                metadata.auth.dkim.status,
                metadata.auth.dkim.raw,
                metadata.auth.dkim.status === 'pass'
                  ? 'Digital signature intact'
                  : metadata.auth.dkim.status === 'fail'
                  ? 'Tampered signature'
                  : 'No signature'
              )}

              {getAuthChip(
                'DMARC',
                metadata.auth.dmarc.status,
                metadata.auth.dmarc.raw,
                metadata.auth.dmarc.status === 'pass'
                  ? 'Domain aligns with SPF/DKIM'
                  : metadata.auth.dmarc.status === 'fail'
                  ? 'From domain rejected'
                  : 'Policy absent'
              )}
            </div>
          </div>

          <div className="mt-4 p-2.5 bg-slate-950/60 rounded-lg border border-slate-800 text-[11px] text-slate-400 flex items-start gap-2">
            <HelpCircle className="w-4 h-4 text-cyan-400 shrink-0 mt-0.5" />
            <span>
              <strong>Student Tip:</strong> If DMARC or SPF fails, someone is transmitting
              emails using a forged sender address that their mail servers do not own.
            </span>
          </div>
        </div>
      </div>

      {/* Extracted URLs Table */}
      <div className="bg-slate-900 border border-slate-800 rounded-xl overflow-hidden shadow-xl">
        <div className="px-6 py-4 bg-slate-950/80 border-b border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Link2 className="w-4 h-4 text-cyan-400" />
            <h3 className="font-semibold text-slate-100 text-sm tracking-wide">
              Discovered Hyperlinks &amp; Target Domains
            </h3>
            <span className="text-xs bg-slate-800 text-slate-400 px-2 py-0.5 rounded-full border border-slate-700">
              {metadata.extractedUrls.length} links inspected
            </span>
          </div>
          <span className="text-xs text-slate-400 hidden sm:inline">
            Zero-Click Sandbox (URLs are never requested)
          </span>
        </div>

        {metadata.extractedUrls.length === 0 ? (
          <div className="p-8 text-center text-slate-400 text-sm">
            No hyperlinks were detected in the email body.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs text-slate-300">
              <thead className="bg-slate-950 text-slate-400 uppercase text-[11px] tracking-wider border-b border-slate-800">
                <tr>
                  <th className="px-5 py-3 font-semibold">Visible Anchor Text</th>
                  <th className="px-5 py-3 font-semibold">Destination Href Target</th>
                  <th className="px-5 py-3 font-semibold">Target Domain</th>
                  <th className="px-5 py-3 font-semibold">Protocol</th>
                  <th className="px-5 py-3 font-semibold">Security Flags</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/80">
                {metadata.extractedUrls.map((item, idx) => (
                  <tr
                    key={idx}
                    className={`hover:bg-slate-800/40 transition-colors ${
                      item.flags.length > 0 ? 'bg-rose-950/10' : ''
                    }`}
                  >
                    <td className="px-5 py-3 font-mono font-medium max-w-xs truncate text-slate-200">
                      {item.displayText}
                    </td>

                    <td className="px-5 py-3 font-mono text-cyan-300 max-w-sm truncate break-all">
                      {item.url}
                    </td>

                    <td className="px-5 py-3 font-mono">
                      <span className="bg-slate-950 px-2 py-0.5 rounded border border-slate-800">
                        {item.domain}
                      </span>
                    </td>

                    <td className="px-5 py-3">
                      <span
                        className={`px-2 py-0.5 rounded uppercase font-semibold text-[10px] ${
                          item.protocol === 'https'
                            ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/30'
                            : 'bg-rose-500/10 text-rose-400 border border-rose-500/30'
                        }`}
                      >
                        {item.protocol}
                      </span>
                    </td>

                    <td className="px-5 py-3">
                      {item.flags.length === 0 ? (
                        <span className="text-emerald-400 text-xs flex items-center gap-1">
                          <CheckCircle2 className="w-3.5 h-3.5" />
                          Passed checks
                        </span>
                      ) : (
                        <div className="flex flex-wrap gap-1">
                          {item.flags.map((flag, fIdx) => (
                            <span
                              key={fIdx}
                              className="text-[10px] bg-rose-500/15 text-rose-300 border border-rose-500/30 px-2 py-0.5 rounded"
                            >
                              {flag}
                            </span>
                          ))}
                        </div>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};
