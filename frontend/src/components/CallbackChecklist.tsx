'use client';

import React, { useState } from 'react';
import { CheckSquare, Square, ShieldAlert, PhoneOff, PhoneForwarded, KeyRound, Users2, Building2 } from 'lucide-react';
import { Language, RiskLevel } from '../types';
import { translations } from '../lib/translations';

interface CallbackChecklistProps {
  lang: Language;
  riskLevel: RiskLevel;
  onOpenReport?: () => void;
  onOpenVault?: () => void;
}

export const CallbackChecklist: React.FC<CallbackChecklistProps> = ({
  lang,
  riskLevel,
  onOpenReport,
  onOpenVault,
}) => {
  const t = translations[lang];

  const steps = [
    {
      id: 'step1',
      title: t.step1,
      icon: <PhoneOff className="w-5 h-5 text-rose-400" />,
      subtext: 'Never remain connected to an unsolicited emergency caller. Pressure drops immediately once you disconnect.',
      urgent: true,
    },
    {
      id: 'step2',
      title: t.step2,
      icon: <PhoneForwarded className="w-5 h-5 text-blue-400" />,
      subtext: 'Caller IDs can easily be spoofed by VoIP software. Only dial the original number already saved in your address book.',
      urgent: true,
    },
    {
      id: 'step3',
      title: t.step3,
      icon: <KeyRound className="w-5 h-5 text-amber-400" />,
      subtext: 'AI voice clones scrape social media audio but CANNOT guess an offline family safe-word.',
      action: onOpenVault ? { label: 'Check Family Vault', onClick: onOpenVault } : undefined,
    },
    {
      id: 'step4',
      title: t.step4,
      icon: <Users2 className="w-5 h-5 text-emerald-400" />,
      subtext: 'Call parents, spouse, roommates, or school/office to verify where the person actually is right now.',
    },
    {
      id: 'step5',
      title: t.step5,
      icon: <Building2 className="w-5 h-5 text-purple-400" />,
      subtext: 'Golden Hour Rule: Reporting within the first 2 hours allows Indian Cyber Police (1930) to freeze recipient accounts.',
      action: onOpenReport ? { label: 'Generate 1930 Dossier', onClick: onOpenReport } : undefined,
    },
  ];

  const [checkedSteps, setCheckedSteps] = useState<Record<string, boolean>>({});

  const toggleStep = (id: string) => {
    setCheckedSteps((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  const completedCount = Object.values(checkedSteps).filter(Boolean).length;

  return (
    <div className="bg-slate-900/90 rounded-2xl border border-slate-800 p-6 shadow-xl backdrop-blur-sm">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 mb-4 pb-4 border-b border-slate-800">
        <div>
          <h3 className="text-xl font-bold text-white flex items-center space-x-2">
            <ShieldAlert className="w-5 h-5 text-amber-400" />
            <span>{t.checklistTitle}</span>
          </h3>
          <p className="text-xs text-slate-400 mt-0.5">{t.checklistDesc}</p>
        </div>
        <div className="flex items-center space-x-2 bg-slate-800 px-3 py-1.5 rounded-lg border border-slate-700">
          <span className="text-xs text-slate-400">Completed:</span>
          <span className="text-xs font-bold text-blue-400">{completedCount} of {steps.length}</span>
        </div>
      </div>

      <div className="space-y-3">
        {steps.map((step) => {
          const isDone = !!checkedSteps[step.id];

          return (
            <div
              key={step.id}
              onClick={() => toggleStep(step.id)}
              className={`p-4 rounded-xl border transition-all cursor-pointer flex items-start space-x-3.5 ${
                isDone
                  ? 'bg-emerald-950/20 border-emerald-500/40 opacity-80'
                  : 'bg-slate-800/60 border-slate-700/60 hover:border-slate-600'
              }`}
            >
              <div className="mt-0.5 flex-shrink-0">
                {isDone ? (
                  <CheckSquare className="w-5 h-5 text-emerald-400" />
                ) : (
                  <Square className="w-5 h-5 text-slate-500" />
                )}
              </div>

              <div className="flex-1">
                <div className="flex items-center space-x-2">
                  <span className="flex-shrink-0">{step.icon}</span>
                  <h4 className={`text-sm font-bold ${isDone ? 'line-through text-slate-400' : 'text-white'}`}>
                    {step.title}
                  </h4>
                </div>
                <p className="text-xs text-slate-400 mt-1 leading-relaxed">
                  {step.subtext}
                </p>

                {step.action && (
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      step.action?.onClick();
                    }}
                    className="mt-2 text-xs font-semibold text-blue-400 hover:text-blue-300 underline underline-offset-2"
                  >
                    {step.action.label} &rarr;
                  </button>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
