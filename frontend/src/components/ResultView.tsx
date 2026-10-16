'use client';

import React, { useState } from 'react';
import { Volume2, VolumeX, ShieldAlert, ArrowLeft, FileText, CheckCircle, AlertOctagon, HelpCircle, Key, Play, Pause } from 'lucide-react';
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
  const [isPlayingAudio, setIsPlayingAudio] = useState<boolean>(false);

  // Browser SpeechSynthesis for Elderly Users (Page 3 of guide)
  const handleReadAloud = () => {
    if (!('speechSynthesis' in window)) {
      alert('Text-to-speech is not supported on this browser.');
      return;
    }

    if (isSpeaking) {
      window.speechSynthesis.cancel();
      setIsSpeaking(false);
      return;
    }

    let speechText = '';
    if (result.risk.risk_level === 'HIGH') {
      speechText =
        'Warning! High risk emergency scam alert! Do not send money. This call has a high probability of being an artificial voice clone. Hang up immediately, and call your family member back on their normal saved phone number.';
    } else if (result.risk.risk_level === 'MEDIUM') {
      speechText =
        'Caution. Suspicious high pressure call detected. Please verify before transferring any funds. Hang up and call your relative directly.';
    } else {
      speechText =
        'This call appears low risk with natural voice patterns. Standard vigilance is recommended.';
    }

    const utterance = new SpeechSynthesisUtterance(speechText);
    utterance.rate = 0.9; // Slightly slower for senior accessibility
    utterance.pitch = 1.0;
    
    // Attempt language matching
    if (lang === 'hi') utterance.lang = 'hi-IN';
    else if (lang === 'kn') utterance.lang = 'kn-IN';
    else utterance.lang = 'en-US';

    utterance.onend = () => setIsSpeaking(false);
    utterance.onerror = () => setIsSpeaking(false);

    setIsSpeaking(true);
    window.speechSynthesis.speak(utterance);
  };

  // Highlights scam keywords in transcript
  const renderHighlightedTranscript = (transcript: string) => {
    const triggerPhrases = [
      'right now', 'immediately', 'hurry', 'terrible car accident', 'accident',
      'jail', 'bail', 'five thousand dollars', 'fifty thousand rupees', 'crypto', 'upi',
      'gift card', "don't tell", 'borrowed phone', 'phone broke', 'custody', 'police',
      'inspector', 'remand'
    ];

    const regex = new RegExp(`(${triggerPhrases.join('|')})`, 'gi');
    const parts = transcript.split(regex);

    return parts.map((part, index) => {
      if (triggerPhrases.some((phrase) => phrase.toLowerCase() === part.toLowerCase())) {
        return (
          <mark
            key={index}
            className="bg-rose-500/30 text-rose-200 px-1 py-0.5 rounded font-semibold border-b border-rose-500"
          >
            {part}
          </mark>
        );
      }
      return <span key={index}>{part}</span>;
    });
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Top Navigation & Action Buttons */}
      <div className="flex flex-wrap items-center justify-between gap-3">
        <button
          onClick={onBackToScan}
          className="flex items-center space-x-2 text-xs sm:text-sm font-semibold text-slate-400 hover:text-white transition-colors bg-slate-800/80 hover:bg-slate-800 px-3 py-2 rounded-lg border border-slate-700"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Scan Another Call</span>
        </button>

        <div className="flex items-center space-x-2">
          {/* Audio Readout for Seniors */}
          <button
            onClick={handleReadAloud}
            className={`flex items-center space-x-2 text-xs sm:text-sm font-bold px-3 py-2 rounded-lg border transition-all ${
              isSpeaking
                ? 'bg-rose-600 text-white border-rose-500 animate-pulse'
                : 'bg-indigo-600/20 text-indigo-300 border-indigo-500/40 hover:bg-indigo-600 hover:text-white'
            }`}
          >
            {isSpeaking ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
            <span>{isSpeaking ? 'Stop Audio' : t.readAloudBtn}</span>
          </button>

          {/* Export Report Shortcut */}
          <button
            onClick={onOpenReport}
            className="flex items-center space-x-1.5 text-xs sm:text-sm font-bold bg-blue-600 hover:bg-blue-500 text-white px-3 py-2 rounded-lg transition-all shadow-md"
          >
            <FileText className="w-4 h-4" />
            <span>Generate 1930 Report</span>
          </button>
        </div>
      </div>

      {/* Main Speedometer Risk Meter */}
      <RiskMeter
        risk={result.risk}
        voiceProvider={result.voice.provider}
        scamEngine={result.scam.engine}
      />

      {/* Audio Playback Player if available */}
      {result.audioBlobUrl && (
        <div className="bg-slate-900/90 rounded-2xl border border-slate-800 p-4 shadow-xl flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-full bg-blue-600/20 flex items-center justify-center text-blue-400 border border-blue-500/30">
              <Volume2 className="w-5 h-5" />
            </div>
            <div>
              <p className="text-xs font-bold text-white">Call Recording Playback</p>
              <p className="text-[10px] text-slate-400">{result.filename}</p>
            </div>
          </div>
          <audio controls src={result.audioBlobUrl} className="h-9 w-64 max-w-full" />
        </div>
      )}

      {/* Plain-Language Reasons & Coercion Tactics */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Reasons Card */}
        <div className="bg-slate-900/90 rounded-2xl border border-slate-800 p-6 shadow-xl space-y-3">
          <h3 className="text-base font-bold text-white flex items-center space-x-2">
            <AlertOctagon className="w-5 h-5 text-amber-400" />
            <span>{t.reasonsTitle}</span>
          </h3>
          <ul className="space-y-2">
            {result.scam.reasons.map((reason, idx) => (
              <li key={idx} className="text-xs sm:text-sm text-slate-300 flex items-start space-x-2">
                <span className="text-amber-400 font-bold">•</span>
                <span>{reason}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* Tactics Badges Card */}
        <div className="bg-slate-900/90 rounded-2xl border border-slate-800 p-6 shadow-xl space-y-3">
          <h3 className="text-base font-bold text-white flex items-center space-x-2">
            <ShieldAlert className="w-5 h-5 text-rose-400" />
            <span>{t.tacticsTitle}</span>
          </h3>
          {result.scam.tactics.length > 0 ? (
            <div className="flex flex-wrap gap-2 pt-1">
              {result.scam.tactics.map((tac, idx) => (
                <span
                  key={idx}
                  className="bg-rose-950/60 text-rose-300 border border-rose-800/80 text-xs font-semibold px-2.5 py-1 rounded-lg uppercase tracking-wide flex items-center space-x-1"
                >
                  <span>⚠️</span>
                  <span>{tac}</span>
                </span>
              ))}
            </div>
          ) : (
            <p className="text-xs text-slate-400">No known predatory tactics identified in this sample.</p>
          )}

          <div className="pt-3 border-t border-slate-800 text-[11px] text-slate-400">
            <span>Claimed Identity: </span>
            <span className="font-semibold text-white">{result.claimed_relation || 'Unspecified'}</span>
          </div>
        </div>
      </div>

      {/* Transcript with Highlighted Evidence */}
      <div className="bg-slate-900/90 rounded-2xl border border-slate-800 p-6 shadow-xl space-y-3">
        <div className="flex items-center justify-between">
          <h3 className="text-base font-bold text-white flex items-center space-x-2">
            <FileText className="w-5 h-5 text-blue-400" />
            <span>{t.transcriptTitle}</span>
          </h3>
          <span className="text-[11px] bg-slate-800 text-slate-400 px-2 py-0.5 rounded border border-slate-700">
            Transcribed via Whisper
          </span>
        </div>
        <div className="bg-slate-950/70 p-4 rounded-xl border border-slate-800/80 text-slate-300 text-xs sm:text-sm leading-relaxed font-mono">
          {renderHighlightedTranscript(result.transcript)}
        </div>
      </div>

      {/* Call-back Checklist */}
      <CallbackChecklist
        lang={lang}
        riskLevel={result.risk.risk_level}
        onOpenReport={onOpenReport}
        onOpenVault={onOpenVault}
      />
    </div>
  );
};
