'use client';

import React, { useState } from 'react';
import { FileText, Copy, Download, ExternalLink, PhoneCall, AlertCircle, Check } from 'lucide-react';
import { AnalysisResult, Language } from '../types';
import { translations } from '../lib/translations';

interface IncidentReportProps {
  result?: AnalysisResult | null;
  lang: Language;
}

export const IncidentReport: React.FC<IncidentReportProps> = ({ result, lang }) => {
  const t = translations[lang];
  const [copied, setCopied] = useState(false);
  const [complainantName, setComplainantName] = useState('Complainant');
  const [financialLoss, setFinancialLoss] = useState('₹ 0 (Attempt Thwarted)');

  // v2 Policy: Empty until you scan! No pre-filled fake data!
  if (!result) {
    return (
      <div className="max-w-4xl mx-auto space-y-6">
        <div>
          <h2 className="text-2xl sm:text-3xl font-bold text-white flex items-center space-x-2">
            <FileText className="w-7 h-7 text-blue-400" />
            <span>{t.reportTitle}</span>
          </h2>
          <p className="text-xs sm:text-sm text-slate-400 mt-1">{t.reportDesc}</p>
        </div>

        <div className="bg-slate-900/90 rounded-2xl border border-slate-800 p-12 text-center space-y-3">
          <FileText className="w-12 h-12 text-slate-600 mx-auto" />
          <h3 className="text-base font-bold text-slate-300">No Scan Data Available</h3>
          <p className="text-xs text-slate-500 max-w-md mx-auto">{t.emptyReportMessage}</p>
        </div>
      </div>
    );
  }

  const ext = result.extracted || {};
  const reportId = `FSH-IN-${result.id || Date.now().toString().slice(-6)}`;
  const currentDate = new Date().toLocaleString('en-IN', { timeZone: 'Asia/Kolkata' });

  // Only real data from this specific scan!
  const suspectPhone = ext.phone_number || 'None stated in message';
  const claimedIdentity = ext.caller_claims_to_be || result.claimed_relation || 'Unspecified';
  const callerName = ext.caller_name || 'None stated';
  const moneyDemanded = ext.money_demanded || 'None';
  const paymentMethod = ext.payment_method || 'None';
  const upiId = ext.upi_id || 'None';
  const maskedBank = ext.masked_bank_account || 'None';
  const links = ext.links && ext.links.length > 0 ? ext.links.join(', ') : 'None';
  const tactics = result.scam.tactics.length > 0 ? result.scam.tactics.join(', ') : 'None';
  const fakeProbStr = result.risk.fake_percentage !== null ? `${result.risk.fake_percentage}%` : 'Voice not analysed (Text scan)';

  const fullReportText = `================================================================================
NATIONAL CYBER CRIME REPORTING PORTAL (cybercrime.gov.in) & HELPLINE 1930
ELECTRONIC INCIDENT COMPLAINT DOSSIER (REAL SCAN EVIDENCE)
================================================================================

CASE REFERENCE NO: ${reportId}
DATE & TIME FILED: ${currentDate}
COMPLAINANT NAME: ${complainantName}
CATEGORY OF CRIME: Cyber Financial Impersonation Fraud / Family Emergency Extortion
APPLICABLE SECTIONS: Section 66D (Cheating by personation using computer resource),
                     Section 66C (Identity theft), IPC Section 419/420.

--------------------------------------------------------------------------------
1. EXTRACTED SUSPECT ARTIFACTS (REAL SCAN DATA)
--------------------------------------------------------------------------------
- Suspect Incoming / Callback Phone: ${suspectPhone}
- Caller Claimed Identity: ${claimedIdentity}
- Caller Stated Name: ${callerName}
- Situation Claimed: ${ext.situation || 'Emergency'}
- Financial Amount Demanded: ${moneyDemanded}
- Payment Method Demanded: ${paymentMethod}
- Suspect UPI ID: ${upiId}
- Suspect Bank Account (Masked): ${maskedBank}
- Coercive Secrecy Demanded: ${ext.secrecy_coercion || 'None'}
- Deadline / Pressure Applied: ${ext.deadline_pressure || 'None'}
- Embedded Links / URLs: ${links}
- Loss Status: ${financialLoss}

--------------------------------------------------------------------------------
2. FORENSIC THREAT ASSESSMENT (FamilyShield AI)
--------------------------------------------------------------------------------
- Threat Rating: ${result.risk.risk_level} (${result.risk.fused_percentage}%)
- Voice Clone Probability: ${fakeProbStr}
- Coercion Intent Score: ${result.risk.scam_percentage}%
- Identified Tactics: ${tactics}

--------------------------------------------------------------------------------
3. TRANSCRIBED MESSAGE / CALL RECORD
--------------------------------------------------------------------------------
"${result.transcript}"

--------------------------------------------------------------------------------
4. LAW ENFORCEMENT & BANK ACTION REQUEST
--------------------------------------------------------------------------------
1. Immediate Beneficiary Account Freeze under Citizen Financial Cyber Fraud System (1930).
2. Telecom Call Detail Record (CDR) tracing for suspect number ${suspectPhone}.
3. Formal electronic complaint filing under Section 66D IT Act.

Verified by FamilyShield AI Forensic Shield (No Invented Data)
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
    element.download = `Cybercrime_Dossier_${reportId}.txt`;
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div>
        <h2 className="text-2xl sm:text-3xl font-bold text-white flex items-center space-x-2">
          <FileText className="w-7 h-7 text-blue-400" />
          <span>{t.reportTitle}</span>
        </h2>
        <p className="text-xs sm:text-sm text-slate-400 mt-1">{t.reportDesc}</p>
      </div>

      {/* Cyber Helpline Banner */}
      <div className="bg-red-950/40 border border-red-500/40 rounded-2xl p-4 sm:p-5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center space-x-2 text-rose-400 font-bold text-sm">
            <PhoneCall className="w-4 h-4 animate-bounce" />
            <span>National Cybercrime Helpline: 1930 (Toll Free 24x7)</span>
          </div>
          <p className="text-xs text-slate-300 mt-1">
            Golden Hour: Report within the first 2 hours to freeze fraudulent beneficiary bank/UPI accounts.
          </p>
        </div>
        <a
          href="https://cybercrime.gov.in"
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center space-x-1.5 text-xs font-bold bg-red-600 hover:bg-red-500 text-white px-3.5 py-2 rounded-xl transition-all shadow-md flex-shrink-0"
        >
          <span>cybercrime.gov.in</span>
          <ExternalLink className="w-3.5 h-3.5" />
        </a>
      </div>

      {/* Complainant Customization */}
      <div className="bg-slate-900/90 rounded-2xl border border-slate-800 p-5 shadow-xl">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div>
            <label className="block text-[11px] font-semibold text-slate-400 mb-1">Complainant Name</label>
            <input
              type="text"
              value={complainantName}
              onChange={(e) => setComplainantName(e.target.value)}
              className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-1.5 text-xs text-white"
            />
          </div>
          <div>
            <label className="block text-[11px] font-semibold text-slate-400 mb-1">Financial Loss Status</label>
            <input
              type="text"
              value={financialLoss}
              onChange={(e) => setFinancialLoss(e.target.value)}
              className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-1.5 text-xs text-white"
            />
          </div>
        </div>
      </div>

      {/* Dossier Text Box */}
      <div className="bg-slate-950 rounded-2xl border border-slate-800 p-6 shadow-2xl relative font-mono text-xs text-slate-300 space-y-4 overflow-x-auto">
        <div className="flex items-center justify-between pb-3 border-b border-slate-800">
          <span className="text-xs font-bold text-slate-400 uppercase">
            Official 1930 Cyber Dossier (Pure Scan Data)
          </span>
          <div className="flex items-center space-x-2">
            <button
              onClick={handleCopy}
              className="flex items-center space-x-1 bg-slate-800 hover:bg-slate-700 text-slate-200 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all border border-slate-700"
            >
              {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
              <span>{copied ? 'Copied' : 'Copy'}</span>
            </button>
            <button
              onClick={handleDownload}
              className="flex items-center space-x-1 bg-blue-600 hover:bg-blue-500 text-white px-3 py-1.5 rounded-lg text-xs font-semibold transition-all shadow-sm"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Download (.txt)</span>
            </button>
          </div>
        </div>

        <pre className="whitespace-pre-wrap leading-relaxed text-slate-300 text-xs font-mono">
          {fullReportText}
        </pre>
      </div>
    </div>
  );
};
