'use client';

import React from 'react';
import { History, Trash2, ArrowRight, ShieldAlert, CheckCircle2, AlertTriangle, FileAudio } from 'lucide-react';
import { AnalysisResult, Language } from '../types';
import { translations } from '../lib/translations';

interface ScanHistoryProps {
  history: AnalysisResult[];
  onSelectScan: (item: AnalysisResult) => void;
  onClearHistory: () => void;
  lang: Language;
}

export const ScanHistory: React.FC<ScanHistoryProps> = ({
  history,
  onSelectScan,
  onClearHistory,
  lang,
}) => {
  const t = translations[lang];

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl sm:text-3xl font-bold text-white flex items-center space-x-2">
            <History className="w-7 h-7 text-blue-400" />
            <span>{t.tabHistory}</span>
          </h2>
          <p className="text-sm text-slate-400 mt-1">
            Review past call scans, threat analyses, and evidence transcripts.
          </p>
        </div>

        {history.length > 0 && (
          <button
            onClick={onClearHistory}
            className="flex items-center space-x-1.5 text-xs text-slate-400 hover:text-rose-400 bg-slate-800/80 hover:bg-slate-800 px-3 py-2 rounded-lg border border-slate-700 transition-colors"
          >
            <Trash2 className="w-3.5 h-3.5" />
            <span>Clear History</span>
          </button>
        )}
      </div>

      {history.length === 0 ? (
        <div className="bg-slate-900/90 rounded-2xl border border-slate-800 p-12 text-center space-y-3">
          <History className="w-12 h-12 text-slate-600 mx-auto" />
          <h3 className="text-base font-bold text-slate-300">No Scanned Calls Yet</h3>
          <p className="text-xs text-slate-500 max-w-sm mx-auto">
            Once you analyze suspicious audio notes or test demo calls, your assessment records will appear here.
          </p>
        </div>
      ) : (
        <div className="space-y-3">
          {history.map((item, idx) => {
            const isHigh = item.risk.risk_level === 'HIGH';
            const isMedium = item.risk.risk_level === 'MEDIUM';

            return (
              <div
                key={idx}
                onClick={() => onSelectScan(item)}
                className="bg-slate-900/90 hover:bg-slate-850 border border-slate-800 hover:border-slate-700 rounded-xl p-4 sm:p-5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 cursor-pointer transition-all shadow-md group"
              >
                <div className="flex items-start space-x-3.5">
                  <div className="mt-0.5">
                    {isHigh ? (
                      <ShieldAlert className="w-6 h-6 text-rose-500" />
                    ) : isMedium ? (
                      <AlertTriangle className="w-6 h-6 text-amber-500" />
                    ) : (
                      <CheckCircle2 className="w-6 h-6 text-emerald-500" />
                    )}
                  </div>

                  <div>
                    <div className="flex items-center space-x-2">
                      <span className="text-sm font-bold text-white group-hover:text-blue-400 transition-colors">
                        {item.filename}
                      </span>
                      <span
                        className={`text-[10px] font-bold px-2 py-0.5 rounded border uppercase ${
                          isHigh
                            ? 'bg-rose-500/20 text-rose-300 border-rose-500/30'
                            : isMedium
                            ? 'bg-amber-500/20 text-amber-300 border-amber-500/30'
                            : 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30'
                        }`}
                      >
                        {item.risk.risk_level} RISK ({item.risk.fused_percentage}%)
                      </span>
                    </div>

                    <p className="text-xs text-slate-400 mt-1 line-clamp-1">
                      {item.transcript}
                    </p>

                    <div className="flex items-center space-x-3 text-[11px] text-slate-500 mt-2">
                      <span>{new Date(item.timestamp).toLocaleString()}</span>
                      <span>•</span>
                      <span>Caller: {item.claimed_relation || 'Unknown'}</span>
                      <span>•</span>
                      <span>Voice Fake Prob: {item.risk.fake_percentage}%</span>
                    </div>
                  </div>
                </div>

                <div className="flex items-center space-x-2 text-xs font-semibold text-blue-400 group-hover:translate-x-1 transition-transform self-end sm:self-center">
                  <span>View Details</span>
                  <ArrowRight className="w-4 h-4" />
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};
