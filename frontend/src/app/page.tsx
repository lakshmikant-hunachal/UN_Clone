'use client';

import React, { useState, useEffect } from 'react';
import { Navbar } from '../components/Navbar';
import { AudioScanner } from '../components/AudioScanner';
import { ResultView } from '../components/ResultView';
import { FamilyVault } from '../components/FamilyVault';
import { IncidentReport } from '../components/IncidentReport';
import { AwarenessQuiz } from '../components/AwarenessQuiz';
import { ScanHistory } from '../components/ScanHistory';
import { AnalysisResult, Language } from '../types';

export default function Home() {
  const [activeTab, setActiveTab] = useState<string>('scan');
  const [lang, setLang] = useState<Language>('en');
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [currentResult, setCurrentResult] = useState<AnalysisResult | null>(null);

  // Scan History
  const [history, setHistory] = useState<AnalysisResult[]>(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('unclone_scan_history');
      if (saved) {
        try {
          return JSON.parse(saved);
        } catch (e) {}
      }
    }
    return [];
  });

  useEffect(() => {
    localStorage.setItem('unclone_scan_history', JSON.stringify(history));
  }, [history]);

  const handleAnalysisComplete = (result: AnalysisResult) => {
    setCurrentResult(result);
    setHistory((prev) => [result, ...prev]);
    setActiveTab('result');
  };

  const handleSelectHistoryScan = (item: AnalysisResult) => {
    setCurrentResult(item);
    setActiveTab('result');
  };

  const handleClearHistory = () => {
    setHistory([]);
    localStorage.removeItem('unclone_scan_history');
  };

  return (
    <div className="min-h-screen bg-slate-950 flex flex-col justify-between">
      <div>
        <Navbar
          activeTab={activeTab}
          setActiveTab={setActiveTab}
          lang={lang}
          setLang={setLang}
          hasResult={!!currentResult}
        />

        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {activeTab === 'scan' && (
            <AudioScanner
              lang={lang}
              onAnalysisComplete={handleAnalysisComplete}
              isLoading={isLoading}
              setIsLoading={setIsLoading}
            />
          )}

          {activeTab === 'result' && currentResult && (
            <ResultView
              result={currentResult}
              lang={lang}
              onBackToScan={() => setActiveTab('scan')}
              onOpenReport={() => setActiveTab('report')}
              onOpenVault={() => setActiveTab('vault')}
            />
          )}

          {activeTab === 'vault' && <FamilyVault lang={lang} />}

          {activeTab === 'report' && (
            <IncidentReport result={currentResult} lang={lang} />
          )}

          {activeTab === 'awareness' && <AwarenessQuiz lang={lang} />}

          {activeTab === 'history' && (
            <ScanHistory
              history={history}
              onSelectScan={handleSelectHistoryScan}
              onClearHistory={handleClearHistory}
              lang={lang}
            />
          )}
        </main>
      </div>

      {/* Footer */}
      <footer className="border-t border-slate-900 bg-slate-950 py-6 text-center text-xs text-slate-500 space-y-2">
        <p className="font-medium text-slate-400">
          UNclone Agent • Built with DetectifAI Foundation API & Gemini Free AI
        </p>
        <p className="text-[11px] max-w-xl mx-auto text-slate-600 px-4">
          Defensive anti-fraud software. National Cyber Crime Helpline: 1930 | cybercrime.gov.in. 
          Detection assists human verification; never bypass direct call-backs on saved phone numbers.
        </p>
      </footer>
    </div>
  );
}
