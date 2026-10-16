'use client';

import React, { useState } from 'react';
import { Volume2, VolumeX, ArrowLeft, FileText, AlertOctagon, ShieldAlert, KeyRound, CheckCircle2, ShieldBan } from 'lucide-react';
import { AnalysisResult, Language } from '../types';
import { translations } from '../lib/translations';
import { RiskMeter } from './RiskMeter';
import { CallbackChecklist } from './CallbackChecklist';

interface ResultViewProps {
  result: AnalysisResult;
  lang: Language;
  onBackToScan: () => void;
  onOpenReport: () => void;
  onOpenVault: () => void;
}

export const ResultView: React.FC<ResultViewProps> = ({
  result,
  lang,
  onBackToScan,
  onOpenReport,
  onOpenVault,
}) => {
  const t = translations[lang];
  const [isSpeaking, setIsSpeaking] = useState<boolean>(false);

  // Browser SpeechSynthesis for seniors
  const handleReadAloud = () => {
    if (!('speechSynthesis' in window)) return;
    if (isSpeaking) {
      window.speechSynthesis.cancel();
      setIsSpeaking(false);
      return;
    }

    let text = '';
    if (result.risk.risk_level === 'HIGH') {
      text = 'Warning! Emergency scam alert. Do not send any money. Hang up immediately, and call your family member back on your saved phone number.';
    } else if (result.risk.risk_level === 'MEDIUM') {
      text = 'Caution. Suspicious pressure detected. Verify with your family safe word before transferring funds.';
    } else {
      text = 'Message appears low risk. No emergency extortion patterns detected.';
    }

    const u = new SpeechSynthesisUtterance(text);
    u.rate = 0.9;
    u.onend = () => setIsSpeaking(false);
    u.onerror = () => setIsSpeaking(false);
    setIsSpeaking(true);
    window.speechSynthesis.speak(u);
  };

  const ext = result.extracted || {};

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Top Header Buttons */}
      <div className="flex flex-wrap items-center justify-between gap-3">
        <button
          onClick={onBackToScan}
          className="flex items-center space-x-2 text-xs font-semibold text-slate-400 hover:text-white bg-slate-800/80 hover:bg-slate-800 px-3 py-2 rounded-lg border border-slate-700"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Scan Another Message / Call</span>
        </button>

        <div className="flex items-center space-x-2">
          <button
            onClick={handleReadAloud}
            className={`flex items-center space-x-1.5 text-xs font-bold px-3 py-2 rounded-lg border transition-all ${
              isSpeaking
                ? 'bg-rose-600 text-white border-rose-500 animate-pulse'
                : 'bg-indigo-600/20 text-indigo-300 border-indigo-500/40 hover:bg-indigo-600 hover:text-white'
            }`}
          >
            {isSpeaking ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
            <span>{isSpeaking ? 'Stop Audio' : 'Read Aloud (For Seniors)'}</span>
          </button>

          <button
            onClick={onOpenReport}
            className="flex items-center space-x-1.5 text-xs font-bold bg-blue-600 hover:bg-blue-500 text-white px-3 py-2 rounded-lg shadow-md"
          >
            <FileText className="w-4 h-4" />
            <span>Generate 1930 Dossier</span>
          </button>
        </div>
      </div>

      {/* Speedometer Risk Meter */}
      <RiskMeter
        risk={result.risk}
        voiceProvider={result.voice.provider}
        scamEngine={result.scam.engine}
      />

      {/* SECTION 3: STRUCTURED DATA EXTRACTION TABLE (v2 Feature) */}
      <div className="bg-slate-900/90 rounded-2xl border border-slate-800 p-6 shadow-xl space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-bold text-white flex items-center space-x-2">
            <CheckCircle2 className="w-4 h-4 text-cyan-400" />
            <span>{t.extractedDataTitle}</span>
          </h3>
          <span className="text-[10px] text-slate-500 font-mono">Factual extraction • No invented data</span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
          <div className="bg-slate-950/80 p-3 rounded-xl border border-slate-800 flex justify-between">
            <span className="text-slate-400">Caller claims to be:</span>
            <span className="font-semibold text-white">{ext.caller_claims_to_be || 'None identified'}</span>
          </div>

          <div className="bg-slate-950/80 p-3 rounded-xl border border-slate-800 flex justify-between">
            <span className="text-slate-400">Situation:</span>
            <span className="font-semibold text-white">{ext.situation || 'Routine / None'}</span>
          </div>

          <div className="bg-slate-950/80 p-3 rounded-xl border border-slate-800 flex justify-between">
            <span className="text-slate-400">Money demanded:</span>
            <span className={`font-semibold ${ext.money_demanded ? 'text-rose-400 font-mono' : 'text-slate-400'}`}>
              {ext.money_demanded || 'None'}
            </span>
          </div>

          <div className="bg-slate-950/80 p-3 rounded-xl border border-slate-800 flex justify-between">
            <span className="text-slate-400">Payment method:</span>
            <span className="font-semibold text-white">{ext.payment_method || 'None'}</span>
          </div>

          <div className="bg-slate-950/80 p-3 rounded-xl border border-slate-800 flex justify-between">
            <span className="text-slate-400">UPI ID:</span>
            <span className={`font-semibold font-mono ${ext.upi_id ? 'text-amber-300' : 'text-slate-400'}`}>
              {ext.upi_id || 'None'}
            </span>
          </div>

          <div className="bg-slate-950/80 p-3 rounded-xl border border-slate-800 flex justify-between">
            <span className="text-slate-400">Phone number:</span>
            <span className="font-semibold font-mono text-white">{ext.phone_number || 'None'}</span>
          </div>

          <div className="bg-slate-950/80 p-3 rounded-xl border border-slate-800 flex justify-between">
            <span className="text-slate-400">Deadline / Pressure:</span>
            <span className={`font-semibold ${ext.deadline_pressure ? 'text-rose-400' : 'text-slate-400'}`}>
              {ext.deadline_pressure || 'None'}
            </span>
          </div>

          <div className="bg-slate-950/80 p-3 rounded-xl border border-slate-800 flex justify-between">
            <span className="text-slate-400">Secrecy / Coercion:</span>
            <span className={`font-semibold ${ext.secrecy_coercion ? 'text-amber-400' : 'text-slate-400'}`}>
              {ext.secrecy_coercion || 'None'}
            </span>
          </div>
        </div>

        {/* Warning if UPI or Links Present */}
        {(ext.upi_id || (ext.links && ext.links.length > 0)) && (
          <div className="p-3 bg-rose-500/10 border border-rose-500/30 rounded-xl space-y-1 text-xs text-rose-300">
            <div className="flex items-center space-x-1.5 font-bold">
              <ShieldBan className="w-4 h-4" />
              <span>Safer Scam Checklist Warning:</span>
            </div>
            {ext.upi_id && <p>• DO NOT send money to UPI ID: <strong>{ext.upi_id}</strong>.</p>}
            {ext.links && ext.links.length > 0 && <p>• DO NOT click untrusted links: <strong>{ext.links.join(', ')}</strong>.</p>}
          </div>
        )}
      </div>

      {/* Plain Language Reasons & Tactics */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="bg-slate-900/90 rounded-2xl border border-slate-800 p-6 shadow-xl space-y-3">
          <h3 className="text-sm font-bold text-white flex items-center space-x-2">
            <AlertOctagon className="w-4 h-4 text-amber-400" />
            <span>Forensic Reasoning</span>
          </h3>
          <ul className="space-y-2">
            {result.scam.reasons.map((r, i) => (
              <li key={i} className="text-xs text-slate-300 flex items-start space-x-2">
                <span className="text-amber-400 font-bold">•</span>
                <span>{r}</span>
              </li>
            ))}
          </ul>
        </div>

        <div className="bg-slate-900/90 rounded-2xl border border-slate-800 p-6 shadow-xl space-y-3">
          <h3 className="text-sm font-bold text-white flex items-center space-x-2">
            <ShieldAlert className="w-4 h-4 text-rose-400" />
            <span>Identified Coercion Tactics</span>
          </h3>
          {result.scam.tactics.length > 0 ? (
            <div className="flex flex-wrap gap-2 pt-1">
              {result.scam.tactics.map((tac, i) => (
                <span
                  key={i}
                  className="bg-rose-950/60 text-rose-300 border border-rose-800/80 text-[11px] font-semibold px-2 py-0.5 rounded-lg uppercase"
                >
                  ⚠️ {tac}
                </span>
              ))}
            </div>
          ) : (
            <p className="text-xs text-slate-400">No predatory tactics identified in this message.</p>
          )}
        </div>
      </div>

      {/* Transcript Text */}
      <div className="bg-slate-900/90 rounded-2xl border border-slate-800 p-6 shadow-xl space-y-2">
        <h3 className="text-sm font-bold text-white flex items-center space-x-2">
          <FileText className="w-4 h-4 text-blue-400" />
          <span>Analyzed Message / Transcript</span>
        </h3>
        <p className="p-4 bg-slate-950 rounded-xl border border-slate-800 text-xs sm:text-sm text-slate-300 font-mono leading-relaxed whitespace-pre-wrap">
          {result.transcript}
        </p>
      </div>

      {/* Action Checklist */}
      <CallbackChecklist
        lang={lang}
        riskLevel={result.risk.risk_level}
        onOpenReport={onOpenReport}
        onOpenVault={onOpenVault}
      />
    </div>
  );
};
