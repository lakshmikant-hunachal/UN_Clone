'use client';

import React from 'react';
import { ShieldAlert, ShieldCheck, PhoneCall, Globe, Users, FileText, HelpCircle, History, Sparkles, LogOut, User } from 'lucide-react';
import { Language, UserProfile } from '../types';
import { translations } from '../lib/translations';

interface NavbarProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  lang: Language;
  setLang: (lang: Language) => void;
  hasResult: boolean;
  currentUser: UserProfile | null;
  onLogout: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  activeTab,
  setActiveTab,
  lang,
  setLang,
  hasResult,
  currentUser,
  onLogout,
}) => {
  const t = translations[lang];

  return (
    <header className="bg-slate-900 border-b border-slate-800 sticky top-0 z-50 shadow-md">
      {/* Top Emergency Cyberline Banner */}
      <div className="bg-red-700 text-white px-4 py-2 text-xs md:text-sm font-semibold flex items-center justify-between shadow-inner">
        <div className="flex items-center space-x-2 mx-auto sm:mx-0">
          <PhoneCall className="w-4 h-4 animate-pulse flex-shrink-0" />
          <span>{t.helplineAlert}</span>
        </div>
        <div className="hidden sm:flex items-center space-x-3 text-xs">
          <span className="bg-red-900/60 px-2 py-0.5 rounded border border-red-500/50">Helpline: 1930</span>
          <span className="bg-red-900/60 px-2 py-0.5 rounded border border-red-500/50">cybercrime.gov.in</span>
        </div>
      </div>

      {/* Main Header Bar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo & Brand */}
          <div className="flex items-center space-x-3 cursor-pointer" onClick={() => setActiveTab('scan')}>
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-cyan-500 via-blue-600 to-indigo-600 flex items-center justify-center shadow-lg shadow-cyan-500/20">
              <ShieldAlert className="w-6 h-6 text-white" />
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <span className="text-xl font-bold tracking-tight text-white">{t.appTitle}</span>
                <span className="bg-emerald-500/20 text-emerald-400 text-[10px] font-bold px-2 py-0.5 rounded-full border border-emerald-500/30">
                  Family Edition v2
                </span>
              </div>
              <p className="text-xs text-slate-400 hidden sm:block">{t.appSubtitle}</p>
            </div>
          </div>

          {/* Right Section: User Status & Language */}
          <div className="flex items-center space-x-3">
            {currentUser && (
              <div className="flex items-center space-x-2 bg-slate-800/80 px-3 py-1.5 rounded-xl border border-slate-700 text-xs">
                <User className="w-3.5 h-3.5 text-blue-400" />
                <span className="text-slate-200 font-medium hidden md:inline">{currentUser.name}</span>
                <button
                  onClick={onLogout}
                  title="Log Out"
                  className="ml-2 text-slate-400 hover:text-rose-400 transition-colors flex items-center space-x-1"
                >
                  <LogOut className="w-3.5 h-3.5" />
                  <span className="hidden sm:inline">{t.logout}</span>
                </button>
              </div>
            )}

            {/* Language Selector */}
            <div className="flex items-center space-x-1 bg-slate-800/80 p-1 rounded-lg border border-slate-700">
              <Globe className="w-3.5 h-3.5 text-slate-400 ml-1.5" />
              {(['en', 'hi', 'kn'] as Language[]).map((l) => (
                <button
                  key={l}
                  onClick={() => setLang(l)}
                  className={`px-2 py-0.5 text-xs font-medium rounded transition-all ${
                    lang === l
                      ? 'bg-blue-600 text-white shadow-sm'
                      : 'text-slate-400 hover:text-white'
                  }`}
                >
                  {l === 'en' ? 'EN' : l === 'hi' ? 'हिंदी' : 'ಕನ್ನಡ'}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Navigation Tabs */}
        <div className="flex overflow-x-auto space-x-1 py-2 scrollbar-none border-t border-slate-800 text-sm">
          <button
            onClick={() => setActiveTab('scan')}
            className={`flex items-center space-x-2 px-3.5 py-2 rounded-lg font-medium whitespace-nowrap transition-all ${
              activeTab === 'scan'
                ? 'bg-blue-600/20 text-blue-400 border border-blue-500/30'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
            }`}
          >
            <ShieldCheck className="w-4 h-4" />
            <span>{t.tabScan}</span>
          </button>

          {hasResult && (
            <button
              onClick={() => setActiveTab('result')}
              className={`flex items-center space-x-2 px-3.5 py-2 rounded-lg font-medium whitespace-nowrap transition-all ${
                activeTab === 'result'
                  ? 'bg-amber-500/20 text-amber-300 border border-amber-500/30'
                  : 'text-amber-400 hover:text-amber-300 hover:bg-slate-800/60'
              }`}
            >
              <Sparkles className="w-4 h-4 animate-pulse" />
              <span>{t.tabResult}</span>
            </button>
          )}

          <button
            onClick={() => setActiveTab('vault')}
            className={`flex items-center space-x-2 px-3.5 py-2 rounded-lg font-medium whitespace-nowrap transition-all ${
              activeTab === 'vault'
                ? 'bg-blue-600/20 text-blue-400 border border-blue-500/30'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
            }`}
          >
            <Users className="w-4 h-4" />
            <span>{t.tabVault}</span>
          </button>

          <button
            onClick={() => setActiveTab('report')}
            className={`flex items-center space-x-2 px-3.5 py-2 rounded-lg font-medium whitespace-nowrap transition-all ${
              activeTab === 'report'
                ? 'bg-blue-600/20 text-blue-400 border border-blue-500/30'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
            }`}
          >
            <FileText className="w-4 h-4" />
            <span>{t.tabReport}</span>
          </button>

          <button
            onClick={() => setActiveTab('awareness')}
            className={`flex items-center space-x-2 px-3.5 py-2 rounded-lg font-medium whitespace-nowrap transition-all ${
              activeTab === 'awareness'
                ? 'bg-blue-600/20 text-blue-400 border border-blue-500/30'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
            }`}
          >
            <HelpCircle className="w-4 h-4" />
            <span>{t.tabAwareness}</span>
          </button>

          <button
            onClick={() => setActiveTab('history')}
            className={`flex items-center space-x-2 px-3.5 py-2 rounded-lg font-medium whitespace-nowrap transition-all ${
              activeTab === 'history'
                ? 'bg-blue-600/20 text-blue-400 border border-blue-500/30'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
            }`}
          >
            <History className="w-4 h-4" />
            <span>{t.tabHistory}</span>
          </button>
        </div>
      </div>
    </header>
  );
};
