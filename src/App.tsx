import React, { useState, useEffect } from 'react';
import { AnalysisResult, AppSettings } from './types';
import { DEFAULT_BAD_DOMAINS, DEFAULT_BAD_URLS, analyzeEmail } from './engine/analyzer';
import { SAMPLE_EMAILS } from './data/sampleEmails';
import { Navbar } from './components/Navbar';
import { AnalyzerTab } from './components/AnalyzerTab';
import { DashboardTab } from './components/DashboardTab';
import { SettingsTab } from './components/SettingsTab';
import { AboutTab } from './components/AboutTab';
import { PresentationDeck } from './components/PresentationDeck';
import { AiExplainModal } from './components/AiExplainModal';
import { PrintableReport } from './components/PrintableReport';
import { Shield } from 'lucide-react';

const STORAGE_KEY_SETTINGS = 'phishguard_settings_v1';
const STORAGE_KEY_HISTORY = 'phishguard_history_v1';

export default function App() {
  const [activeTab, setActiveTab] = useState<'analyzer' | 'dashboard' | 'settings' | 'about' | 'pitch'>('analyzer');

  // App Settings
  const [settings, setSettings] = useState<AppSettings>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY_SETTINGS);
      if (saved) return JSON.parse(saved);
    } catch (e) {
      console.warn('Failed to read settings from localStorage:', e);
    }
    return {
      trustedDomain: 'college.edu',
      badDomains: DEFAULT_BAD_DOMAINS,
      badUrls: DEFAULT_BAD_URLS,
    };
  });

  // Analysis History
  const [history, setHistory] = useState<AnalysisResult[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY_HISTORY);
      if (saved) return JSON.parse(saved);
    } catch (e) {
      console.warn('Failed to read history from localStorage:', e);
    }
    return [];
  });

  // Active Result in Analyzer
  const [activeResult, setActiveResult] = useState<AnalysisResult | null>(null);

  // Gemini AI Status & Modal State
  const [aiAvailable, setAiAvailable] = useState<boolean>(false);
  const [aiModalOpen, setAiModalOpen] = useState<boolean>(false);
  const [aiExplanation, setAiExplanation] = useState<string>('');
  const [aiLoading, setAiLoading] = useState<boolean>(false);
  const [aiError, setAiError] = useState<string | null>(null);

  // Check backend AI availability on mount
  useEffect(() => {
    fetch('/api/ai/status')
      .then((res) => res.json())
      .then((data) => {
        if (data && data.available) {
          setAiAvailable(true);
        }
      })
      .catch((err) => {
        console.log('AI status endpoint unavailable:', err);
      });
  }, []);

  // Save settings when modified
  const handleSaveSettings = (newSettings: AppSettings) => {
    setSettings(newSettings);
    try {
      localStorage.setItem(STORAGE_KEY_SETTINGS, JSON.stringify(newSettings));
    } catch (e) {
      console.warn('Failed to persist settings:', e);
    }
  };

  // Save history helper
  const saveHistoryToStorage = (updatedHistory: AnalysisResult[]) => {
    setHistory(updatedHistory);
    try {
      localStorage.setItem(STORAGE_KEY_HISTORY, JSON.stringify(updatedHistory));
    } catch (e) {
      console.warn('Failed to persist history:', e);
    }
  };

  // On initial mount: if history is empty, analyze the 6 sample emails so the user immediately has rich dashboard analytics!
  useEffect(() => {
    if (history.length === 0) {
      const seedResults = SAMPLE_EMAILS.map((sample) => analyzeEmail(sample.rawEmail, settings));
      saveHistoryToStorage(seedResults);
      // Select the first phishing sample by default in analyzer
      setActiveResult(seedResults[3] || seedResults[0]);
    } else if (!activeResult) {
      setActiveResult(history[0]);
    }
  }, []);

  // Handle new analysis complete
  const handleAnalysisComplete = (result: AnalysisResult) => {
    setActiveResult(result);
    // Add to history (deduplicate by subject + timestamp or keep recent 50)
    const updated = [result, ...history.filter((h) => h.id !== result.id)].slice(0, 50);
    saveHistoryToStorage(updated);
  };

  const handleClearHistory = () => {
    saveHistoryToStorage([]);
  };

  // Reopen result from dashboard
  const handleSelectFromHistory = (result: AnalysisResult) => {
    setActiveResult(result);
    setActiveTab('analyzer');
  };

  // Request AI Explanation
  const handleRequestAiExplain = async (result: AnalysisResult) => {
    setAiModalOpen(true);
    setAiLoading(true);
    setAiError(null);

    // If already generated on this result
    if (result.aiExplanation) {
      setAiExplanation(result.aiExplanation);
      setAiLoading(false);
      return;
    }

    try {
      const res = await fetch('/api/ai/explain', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          subject: result.metadata.subject,
          sender: `${result.metadata.fromName} <${result.metadata.fromAddress}>`,
          score: result.score,
          verdict: result.verdict,
          findings: result.findings.map((f) => ({
            name: f.name,
            severity: f.severity,
            points: f.points,
            explanation: f.explanation,
            evidence: f.evidence,
          })),
          emailExcerpt: result.metadata.bodyText || result.metadata.raw,
        }),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || 'Failed to generate explanation from AI.');
      }

      setAiExplanation(data.explanation);
      result.aiExplanation = data.explanation;
      // Update in history
      const updated = history.map((h) => (h.id === result.id ? { ...h, aiExplanation: data.explanation } : h));
      saveHistoryToStorage(updated);
    } catch (err: any) {
      console.error('AI Explanation error:', err);
      setAiError(err.message || 'Error communicating with AI service.');
    } finally {
      setAiLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans selection:bg-cyan-500/30 selection:text-white">
      {/* Navigation Header */}
      <Navbar
        activeTab={activeTab}
        onTabChange={setActiveTab}
        historyCount={history.length}
      />

      {/* Main Container */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
        {activeTab === 'analyzer' && (
          <AnalyzerTab
            settings={settings}
            onAnalysisComplete={handleAnalysisComplete}
            activeResult={activeResult}
            onSelectResult={setActiveResult}
            aiAvailable={aiAvailable}
            onExplainAi={handleRequestAiExplain}
          />
        )}

        {activeTab === 'dashboard' && (
          <DashboardTab
            history={history}
            onSelectResult={handleSelectFromHistory}
            onClearHistory={handleClearHistory}
          />
        )}

        {activeTab === 'settings' && (
          <SettingsTab
            settings={settings}
            onSaveSettings={handleSaveSettings}
          />
        )}

        {activeTab === 'about' && <AboutTab />}

        {activeTab === 'pitch' && <PresentationDeck />}
      </main>

      {/* AI Explanation Modal */}
      {activeResult && (
        <AiExplainModal
          result={activeResult}
          isOpen={aiModalOpen}
          onClose={() => setAiModalOpen(false)}
          aiExplanation={aiExplanation}
          isLoading={aiLoading}
          error={aiError}
          onRegenerate={() => handleRequestAiExplain(activeResult)}
        />
      )}

      {/* Printable Report Component for window.print */}
      {activeResult && <PrintableReport result={activeResult} />}

      {/* Footer */}
      <footer className="border-t border-slate-900 bg-slate-950 py-6 text-xs text-slate-500 text-center print:hidden">
        <div className="max-w-7xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-2">
          <div className="flex items-center gap-1.5">
            <Shield className="w-4 h-4 text-cyan-500" />
            <span className="font-semibold text-slate-400">PhishGuard v2.4</span>
            <span>&middot;</span>
            <span>College Cybersecurity Hackathon Edition</span>
          </div>
          <div>
            100% Client-Side In-Memory Rule-Based Heuristics &middot; Zero-Click Sandbox
          </div>
        </div>
      </footer>
    </div>
  );
}
