export type RiskLevel = 'HIGH' | 'MEDIUM' | 'LOW';

export interface ExtractedData {
  caller_claims_to_be?: string | null;
  caller_name?: string | null;
  situation?: string | null;
  money_demanded?: string | null;
  payment_method?: string | null;
  upi_id?: string | null;
  phone_number?: string | null;
  deadline_pressure?: string | null;
  secrecy_coercion?: string | null;
  links?: string[];
  masked_bank_account?: string | null;
}

export interface VoiceResult {
  fake_prob: number | null;
  status: string; // 'analysed' | 'voice not analysed'
  is_synthetic?: boolean | null;
  confidence?: number;
  provider: string;
  message?: string;
  details?: Record<string, any>;
}

export interface ScamResult {
  scam_score: number;
  tactics: string[];
  reasons: string[];
  advice: string[];
  extracted?: ExtractedData;
  engine: string;
}

export interface RiskFusionResult {
  risk_level: RiskLevel;
  color: 'red' | 'amber' | 'green';
  fused_score: number;
  fused_percentage: number;
  fake_prob: number | null;
  fake_percentage: number | null;
  scam_score: number;
  scam_percentage: number;
  voice_analysed: boolean;
  mode_label: string;
  summary: string;
}

export interface AnalysisResult {
  id?: number;
  success: boolean;
  input_type: 'text' | 'voice';
  timestamp: string;
  filename?: string;
  claimed_relation?: string;
  risk: RiskFusionResult;
  voice: VoiceResult;
  scam: ScamResult;
  transcript: string;
  extracted?: ExtractedData;
  action_checklist: string[];
  audioBlobUrl?: string;
}

export interface FamilyMember {
  id: string;
  name: string;
  relation: string;
  phone: string;
  safe_word_hint?: string;
  notes?: string;
  voice_enrolled?: boolean;
}

export interface UserProfile {
  id: number;
  name: string;
  email: string;
  safe_word: string;
}

export type Language = 'en' | 'hi' | 'kn';
