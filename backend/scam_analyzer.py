import os
import re
import json
import logging
import httpx

logger = logging.getLogger("unclone.scam_analyzer")

GEMINI_API_KEY = os.getenv("GEMINI_API_KEY", "")

SYSTEM_PROMPT = """You are a fraud-prevention analyst. Read this call transcript and return ONLY valid JSON:
{
  "scam_score": 0.0-1.0,
  "tactics": ["urgency", "secrecy", "money request", "gift card/crypto/UPI", "claims phone is broken", "impersonates police/lawyer"],
  "reasons": ["short plain-language reason", "..."],
  "advice": ["step 1", "step 2"]
}
Be conservative: if there is no money request or pressure, score low.
Do not wrap your response in markdown code blocks or add extra commentary. Return pure JSON only.
"""

def clean_json_string(raw: str) -> str:
    """Strips markdown code fences and whitespace from LLM output."""
    cleaned = raw.strip()
    if cleaned.startswith("```"):
        # Remove opening ```json or ```
        cleaned = re.sub(r"^```(?:json)?\s*", "", cleaned)
        # Remove closing ```
        cleaned = re.sub(r"\s*```$", "", cleaned)
    return cleaned.strip()


async def analyze_with_llm(transcript: str) -> dict:
    """
    Sends call transcript to Google Gemini API (or uses heuristic NLP fallback).
    Returns parsed dictionary with scam_score, tactics, reasons, and advice.
    """
    if not transcript or not transcript.strip():
        return {
            "scam_score": 0.0,
            "tactics": [],
            "reasons": ["No speech detected in audio clip."],
            "advice": ["Ensure microphone is working and speak clearly."]
        }

    # 1. Try Gemini API if key is configured
    if GEMINI_API_KEY and GEMINI_API_KEY != "your_gemini_api_key_here":
        try:
            # We can use Gemini REST API endpoint directly for maximum compatibility
            gemini_url = f"https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key={GEMINI_API_KEY}"
            payload = {
                "contents": [
                    {
                        "parts": [
                            {"text": f"{SYSTEM_PROMPT}\n\nCall Transcript to analyze:\n\"{transcript}\""}
                        ]
                    }
                ],
                "generationConfig": {
                    "temperature": 0.1,
                    "responseMimeType": "application/json"
                }
            }
            
            async with httpx.AsyncClient(timeout=30.0) as client:
                res = await client.post(gemini_url, json=payload)
                if res.status_code == 200:
                    data = res.json()
                    candidates = data.get("candidates", [])
                    if candidates:
                        text_content = candidates[0].get("content", {}).get("parts", [{}])[0].get("text", "")
                        clean_text = clean_json_string(text_content)
                        parsed = json.loads(clean_text)
                        
                        return {
                            "scam_score": float(parsed.get("scam_score", 0.0)),
                            "tactics": list(parsed.get("tactics", [])),
                            "reasons": list(parsed.get("reasons", [])),
                            "advice": list(parsed.get("advice", [])),
                            "engine": "gemini-1.5-flash"
                        }
        except Exception as e:
            logger.warning(f"Gemini API analysis failed: {e}. Falling back to rule-based NLP.")

    # 2. Rule-based NLP fallback engine
    return heuristic_scam_analysis(transcript)


def heuristic_scam_analysis(transcript: str) -> dict:
    """
    Robust rule-based heuristic scam analyzer detecting panic, urgency,
    financial coercion, and identity spoofing indicators.
    """
    t_lower = transcript.lower()
    
    tactics = []
    reasons = []
    scam_score = 0.05

    # Check Urgency
    urgency_words = ["right now", "immediately", "hurry", "asap", "emergency", "fast", "before it's too late", "quick"]
    if any(w in t_lower for w in urgency_words):
        tactics.append("urgency")
        reasons.append("High urgency and panic language demanding immediate action.")
        scam_score += 0.25

    # Check Secrecy
    secrecy_words = ["don't tell", "do not tell", "keep this secret", "between you and me", "nobody can know", "quiet"]
    if any(w in t_lower for w in secrecy_words):
        tactics.append("secrecy")
        reasons.append("Coercive secrecy: instructed not to contact other family members or authorities.")
        scam_score += 0.30

    # Check Money / Funds Request
    money_words = ["wire", "bail", "send money", "transfer", "cash", "dollars", "rupees", "funds", "pay", "fee"]
    if any(w in t_lower for w in money_words):
        tactics.append("money request")
        reasons.append("Direct demand for rapid financial transfer.")
        scam_score += 0.25

    # Check Irreversible / Unusual Payment Method
    payment_words = ["gift card", "crypto", "bitcoin", "upi", "western union", "apple card", "target card", "wire transfer"]
    if any(w in t_lower for w in payment_words):
        tactics.append("gift card/crypto/UPI")
        reasons.append("Requests non-traceable or non-reversible payment methods.")
        scam_score += 0.20

    # Check Phone Broken / Borrowed Phone
    broken_phone_words = ["phone broke", "broken phone", "borrowed phone", "lost my phone", "calling from a friend", "different number"]
    if any(w in t_lower for w in broken_phone_words):
        tactics.append("claims phone is broken")
        reasons.append("Excuses why the call is coming from an unfamiliar number.")
        scam_score += 0.15

    # Check Authority / Police / Hospital Impersonation
    impersonate_words = ["police", "officer", "inspector", "lawyer", "attorney", "custody", "jail", "arrest", "hospital", "doctor"]
    if any(w in t_lower for w in impersonate_words):
        tactics.append("impersonates police/lawyer")
        reasons.append("Impersonation of legal or medical authority to intimidate the victim.")
        scam_score += 0.25

    # Cap score at 1.0
    scam_score = min(1.0, round(scam_score, 2))

    # Determine advice based on tactics
    advice = [
        "Hang up immediately and do not send money.",
        "Call the relative directly on the trusted phone number saved in your contacts.",
        "Ask for your pre-arranged Family Safe Word."
    ]
    if "impersonates police/lawyer" in tactics:
        advice.append("Call local police precinct on their public phone line to verify any arrest claims.")
    if "gift card/crypto/UPI" in tactics:
        advice.append("Legitimate legal or medical entities NEVER demand gift cards or direct crypto transfers.")

    if scam_score < 0.2:
        reasons = ["No aggressive urgency, secrecy, or emergency money requests detected."]
        advice = ["Normal conversational patterns detected. Standard vigilance advised."]

    return {
        "scam_score": scam_score,
        "tactics": tactics,
        "reasons": reasons,
        "advice": advice,
        "engine": "heuristic_nlp_fallback"
    }
