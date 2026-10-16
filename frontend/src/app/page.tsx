'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Navbar } from '../components/Navbar';
import { AudioScanner } from '../components/AudioScanner';
import { ResultView } from '../components/ResultView';
import { FamilyVault } from '../components/FamilyVault';
import { IncidentReport } from '../components/IncidentReport';
import { AwarenessQuiz } from '../components/AwarenessQuiz';
import { ScanHistory } from '../components/ScanHistory';
import { AnalysisResult, Language, UserProfile } from '../types';
import { Loader2 } from 'lucide-react';

const BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_URL || 'http://127.0.0.1:8000';

export default function Home() {
  const router = useRouter();
  const [token, setToken] = useState<string | null>(null);
  const [currentUser, setCurrentUser] = useState<UserProfile | null>(null);
  const [authChecked, setAuthChecked] = useState(false);

  const [activeTab, setActiveTab] = useState<string>('scan');
  const [lang, setLang] = useState<Language>('en');
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [currentResult, setCurrentResult] = useState<AnalysisResult | null>(null);

  // Per-User SQLite History
  const [history, setHistory] = useState<AnalysisResult[]>([]);
  const [historyLoading, setHistoryLoading] = useState(false);

  // Verify authentication on mount
  useEffect(() => {
    const storedToken = localStorage.getItem('familyshield_token');
    if (!storedToken) {
      router.push('/login');
      return;
    }
    setToken(storedToken);

    // Fetch user profile from backend
    fetch(`${BACKEND_URL}/auth/me`, {
      headers: { Authorization: `Bearer ${storedToken}` },
    })
      .then((res) => {
        if (!res.ok) throw new Error('Auth expired');
        return res.json();
      })
      .then((user) => {
        setCurrentUser(user);
        setAuthChecked(true);
      })
      .catch(() => {
        localStorage.removeItem('familyshield_token');
        localStorage.removeItem('familyshield_user');
        router.push('/login');
      });
  }, [router]);

  // Fetch scan history from backend SQLite
  const fetchScans = async () => {
    if (!token) return;
    setHistoryLoading(true);
    try {
      const res = await fetch(`${BACKEND_URL}/scans`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (res.ok) {
        const data = await res.json();
        // Map backend scan records to AnalysisResult format
        const formatted: AnalysisResult[] = data.map((d: any) => ({
          id: d.id,
          success: true,
          input_type: d.input_type || 'text',
          timestamp: d.timestamp,
          transcript: d.transcript,
          extracted: d.extracted,
          risk: {
            risk_level: d.risk_level,
            color: d.risk_level === 'HIGH' ? 'red' : d.risk_level === 'MEDIUM' ? 'amber' : 'green',
            fused_score: d.fused_score,
            fused_percentage: Math.round((d.fused_score || 0) * 100),
            fake_prob: d.fake_prob,
            fake_percentage: d.fake_prob !== null ? Math.round(d.fake_prob * 100) : null,
            scam_score: d.scam_score,
            scam_percentage: Math.round((d.scam_score || 0) * 100),
            voice_analysed: d.fake_prob !== null,
            mode_label: d.fake_prob !== null ? 'Voice + Text Fusion' : 'Text-Only (voice not analysed)',
            summary: d.risk_level === 'HIGH' ? 'Critical emergency coercion detected.' : 'Analysis completed.',
          },
          voice: {
            fake_prob: d.fake_prob,
            status: d.voice_status || 'voice not analysed',
            provider: 'detectifai',
          },
          scam: {
            scam_score: d.scam_score,
            tactics: d.tactics || [],
            reasons: d.reasons || [],
            advice: [],
            extracted: d.extracted,
            engine: 'FamilyShield Engine',
          },
          action_checklist: [
            '1. Hang up immediately.',
            '2. Call back on saved number.',
            '3. Ask for Family Safe-Word.',
          ],
        }));
        setHistory(formatted);
      }
    } catch (e) {
      console.error('Failed to fetch scans:', e);
    } finally {
      setHistoryLoading(false);
    }
  };

  useEffect(() => {
    if (token) fetchScans();
  }, [token]);

  const handleAnalysisComplete = (result: AnalysisResult) => {
    setCurrentResult(result);
    setActiveTab('result');
    fetchScans();
  };

  const handleSelectHistoryScan = (item: AnalysisResult) => {
    setCurrentResult(item);
    setActiveTab('result');
  };

  const handleClearHistory = async () => {
    if (!token) return;
    try {
      await fetch(`${BACKEND_URL}/scans`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` },
      });
      setHistory([]);
    } catch (e) {
      console.error('Failed to clear scans:', e);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('familyshield_token');
    localStorage.removeItem('familyshield_user');
    router.push('/login');
  };

  if (!authChecked) {
    return (
      <div className="min-h-screen bg-slate-950 flex flex-col items-center justify-center space-y-3">
        <Loader2 className="w-8 h-8 text-blue-500 animate-spin" />
        <p className="text-xs text-slate-400">Loading FamilyShield AI...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-950 flex flex-col justify-between">
      <div>
        <Navbar
          activeTab={activeTab}
          setActiveTab={setActiveTab}
          lang={lang}
          setLang={setLang}
          hasResult={!!currentResult}
          currentUser={currentUser}
          onLogout={handleLogout}
        />

        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {activeTab === 'scan' && (
            <AudioScanner
              lang={lang}
              onAnalysisComplete={handleAnalysisComplete}
              isLoading={isLoading}
              setIsLoading={setIsLoading}
              token={token}
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

          {activeTab === 'vault' && (
            <FamilyVault lang={lang} token={token} currentUser={currentUser} />
          )}

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
              loading={historyLoading}
            />
          )}
        </main>
      </div>

      <footer className="border-t border-slate-900 bg-slate-950 py-6 text-center text-xs text-slate-500 space-y-2">
        <p className="font-semibold text-slate-400">
          FamilyShield AI • Family Defense Against Voice-Clones & Emergency Extortion
        </p>
        <p className="text-[11px] max-w-xl mx-auto text-slate-600 px-4">
          National Cyber Crime Reporting Portal: cybercrime.gov.in | Helpline 1930.
          Defensive security assistant. Never bypass direct verbal verification on saved contact numbers.
        </p>
      </footer>
    </div>
  );
}
