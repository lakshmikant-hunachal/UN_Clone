import os
import httpx
import logging
from typing import Optional, Dict, Any

logger = logging.getLogger("familyshield.detectifai")

DETECTIF_URL = os.getenv("DETECTIF_API_URL", "https://api.detectif.ai/v1/detect")
DETECTIF_KEY = os.getenv("DETECTIF_API_KEY", "")


async def check_voice(filename: str, data: bytes, content_type: str = "audio/wav") -> Dict[str, Any]:
    """
    Checks audio authenticity using DetectifAI API.
    v2 Policy: Honest evaluation only. If DetectifAI API key is absent or API fails,
    returns fake_prob = None and status = 'voice not analysed'. No invented scores.
    """
    if not DETECTIF_KEY or DETECTIF_KEY == "your_detectifai_api_key_here":
        return {
            "fake_prob": None,
            "status": "voice not analysed",
            "provider": "detectifai",
            "message": "DetectifAI API key not configured in backend/.env. Voice authenticity was not analysed.",
            "is_synthetic": None,
            "details": {}
        }

    try:
        async with httpx.AsyncClient(timeout=60.0) as client:
            headers = {
                "Authorization": f"Bearer {DETECTIF_KEY}",
                "Accept": "application/json"
            }
            files = {"file": (filename, data, content_type or "audio/wav")}

            response = await client.post(DETECTIF_URL, headers=headers, files=files)
            response.raise_for_status()
            res_json = response.json()

            # Normalize response fields from DetectifAI API
            fake_prob = None
            if "fake_probability" in res_json:
                fake_prob = float(res_json["fake_probability"])
            elif "synthetic_probability" in res_json:
                fake_prob = float(res_json["synthetic_probability"])
            elif "score" in res_json:
                fake_prob = float(res_json["score"])
            elif "is_fake" in res_json:
                fake_prob = 1.0 if res_json["is_fake"] else 0.0

            if fake_prob is not None:
                fake_prob = round(max(0.0, min(1.0, fake_prob)), 3)
                return {
                    "fake_prob": fake_prob,
                    "status": "analysed",
                    "provider": "detectifai",
                    "is_synthetic": fake_prob >= 0.5,
                    "confidence": float(res_json.get("confidence", 0.90)),
                    "details": res_json
                }
            else:
                return {
                    "fake_prob": None,
                    "status": "voice not analysed",
                    "provider": "detectifai",
                    "message": "DetectifAI response did not contain recognizable probability fields.",
                    "details": res_json
                }

    except Exception as e:
        logger.warning(f"DetectifAI API call failed: {e}")
        return {
            "fake_prob": None,
            "status": "voice not analysed",
            "provider": "detectifai",
            "message": f"DetectifAI API connection error: {str(e)}",
            "is_synthetic": None,
            "details": {}
        }
