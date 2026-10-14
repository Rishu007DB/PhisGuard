import React, { useState } from 'react';
import { AppSettings } from '../types';
import { DEFAULT_BAD_DOMAINS, DEFAULT_BAD_URLS } from '../engine/analyzer';
import { Settings, ShieldCheck, Database, Save, RotateCcw, AlertCircle, Check } from 'lucide-react';

interface Props {
  settings: AppSettings;
  onSaveSettings: (settings: AppSettings) => void;
}

export const SettingsTab: React.FC<Props> = ({ settings, onSaveSettings }) => {
  const [trustedDomain, setTrustedDomain] = useState(settings.trustedDomain);
  const [badDomainsText, setBadDomainsText] = useState((settings.badDomains || []).join('\n'));
  const [badUrlsText, setBadUrlsText] = useState((settings.badUrls || []).join('\n'));
  const [savedMessage, setSavedMessage] = useState(false);

  const handleSave = () => {
    const updated: AppSettings = {
      trustedDomain: trustedDomain.trim() || 'college.edu',
      badDomains: badDomainsText
        .split('\n')
        .map((line) => line.trim())
        .filter(Boolean),
      badUrls: badUrlsText
        .split('\n')
        .map((line) => line.trim())
        .filter(Boolean),
    };
    onSaveSettings(updated);
    setSavedMessage(true);
    setTimeout(() => setSavedMessage(false), 2500);
  };

  const handleReset = () => {
    setTrustedDomain('college.edu');
    setBadDomainsText(DEFAULT_BAD_DOMAINS.join('\n'));
    setBadUrlsText(DEFAULT_BAD_URLS.join('\n'));
    const def: AppSettings = {
      trustedDomain: 'college.edu',
      badDomains: DEFAULT_BAD_DOMAINS,
      badUrls: DEFAULT_BAD_URLS,
    };
    onSaveSettings(def);
    setSavedMessage(true);
    setTimeout(() => setSavedMessage(false), 2500);
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Header */}
      <div className="bg-slate-900 border border-slate-800 p-6 rounded-2xl shadow-lg">
        <div className="flex items-center gap-3">
          <div className="p-2.5 bg-cyan-500/10 rounded-xl border border-cyan-500/30">
            <Settings className="w-5 h-5 text-cyan-400" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-white tracking-tight">
              Analyzer Configuration &amp; Threat Intelligence
            </h2>
            <p className="text-xs text-slate-400 mt-0.5">
              Customize institutional trusted domain and provide custom threat intelligence IOCs (Indicators of Compromise).
            </p>
          </div>
        </div>
      </div>

      {/* Main Settings Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Trusted Domain Card */}
        <div className="bg-slate-900 border border-slate-800 p-6 rounded-xl shadow-lg space-y-4">
          <div className="flex items-center gap-2 text-slate-200 font-semibold text-sm">
            <ShieldCheck className="w-4 h-4 text-emerald-400" />
            <span>Configurable Campus Trusted Domain</span>
          </div>

          <p className="text-xs text-slate-400 leading-relaxed">
            The base academic domain used to detect spoofing, typosquatting (e.g.{' '}
            <code className="text-rose-300">co11ege.edu</code> or{' '}
            <code className="text-rose-300">college-edu.com</code>), and display name imposter attacks.
          </p>

          <div>
            <label className="block text-xs font-medium text-slate-300 mb-1.5 uppercase tracking-wider">
              Primary Trusted Domain
            </label>
            <input
              type="text"
              value={trustedDomain}
              onChange={(e) => setTrustedDomain(e.target.value)}
              placeholder="e.g. college.edu or university.edu"
              className="w-full bg-slate-950 border border-slate-700/80 rounded-xl px-4 py-2.5 text-sm font-mono text-cyan-300 focus:outline-none focus:border-cyan-500 transition-colors"
            />
            <span className="text-[11px] text-slate-500 mt-1 block">
              Default is <code className="text-slate-400">college.edu</code>
            </span>
          </div>
        </div>

        {/* Reputation Threat Intel: Domains */}
        <div className="bg-slate-900 border border-slate-800 p-6 rounded-xl shadow-lg space-y-4">
          <div className="flex items-center gap-2 text-slate-200 font-semibold text-sm">
            <Database className="w-4 h-4 text-cyan-400" />
            <span>Known Malicious Domains Blacklist</span>
          </div>

          <p className="text-xs text-slate-400 leading-relaxed">
            Paste known-bad domains (one per line). Any email originating from or linking to these domains will be instantly flagged with a Critical threat penalty (+40 pts).
          </p>

          <div>
            <label className="block text-xs font-medium text-slate-300 mb-1.5 uppercase tracking-wider">
              Bad Domains (One per line)
            </label>
            <textarea
              rows={4}
              value={badDomainsText}
              onChange={(e) => setBadDomainsText(e.target.value)}
              placeholder="evil-domain.com&#10;co11ege.edu&#10;account-auth.xyz"
              className="w-full bg-slate-950 border border-slate-700/80 rounded-xl p-3 text-xs font-mono text-rose-300 focus:outline-none focus:border-cyan-500 transition-colors resize-y"
            />
          </div>
        </div>

        {/* Reputation Threat Intel: Specific URLs */}
        <div className="bg-slate-900 border border-slate-800 p-6 rounded-xl shadow-lg space-y-4 md:col-span-2">
          <div className="flex items-center gap-2 text-slate-200 font-semibold text-sm">
            <Database className="w-4 h-4 text-rose-400" />
            <span>Known Malicious URLs &amp; Phishing Landing Pages</span>
          </div>

          <p className="text-xs text-slate-400 leading-relaxed">
            Paste exact phishing URLs, bit.ly shortlinks, or known credential harvesting endpoints (one per line).
          </p>

          <div>
            <label className="block text-xs font-medium text-slate-300 mb-1.5 uppercase tracking-wider">
              Bad URLs (One per line)
            </label>
            <textarea
              rows={3}
              value={badUrlsText}
              onChange={(e) => setBadUrlsText(e.target.value)}
              placeholder="http://login-verify-college.account-auth.xyz&#10;bit.ly/claim-grant-2026"
              className="w-full bg-slate-950 border border-slate-700/80 rounded-xl p-3 text-xs font-mono text-rose-300 focus:outline-none focus:border-cyan-500 transition-colors resize-y"
            />
          </div>
        </div>
      </div>

      {/* Action Footer */}
      <div className="flex items-center justify-between bg-slate-900 border border-slate-800 p-4 rounded-xl shadow">
        <button
          onClick={handleReset}
          className="flex items-center gap-2 px-4 py-2 text-xs font-medium text-slate-300 bg-slate-800 hover:bg-slate-700 rounded-lg border border-slate-700 transition-colors cursor-pointer"
        >
          <RotateCcw className="w-3.5 h-3.5" />
          <span>Reset Defaults</span>
        </button>

        <div className="flex items-center gap-3">
          {savedMessage && (
            <span className="flex items-center gap-1.5 text-xs text-emerald-400 font-semibold bg-emerald-500/10 px-3 py-1.5 rounded-lg border border-emerald-500/30 animate-fade-in">
              <Check className="w-3.5 h-3.5" />
              Settings Saved!
            </span>
          )}

          <button
            onClick={handleSave}
            className="flex items-center gap-2 px-5 py-2 text-xs font-bold text-white bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 rounded-lg shadow-lg shadow-cyan-500/25 transition-all cursor-pointer"
          >
            <Save className="w-3.5 h-3.5" />
            <span>Save Threat Intel</span>
          </button>
        </div>
      </div>
    </div>
  );
};
