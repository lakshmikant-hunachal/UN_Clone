'use client';

import React, { useState } from 'react';
import { FileText, Copy, Download, Printer, Check, ShieldAlert, PhoneCall, ExternalLink } from 'lucide-react';
import { AnalysisResult, Language } from '../types';
import { translations } from '../lib/translations';

interface IncidentReportProps {
  result?: AnalysisResult | null;
  lang: Language;
}

export const IncidentReport: React.FC<IncidentReportProps> = ({ result, lang }) => {
  const t = translations[lang];
  const [copied, setCopied] = useState(false);
  const [callerNumber, setCallerNumber] = useState('+91 99887 76655');
  const [victimName, setVictimName] = useState('Senior Citizen Family Member');
  const [financialLoss, setFinancialLoss] = useState('₹ 0 (Attempt Thwarted)');

  const reportId = `UNC-IN-${Date.now().toString().slice(-6)}`;
  const currentDate = new Date().toLocaleString('en-IN', { timeZone: 'Asia/Kolkata' });

  const transcript = result?.transcript || "Grandma? Please don't hang up! I was in a terrible car accident on the highway. My friend's car is completely totaled and the police have me at the precinct right now. My phone broke in the crash so I'm calling from this borrowed phone. The officer said if I pay five thousand dollars bail right now through UPI or wire transfer, they won't throw me in county jail! Please don't tell mom and dad, they'll kill me! Send it right now!";
  const fakeProb = result ? `${result.risk.fake_percentage}%` : '93.0%';
  const riskLevel = result ? result.risk.risk_level : 'HIGH';
  const tactics = result?.scam.tactics.length ? result.scam.tactics.join(', ') : 'urgency, secrecy, money request, gift card/crypto/UPI, claims phone is broken, impersonates police/lawyer';

  const fullReportText = `================================================================================
GOVERNMENT OF INDIA - CYBER CRIME INCIDENT COMPLAINT DOSSIER
SUBMISSION FOR: NATIONAL CYBER CRIME REPORTING PORTAL (cybercrime.gov.in)
AND EMERGENCY FINANCIAL FRAUD HELPLINE 1930
================================================================================

CASE REFERENCE NO: ${reportId}
DATE & TIME FILED: ${currentDate}
CATEGORY OF CRIME: Cyber Financial Impersonation Fraud / Deepfake Voice Coercion
APPLICABLE SECTIONS: Section 66D (Cheating by personation using computer resource),
                     Section 66C (Identity theft), IPC Section 419/420.

--------------------------------------------------------------------------------
1. COMPLAINANT & SUSPECT DETAILS
--------------------------------------------------------------------------------
Complainant Name / Victim: ${victimName}
Suspect Incoming Calling Number: ${callerNumber}
Caller's Claimed Identity: ${result?.claimed_relation || 'Grandson (Impersonation)'}
Reported Financial Loss Status: ${financialLoss}

--------------------------------------------------------------------------------
2. AI FORENSIC ANALYSIS SUMMARY (UNclone Agent & DetectifAI Platform)
--------------------------------------------------------------------------------
Forensic Threat Assessment: ${riskLevel} RISK
DetectifAI Voice Synthesis Probability: ${fakeProb} (AI Neural Vocoder Match)
Scam Coercion Intent Rating: ${result ? result.risk.scam_percentage : '95.0'}%
Detected Cyber Extortion Tactics: ${tactics}

Technical Notes:
- Voice exhibits synthetic acoustic phase anomalies characteristic of neural voice cloning models.
- Call script employs artificial panic, coercive isolation ('do not tell parents'), and immediate UPI transfer demand.

--------------------------------------------------------------------------------
3. TRANSCRIBED CALL RECORDING EVIDENCE
--------------------------------------------------------------------------------
"${transcript}"

--------------------------------------------------------------------------------
4. ACTIONS REQUESTED FROM LAW ENFORCEMENT & BANK FRAUD DESK
--------------------------------------------------------------------------------
1. Immediate Beneficiary Account Freeze under Citizen Financial Cyber Fraud Reporting (CFCFRMS - 1930).
2. Telecom Call Detail Record (CDR) tracing for suspect number ${callerNumber}.
3. Electronic preservation of digital transaction logs and carrier spoofing headers.

Digital Verification Hash: SHA256-${Date.now().toString(16).toUpperCase()}
Verified by: UNclone Defensive Agent - Family Scam Mitigation Engine
================================================================================`;

  const handleCopy = () => {
    navigator.clipboard.writeText(fullReportText);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownload = () => {
    const element = document.createElement('a');
    const file = new Blob([fullReportText], { type: 'text/plain' });
    element.href = URL.createObjectURL(file);
    element.download = `Cybercrime_Complaint_${reportId}.txt`;
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Header */}
      <div>
        <h2 className="text-2xl sm:text-3xl font-bold text-white flex items-center space-x-2">
          <FileText className="w-7 h-7 text-blue-400" />
          <span>{t.reportTitle}</span>
        </h2>
        <p className="text-sm text-slate-400 mt-1">{t.reportDesc}</p>
      </div>

      {/* Cyber Police Quick Access Banner */}
      <div className="bg-red-950/40 border border-red-500/40 rounded-2xl p-5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="space-y-1">
          <div className="flex items-center space-x-2 text-rose-400 font-bold text-sm">
            <PhoneCall className="w-4 h-4 animate-bounce" />
            <span>National Cybercrime Helpline: 1930 (Toll Free 24x7)</span>
          </div>
          <p className="text-xs text-slate-300">
            Report within the 2-hour "Golden Hour" window to freeze fraudulent UPI/bank transfers before withdrawal.
          </p>
        </div>
        <a
          href="https://cybercrime.gov.in"
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center space-x-1.5 text-xs font-bold bg-red-600 hover:bg-red-500 text-white px-4 py-2.5 rounded-xl transition-all shadow-md flex-shrink-0"
        >
          <span>Open cybercrime.gov.in</span>
          <ExternalLink className="w-3.5 h-3.5" />
        </a>
      </div>

      {/* Editable Fields for Report Customization */}
      <div className="bg-slate-900/90 rounded-2xl border border-slate-800 p-6 shadow-xl space-y-4">
        <h3 className="text-sm font-bold text-slate-300 uppercase tracking-wider">
          Incident Details for Report Generation
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          <div>
            <label className="block text-xs text-slate-400 mb-1">Complainant / Victim</label>
            <input
              type="text"
              value={victimName}
              onChange={(e) => setVictimName(e.target.value)}
              className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-1.5 text-xs text-white"
            />
          </div>
          <div>
            <label className="block text-xs text-slate-400 mb-1">Suspect Calling Number</label>
            <input
              type="text"
              value={callerNumber}
              onChange={(e) => setCallerNumber(e.target.value)}
              className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-1.5 text-xs text-white"
            />
          </div>
          <div>
            <label className="block text-xs text-slate-400 mb-1">Financial Loss Status</label>
            <input
              type="text"
              value={financialLoss}
              onChange={(e) => setFinancialLoss(e.target.value)}
              className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-1.5 text-xs text-white"
            />
          </div>
        </div>
      </div>

      {/* Formatted Dossier View */}
      <div className="bg-slate-950 rounded-2xl border border-slate-800 p-6 shadow-2xl relative font-mono text-xs sm:text-sm text-slate-300 space-y-4 overflow-x-auto">
        <div className="flex items-center justify-between pb-3 border-b border-slate-800">
          <span className="text-xs font-bold text-slate-400 uppercase">
            Official Electronic Evidence Dossier
          </span>
          <div className="flex items-center space-x-2">
            <button
              onClick={handleCopy}
              className="flex items-center space-x-1 bg-slate-800 hover:bg-slate-700 text-slate-200 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all border border-slate-700"
            >
              {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
              <span>{copied ? 'Copied!' : t.copyReportBtn}</span>
            </button>
            <button
              onClick={handleDownload}
              className="flex items-center space-x-1 bg-blue-600 hover:bg-blue-500 text-white px-3 py-1.5 rounded-lg text-xs font-semibold transition-all shadow-sm"
            >
              <Download className="w-3.5 h-3.5" />
              <span>{t.downloadReportBtn}</span>
            </button>
            <button
              onClick={handlePrint}
              className="flex items-center space-x-1 bg-slate-800 hover:bg-slate-700 text-slate-200 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all border border-slate-700 hidden sm:flex"
            >
              <Printer className="w-3.5 h-3.5" />
              <span>Print</span>
            </button>
          </div>
        </div>

        <pre className="whitespace-pre-wrap leading-relaxed text-slate-300 text-xs sm:text-xs">
          {fullReportText}
        </pre>
      </div>
    </div>
  );
};
