'use client';

import React from 'react';
import { RiskFusionResult } from '../types';
import { AlertTriangle, CheckCircle2, Flame, Bot, MessageSquare } from 'lucide-react';

interface RiskMeterProps {
  risk: RiskFusionResult;
  voiceProvider?: string;
  scamEngine?: string;
}

export const RiskMeter: React.FC<RiskMeterProps> = ({ risk, voiceProvider, scamEngine }) => {
  const percentage = Math.min(100, Math.max(0, risk.fused_percentage));
  
  // Calculate needle rotation angle in degrees (-90deg to +90deg)
  const angle = -90 + (percentage / 100) * 180;

  // Determine color styling
  let badgeBg = 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30';
  let gaugeColor = '#10b981'; // green
  let statusIcon = <CheckCircle2 className="w-8 h-8 text-emerald-400" />;
  let headline = 'LOW RISK: NATURAL VOICE PATTERN';

  if (risk.risk_level === 'HIGH') {
    badgeBg = 'bg-rose-500/10 text-rose-400 border-rose-500/30';
    gaugeColor = '#f43f5e'; // red
    statusIcon = <Flame className="w-8 h-8 text-rose-500 animate-bounce" />;
    headline = 'CRITICAL THREAT: AI CLONE & EXTORTION';
  } else if (risk.risk_level === 'MEDIUM') {
    badgeBg = 'bg-amber-500/10 text-amber-400 border-amber-500/30';
    gaugeColor = '#f59e0b'; // amber
    statusIcon = <AlertTriangle className="w-8 h-8 text-amber-400 animate-pulse" />;
    headline = 'SUSPICIOUS CALL: HIGH PRESSURE DETECTED';
  }

  return (
    <div className="bg-slate-900/90 rounded-2xl border border-slate-800 p-6 shadow-xl backdrop-blur-sm">
      <div className="flex flex-col items-center text-center">
        {/* Risk Gauge Header */}
        <div className="flex items-center space-x-3 mb-2">
          {statusIcon}
          <h2 className="text-2xl sm:text-3xl font-black tracking-tight text-white">{headline}</h2>
        </div>
        <p className="text-sm text-slate-300 max-w-xl mb-6">{risk.summary}</p>

        {/* Semi-Circle SVG Speedometer Gauge */}
        <div className="relative w-72 h-36 flex items-center justify-center overflow-hidden mb-4">
          <svg viewBox="0 0 200 110" className="w-full h-full">
            {/* Background Arc */}
            <path
              d="M 20 100 A 80 80 0 0 1 180 100"
              fill="none"
              stroke="#1e293b"
              strokeWidth="18"
              strokeLinecap="round"
            />
            {/* Colored Segment Gradient Arc */}
            <path
              d="M 20 100 A 80 80 0 0 1 70 35"
              fill="none"
              stroke="#10b981"
              strokeWidth="18"
              strokeLinecap="round"
            />
            <path
              d="M 70 35 A 80 80 0 0 1 130 35"
              fill="none"
              stroke="#f59e0b"
              strokeWidth="18"
            />
            <path
              d="M 130 35 A 80 80 0 0 1 180 100"
              fill="none"
              stroke="#f43f5e"
              strokeWidth="18"
              strokeLinecap="round"
            />

            {/* Pivot Point & Animated Needle */}
            <g transform="translate(100, 100)">
              <g
                style={{
                  transform: `rotate(${angle}deg)`,
                  transition: 'transform 1.2s cubic-bezier(0.34, 1.56, 0.64, 1)',
                  transformOrigin: '0 0',
                }}
              >
                <polygon points="-4,0 0,-74 4,0" fill="#f8fafc" />
                <circle cx="0" cy="0" r="8" fill="#38bdf8" stroke="#0f172a" strokeWidth="2" />
              </g>
            </g>
          </svg>

          {/* Score Display in Arc Center */}
          <div className="absolute bottom-1 text-center">
            <span className="text-4xl font-extrabold tracking-tight text-white">{risk.fused_percentage}%</span>
            <span className="block text-[11px] font-semibold text-slate-400 uppercase tracking-wider">Composite Risk</span>
          </div>
        </div>

        {/* Dual Signals Breakdown Cards (Voice vs Intent) */}
        <div className="w-full grid grid-cols-1 sm:grid-cols-2 gap-4 mt-4 text-left">
          {/* Signal 1: DetectifAI Voice Authenticity */}
          <div className="bg-slate-800/60 p-4 rounded-xl border border-slate-700/60 hover:border-blue-500/40 transition-colors">
            <div className="flex items-center justify-between mb-1.5">
              <span className="text-xs font-semibold text-slate-400 flex items-center space-x-1.5">
                <Bot className="w-4 h-4 text-cyan-400" />
                <span>Voice Clone Signal</span>
              </span>
              <span className="text-[10px] text-cyan-400 bg-cyan-950/80 px-2 py-0.5 rounded border border-cyan-800">
                DetectifAI
              </span>
            </div>
            <div className="flex items-baseline space-x-2">
              <span className="text-2xl font-bold text-white">{risk.fake_percentage}%</span>
              <span className="text-xs text-slate-400">synthetic probability</span>
            </div>
            {/* Mini Progress Bar */}
            <div className="w-full bg-slate-700 h-2 rounded-full mt-2.5 overflow-hidden">
              <div
                className={`h-full transition-all duration-1000 ${
                  risk.fake_prob > 0.7 ? 'bg-rose-500' : risk.fake_prob > 0.3 ? 'bg-amber-400' : 'bg-emerald-400'
                }`}
                style={{ width: `${risk.fake_percentage}%` }}
              />
            </div>
            <p className="text-[11px] text-slate-400 mt-2">
              {risk.fake_prob >= 0.5 ? 'Synthetic speech acoustics detected' : 'Organic human acoustic resonance'}
            </p>
          </div>

          {/* Signal 2: LLM Scam Intent Pattern */}
          <div className="bg-slate-800/60 p-4 rounded-xl border border-slate-700/60 hover:border-indigo-500/40 transition-colors">
            <div className="flex items-center justify-between mb-1.5">
              <span className="text-xs font-semibold text-slate-400 flex items-center space-x-1.5">
                <MessageSquare className="w-4 h-4 text-indigo-400" />
                <span>Scam Coercion Signal</span>
              </span>
              <span className="text-[10px] text-indigo-400 bg-indigo-950/80 px-2 py-0.5 rounded border border-indigo-800">
                LLM Reasoning
              </span>
            </div>
            <div className="flex items-baseline space-x-2">
              <span className="text-2xl font-bold text-white">{risk.scam_percentage}%</span>
              <span className="text-xs text-slate-400">extortion intent</span>
            </div>
            {/* Mini Progress Bar */}
            <div className="w-full bg-slate-700 h-2 rounded-full mt-2.5 overflow-hidden">
              <div
                className={`h-full transition-all duration-1000 ${
                  risk.scam_score > 0.7 ? 'bg-rose-500' : risk.scam_score > 0.3 ? 'bg-amber-400' : 'bg-emerald-400'
                }`}
                style={{ width: `${risk.scam_percentage}%` }}
              />
            </div>
            <p className="text-[11px] text-slate-400 mt-2">
              {risk.scam_score >= 0.5 ? 'Urgency, secrecy or financial extortion patterns' : 'Normal benign conversational flow'}
            </p>
          </div>
        </div>

        {/* Fusion Weighting Explanation Note */}
        <p className="text-[11px] text-slate-500 mt-4 italic">
          * Fused Risk Formula: (50% DetectifAI Voice Authenticity + 50% LLM Coercion Reasoning). High risk triggered if Voice &gt; 85% or Composite &ge; 70%.
        </p>
      </div>
    </div>
  );
};
