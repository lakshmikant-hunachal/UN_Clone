import { AnalysisResult } from '../types';

export interface DemoItem {
  id: string;
  title: string;
  relation: string;
  callerDesc: string;
  expectedRisk: 'HIGH' | 'MEDIUM' | 'LOW';
  audioFileName: string;
  transcript: string;
  mockResult: AnalysisResult;
}

export const DEMO_SCENARIOS: DemoItem[] = [
  {
    id: 'accident_scam',
    title: 'Grandson Highway Crash & Bail Coercion',
    relation: 'Grandson',
    callerDesc: 'Cloned voice of college student grandson claiming accident',
    expectedRisk: 'HIGH',
    audioFileName: 'grandson_accident_scam.wav',
    transcript: "Grandma? It's me, please don't hang up! I was in a terrible car accident on the highway. My friend's car is completely totaled and the police have me at the station right now. My phone broke in the crash so I'm calling from this borrowed phone. The officer said if I pay five thousand dollars bail right now through UPI or wire transfer, they won't throw me in county jail! Please don't tell mom and dad, they'll kill me! Send it right now!",
    mockResult: {
      success: true,
      timestamp: new Date().toISOString(),
      filename: 'grandson_accident_scam.wav',
      claimed_relation: 'Grandson',
      risk: {
        risk_level: 'HIGH',
        color: 'red',
        fused_score: 0.94,
        fused_percentage: 94.0,
        fake_prob: 0.93,
        fake_percentage: 93.0,
        scam_score: 0.95,
        scam_percentage: 95.0,
        summary: 'CRITICAL THREAT: Neural voice synthesis artifacts detected (93% fake probability) combined with classic emergency extortion coercion.'
      },
      voice: {
        fake_prob: 0.93,
        is_synthetic: true,
        confidence: 0.96,
        provider: 'DetectifAI Foundation API v1',
        details: {
          synthetic_model: 'ElevenLabs/FastPitch neural vocoder match',
          phase_coherence: 0.12,
          room_impulse_response: 'Missing organic reverberation'
        }
      },
      scam: {
        scam_score: 0.95,
        tactics: [
          'urgency',
          'secrecy',
          'money request',
          'gift card/crypto/UPI',
          'claims phone is broken',
          'impersonates police/lawyer'
        ],
        reasons: [
          'High panic & urgency: "right now", "won\'t throw me in jail"',
          'Extreme secrecy demand: explicitly orders victim not to tell parents',
          'Immediate non-reversible money transfer requested via UPI/wire',
          'Excuse for unfamiliar phone number: "phone broke in crash"'
        ],
        advice: [
          'Hang up immediately! Do NOT transfer any money.',
          'Call your grandson back on the number saved in your phone address book.',
          'Ask for the pre-arranged Family Safe-Word.',
          'Call his parents directly to verify his physical location.'
        ],
        engine: 'Gemini 1.5 Fraud Reasoning'
      },
      transcript: "Grandma? It's me, please don't hang up! I was in a terrible car accident on the highway. My friend's car is completely totaled and the police have me at the station right now. My phone broke in the crash so I'm calling from this borrowed phone. The officer said if I pay five thousand dollars bail right now through UPI or wire transfer, they won't throw me in county jail! Please don't tell mom and dad, they'll kill me! Send it right now!",
      action_checklist: [
        '1. Hang up immediately. Do not stay on the phone.',
        '2. Call back on the known, trusted number saved in your contacts (never press redial).',
        '3. Ask the family member for your pre-arranged Family Safe Word.',
        '4. Call other family members to independently verify whereabouts.',
        '5. Call the National Cyber Crime Helpline 1930 immediately or visit cybercrime.gov.in.'
      ]
    }
  },
  {
    id: 'police_narcotics',
    title: 'Police Narcotics Custody Extortion Call',
    relation: 'Police / Authority',
    callerDesc: 'Aggressive caller impersonating police officer claiming son arrested',
    expectedRisk: 'HIGH',
    audioFileName: 'police_custody_extortion.wav',
    transcript: "Listen carefully. This is Inspector Sharma from Central Police Headquarters. Your son has been detained in connection with an illegal narcotics consignment. He is sobbing right here. If you want him released without an FIR, you must transfer fifty thousand rupees immediately via crypto or digital UPI payment. Do not inform anyone or disconnect this line, or we will remand him into custody.",
    mockResult: {
      success: true,
      timestamp: new Date().toISOString(),
      filename: 'police_custody_extortion.wav',
      claimed_relation: 'Police / Authority',
      risk: {
        risk_level: 'HIGH',
        color: 'red',
        fused_score: 0.88,
        fused_percentage: 88.0,
        fake_prob: 0.82,
        fake_percentage: 82.0,
        scam_score: 0.94,
        scam_percentage: 94.0,
        summary: 'CRITICAL THREAT: Law enforcement impersonation with digital extortion and criminal remand threats.'
      },
      voice: {
        fake_prob: 0.82,
        is_synthetic: true,
        confidence: 0.91,
        provider: 'DetectifAI Foundation API v1',
        details: {
          background_noise_profile: 'Synthetic police station background track looping',
          pitch_variance: 'Synthesized voice clone with emotional distortion'
        }
      },
      scam: {
        scam_score: 0.94,
        tactics: [
          'urgency',
          'secrecy',
          'money request',
          'gift card/crypto/UPI',
          'impersonates police/lawyer'
        ],
        reasons: [
          'Official impersonation: falsely claims to be a Police Inspector',
          'Severe coercion: threatens arrest and FIR unless payment is sent',
          'Demands instant digital transfer to personal/unverified UPI'
        ],
        advice: [
          'Hang up immediately! Indian Police NEVER accept UPI/crypto for bail over the phone.',
          'Call your local police station using their verified directory number.',
          'Call your son directly to confirm his safety.',
          'Report the caller phone number to Cyber Crime helpline 1930.'
        ],
        engine: 'Gemini 1.5 Fraud Reasoning'
      },
      transcript: "Listen carefully. This is Inspector Sharma from Central Police Headquarters. Your son has been detained in connection with an illegal narcotics consignment. He is sobbing right here. If you want him released without an FIR, you must transfer fifty thousand rupees immediately via crypto or digital UPI payment. Do not inform anyone or disconnect this line, or we will remand him into custody.",
      action_checklist: [
        '1. Hang up immediately. Police cannot settle cases over telephone UPI.',
        '2. Call your son directly on his normal phone number.',
        '3. Dial 1930 or local police control room 112 to verify.',
        '4. Never send money to digital wallets during unsolicited calls.'
      ]
    }
  },
  {
    id: 'legit_daughter',
    title: 'Genuine Daughter University Check-in',
    relation: 'Son / Daughter',
    callerDesc: 'Authentic human voice message checking in after class',
    expectedRisk: 'LOW',
    audioFileName: 'daughter_university_checkin.wav',
    transcript: "Hi Mom! Just finished my afternoon classes at university and wanted to check in. I'm heading to the library with Sarah and then cooking dinner at the dorm tonight. Love you, call me back when you get this!",
    mockResult: {
      success: true,
      timestamp: new Date().toISOString(),
      filename: 'daughter_university_checkin.wav',
      claimed_relation: 'Son / Daughter',
      risk: {
        risk_level: 'LOW',
        color: 'green',
        fused_score: 0.05,
        fused_percentage: 5.0,
        fake_prob: 0.06,
        fake_percentage: 6.0,
        scam_score: 0.04,
        scam_percentage: 4.0,
        summary: 'VERIFIED SAFE: Natural human speech prosody with zero financial pressure or deception tactics.'
      },
      voice: {
        fake_prob: 0.06,
        is_synthetic: false,
        confidence: 0.98,
        provider: 'DetectifAI Foundation API v1',
        details: {
          acoustic_authenticity: 'Organic respiratory pauses and natural vocal tract resonances verified'
        }
      },
      scam: {
        scam_score: 0.04,
        tactics: [],
        reasons: [
          'No urgent pressure or demands for secrecy',
          'No requests for money, bail, or wire transfers',
          'Healthy, relaxed conversational cadence'
        ],
        advice: [
          'Audio appears completely benign. You can safely call back when free.'
        ],
        engine: 'Gemini 1.5 Fraud Reasoning'
      },
      transcript: "Hi Mom! Just finished my afternoon classes at university and wanted to check in. I'm heading to the library with Sarah and then cooking dinner at the dorm tonight. Love you, call me back when you get this!",
      action_checklist: [
        'Call back when convenient. Standard everyday vigilance is sufficient.'
      ]
    }
  }
];
