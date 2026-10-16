"""
Risk Fusion Module for FamilyShield AI
Implements honest risk fusion:
- Voice + Text: 0.5 * fake_prob + 0.5 * scam_score (only when voice was actually analysed)
- Text only or Voice Not Analysed: scam_score alone, clearly labelled 'voice not analysed'
"""

from typing import Optional, Dict, Any


def fuse_risk(fake_prob: Optional[float], scam_score: float) -> Dict[str, Any]:
    """
    Fuses voice deepfake probability and scam pattern score.
    If fake_prob is None, calculates risk purely from text/intent analysis
    and explicitly flags that voice was not analysed.
    """
    voice_analysed = fake_prob is not None

    if voice_analysed:
        fused_score = round(0.5 * fake_prob + 0.5 * scam_score, 3)
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
            "fused_score": fused_score,
            "fused_percentage": round(fused_score * 100, 1),
            "fake_prob": round(fake_prob, 3),
            "fake_percentage": round(fake_prob * 100, 1),
            "scam_score": round(scam_score, 3),
            "scam_percentage": round(scam_score * 100, 1),
            "voice_analysed": True,
            "mode_label": "Voice + Text Fusion",
            "summary": summary
        }
    else:
        # Text-only or voice not analysed
        fused_score = round(scam_score, 3)
        if scam_score >= 0.7:
            risk_level = "HIGH"
            color = "red"
            summary = "CRITICAL WARNING: High-pressure extortion and emergency scam coercion patterns detected (text-only; voice not analysed)."
        elif scam_score >= 0.4:
            risk_level = "MEDIUM"
            color = "amber"
            summary = "SUSPICIOUS: Urgent pressure or unusual financial demand detected (text-only; voice not analysed)."
        else:
            risk_level = "LOW"
            color = "green"
            summary = "LOW RISK: No scam patterns, financial demands, or coercion detected in text (voice not analysed)."

        return {
            "risk_level": risk_level,
            "color": color,
            "fused_score": fused_score,
            "fused_percentage": round(fused_score * 100, 1),
            "fake_prob": None,
            "fake_percentage": None,
            "scam_score": round(scam_score, 3),
            "scam_percentage": round(scam_score * 100, 1),
            "voice_analysed": False,
            "mode_label": "Text-Only (voice not analysed)",
            "summary": summary
        }
