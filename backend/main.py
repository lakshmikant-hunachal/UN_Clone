import os
import time
from datetime import datetime
from typing import Optional
from fastapi import FastAPI, UploadFile, File, Form, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from dotenv import load_dotenv

# Load local environment variables
load_dotenv()

from detectifai_service import check_voice
from transcriber import transcribe_audio
from scam_analyzer import analyze_with_llm
from risk_fusion import fuse_risk

app = FastAPI(
    title="UNclone Agent Backend API",
    description="Defensive AI agent protecting families against voice-clone and fake-relative emergency scams.",
    version="1.0.0"
)

# Enable CORS for local Next.js frontend
allowed_origins_raw = os.getenv("ALLOWED_ORIGINS", "http://localhost:3000,http://127.0.0.1:3000")
origins = [o.strip() for o in allowed_origins_raw.split(",") if o.strip()]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins if origins else ["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


class TextAnalyzeRequest(BaseModel):
    transcript: str
    fake_prob: Optional[float] = 0.5


class ReportRequest(BaseModel):
    incident_date: Optional[str] = None
    caller_claimed_identity: Optional[str] = None
    caller_phone: Optional[str] = None
    transcript: str
    risk_level: str
    fake_prob: float
    scam_score: float
    tactics: list[str]
    notes: Optional[str] = ""


@app.get("/")
def read_root():
    return {
        "app": "UNclone Agent Backend",
        "status": "operational",
        "documentation": "/docs",
        "endpoints": ["/analyze", "/analyze-text", "/report/generate", "/health"]
    }


@app.get("/health")
def health_check():
    detectif_key_set = bool(os.getenv("DETECTIF_API_KEY") and os.getenv("DETECTIF_API_KEY") != "your_detectifai_api_key_here")
    gemini_key_set = bool(os.getenv("GEMINI_API_KEY") and os.getenv("GEMINI_API_KEY") != "your_gemini_api_key_here")
    
    return {
        "status": "ok",
        "timestamp": datetime.utcnow().isoformat(),
        "providers": {
            "detectifai_configured": detectif_key_set,
            "gemini_configured": gemini_key_set,
            "whisper_model": os.getenv("WHISPER_MODEL_SIZE", "base")
        }
    }


@app.post("/analyze")
async def analyze(
    audio: UploadFile = File(...),
    claimed_relation: Optional[str] = Form(None)
):
    """
    Core analysis pipeline:
    1. Reads audio file bytes.
    2. DetectifAI API -> fake_probability & synthetic analysis.
    3. Faster-Whisper -> full transcript.
    4. Gemini LLM -> scam score, tactics, reasons, and advice.
    5. Risk Fusion -> composite score & LOW / MEDIUM / HIGH risk rating.
    """
    try:
        # File size safety limit (15MB)
        contents = await audio.read()
        if len(contents) > 15 * 1024 * 1024:
            raise HTTPException(status_code=400, detail="Audio file exceeds 15MB limit.")
        
        # 1. Voice authenticity check
        voice_result = await check_voice(audio.filename or "call.wav", contents, audio.content_type or "audio/wav")
        fake_prob = voice_result.get("fake_prob", 0.0)
        
        # 2. Transcription
        transcript = transcribe_audio(contents, audio.filename or "call.wav")
        
        # 3. LLM Scam Reasoning
        scam_result = await analyze_with_llm(transcript)
        scam_score = scam_result.get("scam_score", 0.0)
        
        # 4. Step 6 Risk Fusion
        fusion = fuse_risk(fake_prob, scam_score)
        
        # 5. Assemble plain-language action checklist
        action_checklist = [
            "1. Hang up immediately. Do not stay on the line.",
            "2. Call back on the known, trusted number saved in your contacts (never press redial).",
            "3. Ask the family member for your pre-arranged Family Safe Word.",
            "4. Call other family members to independently verify whereabouts."
        ]
        if fusion["risk_level"] == "HIGH":
            action_checklist.append("5. If funds were already transferred, call the National Cyber Crime Helpline 1930 immediately or visit cybercrime.gov.in.")

        return {
            "success": True,
            "timestamp": datetime.utcnow().isoformat(),
            "filename": audio.filename,
            "claimed_relation": claimed_relation,
            "risk": fusion,
            "voice": voice_result,
            "scam": scam_result,
            "transcript": transcript,
            "action_checklist": action_checklist
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Analysis pipeline error: {str(e)}")


@app.post("/analyze-text")
async def analyze_text(payload: TextAnalyzeRequest):
    """Allows testing LLM scam-pattern analysis and risk fusion directly on text transcripts."""
    scam_result = await analyze_with_llm(payload.transcript)
    fake_prob = payload.fake_prob or 0.0
    scam_score = scam_result.get("scam_score", 0.0)
    fusion = fuse_risk(fake_prob, scam_score)
    
    return {
        "success": True,
        "risk": fusion,
        "scam": scam_result,
        "transcript": payload.transcript
    }


@app.post("/report/generate")
async def generate_report(payload: ReportRequest):
    """
    Generates a structured incident dossier for Indian Cybercrime Portal (cybercrime.gov.in / 1930)
    or bank emergency fraud teams.
    """
    report_id = f"UNC-{int(time.time())}"
    generated_at = datetime.utcnow().strftime("%Y-%m-%d %H:%M:%S UTC")
    
    markdown_content = f"""# UNclone Agent - Cyber Crime Incident Dossier
**Report Reference:** {report_id}
**Date & Time of Generation:** {generated_at}
**Incident Timestamp:** {payload.incident_date or 'Immediate'}
**Target Identity / Claimed Caller:** {payload.caller_claimed_identity or 'Unspecified Family Member'}
**Caller Phone Number:** {payload.caller_phone or 'Unknown / Spoofed / Private'}

---

## 1. Forensic Assessment Summary
- **Overall Threat Level:** {payload.risk_level}
- **Voice Clone / Synthetic Probability:** {round(payload.fake_prob * 100, 1)}%
- **Scam Coercion Intent Score:** {round(payload.scam_score * 100, 1)}%
- **Identified Scam Tactics:** {', '.join(payload.tactics) if payload.tactics else 'None detected'}

---

## 2. Audio Transcript Record
"{payload.transcript}"

---

## 3. Recommended Official Actions (India Helpline 1930 / cybercrime.gov.in)
1. File immediate complaint on https://cybercrime.gov.in under 'Financial Fraud / Voice Impersonation'.
2. Dial 1930 within the 'Golden Hour' (first 2 hours) to freeze unauthorized beneficiary bank accounts.
3. Submit this electronic dossier along with call logs and transaction receipts.
4. Notify telecom operator regarding the calling number for spoofing investigation.

---
*Notice: This report was compiled by UNclone Agent forensic verification platform for official evidence preservation.*
"""
    return {
        "report_id": report_id,
        "generated_at": generated_at,
        "markdown": markdown_content
    }


if __name__ == "__main__":
    import uvicorn
    port = int(os.getenv("PORT", 8000))
    uvicorn.run("main:app", host="0.0.0.0", port=port, reload=True)
