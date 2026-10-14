import React, { useState, useRef } from 'react';
import { AnalysisResult, AppSettings, EmailSample } from '../types';
import { SAMPLE_EMAILS } from '../data/sampleEmails';
import { analyzeEmail } from '../engine/analyzer';
import { VerdictGauge } from './VerdictGauge';
import { EvidenceList } from './EvidenceList';
import { EmailHighlighter } from './EmailHighlighter';
import { ExtractedDetails } from './ExtractedDetails';
import { SafetyRecommendations } from './SafetyRecommendations';
import {
  Upload,
  Sparkles,
  Play,
  RotateCcw,
  FileText,
  CheckCircle2,
  AlertTriangle,
  ShieldAlert,
  ArrowRight,
  Info,
} from 'lucide-react';

interface Props {
  settings: AppSettings;
  onAnalysisComplete: (result: AnalysisResult) => void;
  activeResult: AnalysisResult | null;
  onSelectResult: (result: AnalysisResult | null) => void;
  aiAvailable: boolean;
  onExplainAi: (result: AnalysisResult) => void;
}

export const AnalyzerTab: React.FC<Props> = ({
  settings,
  onAnalysisComplete,
  activeResult,
  onSelectResult,
  aiAvailable,
  onExplainAi,
}) => {
  const [rawInput, setRawInput] = useState<string>(SAMPLE_EMAILS[3].rawEmail); // default to a phishing sample for instant inspection
  const [selectedSampleId, setSelectedSampleId] = useState<string>('sample-phish-1');
  const [fileName, setFileName] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Trigger analysis
  const handleAnalyze = () => {
    if (!rawInput.trim()) return;
    const result = analyzeEmail(rawInput, settings);
    onAnalysisComplete(result);
  };

  // Sample selection
  const handleSampleSelect = (sampleId: string) => {
    setSelectedSampleId(sampleId);
    setFileName(null);
    const sample = SAMPLE_EMAILS.find((s) => s.id === sampleId);
    if (sample) {
      setRawInput(sample.rawEmail);
      const result = analyzeEmail(sample.rawEmail, settings);
      onAnalysisComplete(result);
    }
  };

  // .eml File upload
  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setFileName(file.name);
    setSelectedSampleId('');

    const reader = new FileReader();
    reader.onload = (event) => {
      const content = event.target?.result as string;
      if (content) {
        setRawInput(content);
        const result = analyzeEmail(content, settings);
        onAnalysisComplete(result);
      }
    };
    reader.readAsText(file);
  };

  const handleClear = () => {
    setRawInput('');
    setFileName(null);
    setSelectedSampleId('');
    onSelectResult(null);
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="space-y-8">
      {/* Input Section Card */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl relative">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 pb-5 border-b border-slate-800">
          <div>
            <h2 className="text-xl font-bold text-white tracking-tight flex items-center gap-2">
              <FileText className="w-5 h-5 text-cyan-400" />
              <span>Email Ingestion &amp; Raw Header Inspector</span>
            </h2>
            <p className="text-xs text-slate-400 mt-0.5">
              Paste full email text with RFC 2822 headers or upload a standard <code>.eml</code> file to run heuristics.
            </p>
          </div>

          {/* Controls: Samples & Upload */}
          <div className="flex flex-wrap items-center gap-3">
            {/* Sample Selector Dropdown */}
            <div className="flex items-center gap-2 bg-slate-950 px-3 py-1.5 rounded-xl border border-slate-800">
              <span className="text-xs text-slate-400 font-medium whitespace-nowrap">
                Load Sample:
              </span>
              <select
                value={selectedSampleId}
                onChange={(e) => handleSampleSelect(e.target.value)}
                className="bg-transparent text-xs text-cyan-300 font-semibold focus:outline-none cursor-pointer pr-2"
              >
                <optgroup label="Legitimate College Notices (Should score Safe)">
                  {SAMPLE_EMAILS.filter((s) => s.category === 'legitimate').map((s) => (
                    <option key={s.id} value={s.id} className="bg-slate-900 text-slate-200">
                      🛡️ {s.title}
                    </option>
                  ))}
                </optgroup>
                <optgroup label="Phishing Attack Samples (Should score Phishing)">
                  {SAMPLE_EMAILS.filter((s) => s.category === 'phishing').map((s) => (
                    <option key={s.id} value={s.id} className="bg-slate-900 text-slate-200">
                      ⚠️ {s.title}
                    </option>
                  ))}
                </optgroup>
              </select>
            </div>

            {/* File Upload Button */}
            <div>
              <input
                ref={fileInputRef}
                type="file"
                accept=".eml,.txt,.msg"
                onChange={handleFileUpload}
                className="hidden"
              />
              <button
                onClick={() => fileInputRef.current?.click()}
                className="flex items-center gap-1.5 px-3.5 py-2 text-xs font-medium text-slate-200 bg-slate-800 hover:bg-slate-700 rounded-xl border border-slate-700 transition-colors cursor-pointer"
                title="Upload .eml message file"
              >
                <Upload className="w-3.5 h-3.5 text-cyan-400" />
                <span>{fileName ? fileName : 'Upload .eml File'}</span>
              </button>
            </div>

            {/* Clear Button */}
            {rawInput && (
              <button
                onClick={handleClear}
                className="p-2 text-xs text-slate-400 hover:text-slate-200 hover:bg-slate-800 rounded-xl border border-transparent hover:border-slate-700 transition-all cursor-pointer"
                title="Clear input"
              >
                <RotateCcw className="w-4 h-4" />
              </button>
            )}
          </div>
        </div>

        {/* Text Area */}
        <div className="mt-4 relative">
          <textarea
            value={rawInput}
            onChange={(e) => setRawInput(e.target.value)}
            placeholder="Paste raw email message here (including Delivered-To, From, Subject, Authentication-Results, and body)..."
            rows={9}
            className="w-full bg-slate-950 border border-slate-800 rounded-xl p-4 font-mono text-xs text-slate-200 leading-relaxed focus:outline-none focus:border-cyan-500/80 transition-colors resize-y selection:bg-cyan-500/30"
          />

          <div className="flex flex-wrap items-center justify-between mt-3 text-xs text-slate-400 gap-2">
            <div className="flex items-center gap-3">
              <span>{rawInput.length.toLocaleString()} characters</span>
              <span>&middot;</span>
              <span>{rawInput.split('\n').length} lines</span>
              {fileName && (
                <>
                  <span>&middot;</span>
                  <span className="text-cyan-400 font-mono">Loaded: {fileName}</span>
                </>
              )}
            </div>

            <button
              onClick={handleAnalyze}
              disabled={!rawInput.trim()}
              className="flex items-center gap-2 px-6 py-2.5 rounded-xl font-bold text-xs uppercase tracking-wider text-white bg-gradient-to-r from-cyan-500 via-blue-600 to-indigo-600 hover:from-cyan-400 hover:to-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg shadow-cyan-500/25 transition-all cursor-pointer"
            >
              <Play className="w-4 h-4 fill-white" />
              <span>Analyze Email</span>
            </button>
          </div>
        </div>
      </div>

      {/* Analysis Results View */}
      {activeResult && (
        <div className="space-y-8 animate-fade-in">
          {/* 1. Verdict Gauge Banner */}
          <VerdictGauge
            result={activeResult}
            onExplainAi={() => onExplainAi(activeResult)}
            aiAvailable={aiAvailable}
            onPrintReport={handlePrint}
          />

          {/* 2. Ranked Evidence List */}
          <EvidenceList findings={activeResult.findings} />

          {/* 3. Interactive Email Forensic Highlighter */}
          <EmailHighlighter result={activeResult} />

          {/* 4. Extracted Technical Details (Sender, Auth Chips, URL Table) */}
          <ExtractedDetails metadata={activeResult.metadata} />

          {/* 5. Recommended Actions Checklist */}
          <SafetyRecommendations result={activeResult} />
        </div>
      )}
    </div>
  );
};
