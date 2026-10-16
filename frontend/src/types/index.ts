export type RiskLevel = 'HIGH' | 'MEDIUM' | 'LOW';

export interface VoiceResult {
  fake_prob: number;
  is_synthetic: boolean;
  confidence: number;
  provider: string;
  details?: Record<string, any>;
}

export interface ScamResult {
  scam_score: number;
  tactics: string[];
  reasons: string[];
  advice: string[];
  engine: string;
}

export interface RiskFusionResult {
  risk_level: RiskLevel;
  color: 'red' | 'amber' | 'green';
  fused_score: number;
  fused_percentage: number;
  fake_prob: number;
  fake_percentage: number;
  scam_score: number;
  scam_percentage: number;
  summary: string;
}

export interface AnalysisResult {
  success: boolean;
  timestamp: string;
  filename: string;
  claimed_relation?: string;
  risk: RiskFusionResult;
  voice: VoiceResult;
  scam: ScamResult;
  transcript: string;
  action_checklist: string[];
  audioBlobUrl?: string;
}

export interface FamilyMember {
  id: string;
  name: string;
  relation: string;
  phone: string;
  safeWordHint: string;
  voiceEnrolled: boolean;
  notes?: string;
}

export interface QuizScenario {
  id: number;
  title: string;
  caller: string;
  situation: string;
  transcript: string;
  riskLevel: RiskLevel;
  options: string[];
  correctIndex: number;
  explanation: string;
}

export type Language = 'en' | 'hi' | 'kn';
