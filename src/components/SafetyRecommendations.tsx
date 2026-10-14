import React from 'react';
import { AnalysisResult } from '../types';
import {
  ShieldAlert,
  AlertTriangle,
  CheckCircle2,
  PhoneCall,
  KeyRound,
  Send,
  Ban,
  FileCheck,
} from 'lucide-react';

interface Props {
  result: AnalysisResult;
}

export const SafetyRecommendations: React.FC<Props> = ({ result }) => {
  const isPhishing = result.verdict === 'Phishing';
  const isSuspicious = result.verdict === 'Suspicious';

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-xl p-6 shadow-xl space-y-5">
      <div className="flex items-center justify-between border-b border-slate-800 pb-3">
        <div className="flex items-center gap-2">
          {isPhishing ? (
            <ShieldAlert className="w-5 h-5 text-rose-400" />
          ) : isSuspicious ? (
            <AlertTriangle className="w-5 h-5 text-amber-400" />
          ) : (
            <CheckCircle2 className="w-5 h-5 text-emerald-400" />
          )}
          <h3 className="font-bold text-slate-100 text-base">
            Recommended Next Actions for Students
          </h3>
        </div>
        <span
          className={`text-xs px-2.5 py-0.5 rounded-full font-semibold uppercase tracking-wider ${
            isPhishing
              ? 'bg-rose-500/20 text-rose-300 border border-rose-500/30'
              : isSuspicious
              ? 'bg-amber-500/20 text-amber-300 border border-amber-500/30'
              : 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
          }`}
        >
          {isPhishing ? 'Immediate Action Needed' : isSuspicious ? 'Exercise Caution' : 'Safe to Proceed'}
        </span>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 text-xs">
        {/* Step 1: Click & Interaction Policy */}
        <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 flex flex-col justify-between">
          <div className="space-y-2">
            <div className="flex items-center gap-2 text-slate-200 font-semibold">
              <Ban className={`w-4 h-4 ${isPhishing || isSuspicious ? 'text-rose-400' : 'text-emerald-400'}`} />
              <span>1. Do Not Click or Reply</span>
            </div>
            <p className="text-slate-400 leading-relaxed">
              {isPhishing || isSuspicious
                ? 'Never click any links, open attachments, or reply to this sender. Replying confirms your email is active to the attacker.'
                : 'The email links are authentic, but always verify unfamiliar attachments prior to downloading.'}
            </p>
          </div>
          <div className="mt-3 pt-2 border-t border-slate-800/80 text-[11px] text-cyan-400 font-medium">
            Rule of thumb: Type university URLs manually into your browser.
          </div>
        </div>

        {/* Step 2: Out of Band Verification */}
        <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 flex flex-col justify-between">
          <div className="space-y-2">
            <div className="flex items-center gap-2 text-slate-200 font-semibold">
              <PhoneCall className="w-4 h-4 text-cyan-400" />
              <span>2. Verify Out-of-Band</span>
            </div>
            <p className="text-slate-400 leading-relaxed">
              If the email claims to be a dean, professor, or supervisor asking for money or urgent tasks, contact them via the official college directory phone number—never call any number inside the email.
            </p>
          </div>
          <div className="mt-3 pt-2 border-t border-slate-800/80 text-[11px] text-cyan-400 font-medium">
            Use the campus website staff directory or in-person office hours.
          </div>
        </div>

        {/* Step 3: Reporting to Campus IT */}
        <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 flex flex-col justify-between">
          <div className="space-y-2">
            <div className="flex items-center gap-2 text-slate-200 font-semibold">
              <Send className="w-4 h-4 text-indigo-400" />
              <span>3. Report to Campus IT Security</span>
            </div>
            <p className="text-slate-400 leading-relaxed">
              Forward this message as an attachment (.eml) to the campus security operations center at <code className="text-cyan-300">security@college.edu</code> or click the "Report Phishing" button in your webmail.
            </p>
          </div>
          <div className="mt-3 pt-2 border-t border-slate-800/80 text-[11px] text-indigo-300 font-medium">
            Reporting blocks malicious domains for all students on campus Wi-Fi.
          </div>
        </div>

        {/* Step 4: If Already Clicked */}
        <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 flex flex-col justify-between md:col-span-2 lg:col-span-3">
          <div className="space-y-2">
            <div className="flex items-center gap-2 text-slate-200 font-semibold">
              <KeyRound className="w-4 h-4 text-amber-400" />
              <span>Incident Response: What if you already clicked or entered credentials?</span>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-1 text-slate-300">
              <div className="bg-slate-900/80 p-2.5 rounded-lg border border-slate-800">
                <span className="font-semibold text-white block mb-0.5">A. Reset Password Now</span>
                Go immediately to the official campus identity portal and change your university SSO password.
              </div>
              <div className="bg-slate-900/80 p-2.5 rounded-lg border border-slate-800">
                <span className="font-semibold text-white block mb-0.5">B. Terminate Active Sessions</span>
                Log into Microsoft 365 / Google Workspace security settings and choose "Sign out of all devices".
              </div>
              <div className="bg-slate-900/80 p-2.5 rounded-lg border border-slate-800">
                <span className="font-semibold text-white block mb-0.5">C. Contact Helpdesk Directly</span>
                Call the campus 24/7 IT Helpdesk to monitor your account for unauthorized MFA device enrollments.
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
