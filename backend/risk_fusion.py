"""
Risk Fusion Module for UNclone Agent
Implements Step 6 from the build guide:
Fuses Voice Authenticity Score (DetectifAI) and Scam Pattern Intent (LLM).
"""

def fuse_risk(fake_prob: float, scam_score: float) -> dict:
    """
    Fuses voice deepfake probability and scam pattern score.
    
    Weights:
      50% Voice Authenticity Probability
      50% NLP Scam Pattern Score
      
    Thresholds:
      - HIGH: fake_prob > 0.85 OR fused_score >= 0.7
      - MEDIUM: fused_score >= 0.4
      - LOW: otherwise
    """
    fused_score = 0.5 * fake_prob + 0.5 * scam_score
    
    if fake_prob > 0.85 or fused_score >= 0.7:
        risk_level = "HIGH"
        color = "red"
        summary = "CRITICAL WARNING: High probability of AI voice clone and emergency scam coercion."
    elif fused_score >= 0.4:
        risk_level = "MEDIUM"
        color = "amber"
        summary = "SUSPICIOUS: Potential synthetic artifacts or high-pressure tactics detected."
    else:
        risk_level = "LOW"
        color = "green"
        summary = "LOW RISK: Natural voice characteristics and no scam patterns identified."

    return {
        "risk_level": risk_level,
        "color": color,
        "fused_score": round(fused_score, 3),
        "fused_percentage": round(fused_score * 100, 1),
        "fake_prob": round(fake_prob, 3),
        "fake_percentage": round(fake_prob * 100, 1),
        "scam_score": round(scam_score, 3),
        "scam_percentage": round(scam_score * 100, 1),
        "summary": summary
    }
