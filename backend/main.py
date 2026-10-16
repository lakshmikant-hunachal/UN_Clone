import os
import json
import time
from datetime import datetime
from typing import Optional, List, Dict, Any
from fastapi import FastAPI, UploadFile, File, Form, HTTPException, Depends, Header
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from dotenv import load_dotenv

load_dotenv()

from database import (
    register_user, login_user, decode_jwt_token, get_db,
    init_db
)
from detectifai_service import check_voice
from transcriber import transcribe_audio
from scam_analyzer import analyze_with_llm
from risk_fusion import fuse_risk

app = FastAPI(
    title="FamilyShield AI Backend API",
    description="Defensive AI voice-clone & family emergency scam detection with real data extraction and per-user storage.",
    version="2.0.0"
)

# CORS configuration
allowed_origins_raw = os.getenv("ALLOWED_ORIGINS", "http://localhost:3000,http://127.0.0.1:3000")
origins = [o.strip() for o in allowed_origins_raw.split(",") if o.strip()]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins if origins else ["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


# Authentication Dependency
def get_current_user(authorization: Optional[str] = Header(None)) -> Dict[str, Any]:
    if not authorization or not authorization.startswith("Bearer "):
        raise HTTPException(status_code=401, detail="Authentication required. Please log in.")
    token = authorization.split(" ")[1]
    payload = decode_jwt_token(token)
    if not payload:
        raise HTTPException(status_code=401, detail="Invalid or expired session token. Please log in again.")
    return payload


# Request Models
class RegisterRequest(BaseModel):
    name: str
    email: str
    password: str


class LoginRequest(BaseModel):
    email: str
    password: str


class AnalyzeTextRequest(BaseModel):
    text: str
    claimed_relation: Optional[str] = None


class VaultMemberRequest(BaseModel):
    name: str
    relation: str
    phone: str
    safe_word_hint: Optional[str] = ""
    notes: Optional[str] = ""


class GenerateReportRequest(BaseModel):
    scan_id: Optional[int] = None
    victim_name: Optional[str] = "Complainant"
    caller_phone: Optional[str] = None
    financial_loss: Optional[str] = "₹ 0 (Attempt Thwarted)"


# Public Endpoints
@app.get("/")
def read_root():
    return {
        "app": "FamilyShield AI",
        "version": "2.0.0",
        "status": "operational",
        "docs": "/docs"
    }


@app.get("/health")
def health():
    detectif_configured = bool(os.getenv("DETECTIF_API_KEY") and os.getenv("DETECTIF_API_KEY") != "your_detectifai_api_key_here")
    gemini_configured = bool(os.getenv("GEMINI_API_KEY") and os.getenv("GEMINI_API_KEY") != "your_gemini_api_key_here")
    return {
        "status": "ok",
        "timestamp": datetime.utcnow().isoformat(),
        "providers": {
            "detectifai": detectif_configured,
            "gemini": gemini_configured,
            "gemini_model": os.getenv("GEMINI_MODEL", "gemini-2.5-flash"),
            "whisper": os.getenv("WHISPER_MODEL_SIZE", "base")
        }
    }


@app.post("/auth/register")
def register(req: RegisterRequest):
    try:
        result = register_user(req.name, req.email, req.password)
        return {"success": True, **result}
    except ValueError as e:
        raise HTTPException(status_code=400, detail=str(e))
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Registration failed: {str(e)}")


@app.post("/auth/login")
def login(req: LoginRequest):
    try:
        result = login_user(req.email, req.password)
        return {"success": True, **result}
    except ValueError as e:
        raise HTTPException(status_code=401, detail=str(e))
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Login error: {str(e)}")


# Authenticated Endpoints
@app.get("/auth/me")
def get_me(user: dict = Depends(get_current_user)):
    conn = get_db()
    cursor = conn.cursor()
    cursor.execute("SELECT id, name, email, safe_word, created_at FROM users WHERE id = ?", (user["user_id"],))
    u = cursor.fetchone()
    conn.close()
    if not u:
        raise HTTPException(status_code=404, detail="User not found.")
    return {
        "id": u["id"],
        "name": u["name"],
        "email": u["email"],
        "safe_word": u["safe_word"]
    }


@app.post("/analyze-text")
async def analyze_text_endpoint(
    req: AnalyzeTextRequest,
    user: dict = Depends(get_current_user)
):
    """Analyzes pasted text, extracts forensic fields, calculates honest risk, and saves to user history."""
    clean_text = req.text.strip()
    if not clean_text:
        raise HTTPException(status_code=400, detail="Text cannot be empty.")
    if len(clean_text) > 10000:
        raise HTTPException(status_code=400, detail="Text exceeds 10,000 character limit.")

    # 1. NLP Scam & Structured Extraction
    scam_res = await analyze_with_llm(clean_text)

    # 2. Honest Risk Fusion (Text-only: voice not analysed)
    fusion = fuse_risk(fake_prob=None, scam_score=scam_res["scam_score"])

    # 3. Dynamic Checklist
    extracted = scam_res.get("extracted", {})
    action_checklist = [
        "1. Hang up or do not reply. Never stay engaged under pressure.",
        "2. Call back on the number saved in your phone (never dial back an unknown incoming ID).",
        "3. Ask the caller for your private Family Safe-Word."
    ]
    if extracted.get("upi_id"):
        action_checklist.append(f"4. WARNING: Do NOT transfer funds to UPI ID '{extracted['upi_id']}'.")
    if extracted.get("links"):
        action_checklist.append("5. WARNING: Do NOT open or click any links in this message.")
    if fusion["risk_level"] == "HIGH":
        action_checklist.append("6. If funds were transferred, dial 1930 immediately or visit cybercrime.gov.in.")

    timestamp = datetime.utcnow().isoformat()

    # 4. Save to user's database history
    conn = get_db()
    cursor = conn.cursor()
    cursor.execute(
        """
        INSERT INTO scans (
            user_id, input_type, raw_input, transcript, audio_filename,
            risk_level, fused_score, fake_prob, scam_score, tactics,
            reasons, extracted_data, voice_status, timestamp
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
        """,
        (
            user["user_id"],
            "text",
            clean_text,
            clean_text,
            None,
            fusion["risk_level"],
            fusion["fused_score"],
            None,
            scam_res["scam_score"],
            json.dumps(scam_res.get("tactics", [])),
            json.dumps(scam_res.get("reasons", [])),
            json.dumps(extracted),
            "voice not analysed",
            timestamp
        )
    )
    scan_id = cursor.lastrowid
    conn.commit()
    conn.close()

    return {
        "id": scan_id,
        "success": True,
        "input_type": "text",
        "timestamp": timestamp,
        "claimed_relation": req.claimed_relation,
        "risk": fusion,
        "voice": {
            "fake_prob": None,
            "status": "voice not analysed",
            "message": "Text-only analysis: voice authenticity not analysed."
        },
        "scam": scam_res,
        "transcript": clean_text,
        "extracted": extracted,
        "action_checklist": action_checklist
    }


@app.post("/analyze")
async def analyze_audio_endpoint(
    audio: UploadFile = File(...),
    claimed_relation: Optional[str] = Form(None),
    user: dict = Depends(get_current_user)
):
    """
    Analyzes uploaded audio or live microphone recording:
    1. Checks voice authenticity with DetectifAI (returns 'voice not analysed' if key missing).
    2. Transcribes with Faster-Whisper.
    3. Extracts structured data via Gemini.
    4. Calculates fused score.
    5. Saves scan to user history. Audio files are NEVER stored on disk.
    """
    try:
        contents = await audio.read()
        if len(contents) > 15 * 1024 * 1024:
            raise HTTPException(status_code=400, detail="Audio file exceeds 15 MB limit.")

        # 1. Voice check
        voice_res = await check_voice(audio.filename or "call.wav", contents, audio.content_type or "audio/wav")
        fake_prob = voice_res.get("fake_prob")

        # 2. Transcription
        transcript = transcribe_audio(contents, audio.filename or "call.wav")

        # 3. Structured Data Extraction & Scam Analysis
        scam_res = await analyze_with_llm(transcript)
        scam_score = scam_res.get("scam_score", 0.0)

        # 4. Risk Fusion
        fusion = fuse_risk(fake_prob=fake_prob, scam_score=scam_score)

        # 5. Checklist
        extracted = scam_res.get("extracted", {})
        action_checklist = [
            "1. Hang up immediately. Do not stay on the phone.",
            "2. Call back on the known number saved in your phone address book.",
            "3. Ask the caller for your private Family Safe-Word.",
            "4. Call other family members to independently verify whereabouts."
        ]
        if extracted.get("upi_id"):
            action_checklist.append(f"5. WARNING: Do NOT transfer funds to UPI ID '{extracted['upi_id']}'.")
        if fusion["risk_level"] == "HIGH":
            action_checklist.append("6. Dial National Cyber Helpline 1930 immediately or visit cybercrime.gov.in.")

        timestamp = datetime.utcnow().isoformat()

        # 6. Save to user history
        conn = get_db()
        cursor = conn.cursor()
        cursor.execute(
            """
            INSERT INTO scans (
                user_id, input_type, raw_input, transcript, audio_filename,
                risk_level, fused_score, fake_prob, scam_score, tactics,
                reasons, extracted_data, voice_status, timestamp
            ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
            """,
            (
                user["user_id"],
                "voice",
                transcript,
                transcript,
                audio.filename,
                fusion["risk_level"],
                fusion["fused_score"],
                fake_prob,
                scam_score,
                json.dumps(scam_res.get("tactics", [])),
                json.dumps(scam_res.get("reasons", [])),
                json.dumps(extracted),
                voice_res.get("status", "analysed"),
                timestamp
            )
        )
        scan_id = cursor.lastrowid
        conn.commit()
        conn.close()

        return {
            "id": scan_id,
            "success": True,
            "input_type": "voice",
            "timestamp": timestamp,
            "filename": audio.filename,
            "claimed_relation": claimed_relation,
            "risk": fusion,
            "voice": voice_res,
            "scam": scam_res,
            "transcript": transcript,
            "extracted": extracted,
            "action_checklist": action_checklist
        }

    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@app.get("/scans")
def get_user_scans(user: dict = Depends(get_current_user)):
    """Returns only the authenticated user's scan history from SQLite."""
    conn = get_db()
    cursor = conn.cursor()
    cursor.execute(
        """
        SELECT id, input_type, raw_input, transcript, audio_filename,
               risk_level, fused_score, fake_prob, scam_score, tactics,
               reasons, extracted_data, voice_status, timestamp
        FROM scans WHERE user_id = ? ORDER BY id DESC
        """,
        (user["user_id"],)
    )
    rows = cursor.fetchall()
    conn.close()

    scans = []
    for r in rows:
        scans.append({
            "id": r["id"],
            "input_type": r["input_type"],
            "transcript": r["transcript"],
            "audio_filename": r["audio_filename"],
            "risk_level": r["risk_level"],
            "fused_score": r["fused_score"],
            "fake_prob": r["fake_prob"],
            "scam_score": r["scam_score"],
            "tactics": json.loads(r["tactics"]) if r["tactics"] else [],
            "reasons": json.loads(r["reasons"]) if r["reasons"] else [],
            "extracted": json.loads(r["extracted_data"]) if r["extracted_data"] else {},
            "voice_status": r["voice_status"],
            "timestamp": r["timestamp"]
        })
    return scans


@app.get("/scans/{scan_id}")
def get_single_scan(scan_id: int, user: dict = Depends(get_current_user)):
    """Fetches a specific scan, ensuring one user cannot access another's scans."""
    conn = get_db()
    cursor = conn.cursor()
    cursor.execute(
        """
        SELECT id, input_type, raw_input, transcript, audio_filename,
               risk_level, fused_score, fake_prob, scam_score, tactics,
               reasons, extracted_data, voice_status, timestamp
        FROM scans WHERE id = ? AND user_id = ?
        """,
        (scan_id, user["user_id"])
    )
    r = cursor.fetchone()
    conn.close()
    if not r:
        raise HTTPException(status_code=404, detail="Scan not found or unauthorized.")

    return {
        "id": r["id"],
        "input_type": r["input_type"],
        "transcript": r["transcript"],
        "audio_filename": r["audio_filename"],
        "risk_level": r["risk_level"],
        "fused_score": r["fused_score"],
        "fake_prob": r["fake_prob"],
        "scam_score": r["scam_score"],
        "tactics": json.loads(r["tactics"]) if r["tactics"] else [],
        "reasons": json.loads(r["reasons"]) if r["reasons"] else [],
        "extracted": json.loads(r["extracted_data"]) if r["extracted_data"] else {},
        "voice_status": r["voice_status"],
        "timestamp": r["timestamp"]
    }


@app.delete("/scans")
def delete_all_scans(user: dict = Depends(get_current_user)):
    conn = get_db()
    cursor = conn.cursor()
    cursor.execute("DELETE FROM scans WHERE user_id = ?", (user["user_id"],))
    conn.commit()
    conn.close()
    return {"success": True, "message": "History cleared."}


@app.post("/report/generate")
def generate_report(req: GenerateReportRequest, user: dict = Depends(get_current_user)):
    """Builds official Cybercrime 1930 dossier strictly from real extracted scan data."""
    if not req.scan_id:
        raise HTTPException(status_code=400, detail="Scan ID is required to generate a report.")

    conn = get_db()
    cursor = conn.cursor()
    cursor.execute(
        """
        SELECT id, input_type, transcript, risk_level, fused_score, fake_prob,
               scam_score, tactics, extracted_data, voice_status, timestamp
        FROM scans WHERE id = ? AND user_id = ?
        """,
        (req.scan_id, user["user_id"])
    )
    scan = cursor.fetchone()
    conn.close()

    if not scan:
        raise HTTPException(status_code=404, detail="Scan record not found.")

    extracted = json.loads(scan["extracted_data"]) if scan["extracted_data"] else {}
    tactics = json.loads(scan["tactics"]) if scan["tactics"] else []
    report_ref = f"FSH-IN-{scan['id']}-{int(time.time())}"
    generated_at = datetime.utcnow().strftime("%Y-%m-%d %H:%M:%S UTC")

    # Only real extracted values are populated
    suspect_phone = req.caller_phone or extracted.get("phone_number") or "Not provided in message"
    claimed_caller = extracted.get("caller_claims_to_be") or "Unspecified impersonator"
    caller_name = extracted.get("caller_name") or "None stated"
    money_demanded = extracted.get("money_demanded") or "No explicit amount found"
    payment_method = extracted.get("payment_method") or "Not specified"
    upi_id = extracted.get("upi_id") or "None"
    deadline = extracted.get("deadline_pressure") or "Immediate / None"
    secrecy = extracted.get("secrecy_coercion") or "None"
    links = ", ".join(extracted.get("links", [])) if extracted.get("links") else "None"
    bank_acct = extracted.get("masked_bank_account") or "None"

    fake_prob_str = f"{round(scan['fake_prob'] * 100, 1)}%" if scan["fake_prob"] is not None else "Voice not analysed"

    markdown_dossier = f"""================================================================================
NATIONAL CYBER CRIME REPORTING PORTAL (cybercrime.gov.in) & HELPLINE 1930
ELECTRONIC INCIDENT COMPLAINT DOSSIER
================================================================================

CASE REFERENCE: {report_ref}
GENERATED DATE: {generated_at}
COMPLAINANT: {req.victim_name or user.get('name', 'Complainant')}
CRIME CATEGORY: Cyber Impersonation Fraud / Family Emergency Extortion
APPLICABLE SECTIONS: Section 66D (Cheating by personation using computer resource),
                     Section 66C (Identity theft), IPC Sections 419/420.

--------------------------------------------------------------------------------
1. SUSPECT EVIDENCE & EXTRACTED ARTIFACTS (REAL SCAN DATA)
--------------------------------------------------------------------------------
- Suspect Contact / Caller Phone: {suspect_phone}
- Claimed Identity: {claimed_caller}
- Claimed Name: {caller_name}
- Situation Claimed: {extracted.get('situation') or 'Emergency'}
- Financial Amount Demanded: {money_demanded}
- Payment Method Demanded: {payment_method}
- Suspect UPI ID: {upi_id}
- Suspect Bank Account (Masked): {bank_acct}
- Coercive Secrecy / Pressure: {secrecy} (Deadline: {deadline})
- Embedded Links / URLs: {links}
- Loss Status: {req.financial_loss}

--------------------------------------------------------------------------------
2. FORENSIC THREAT ASSESSMENT (FamilyShield AI)
--------------------------------------------------------------------------------
- Overall Risk Rating: {scan['risk_level']}
- Voice Clone Probability: {fake_prob_str}
- Extortion Pattern Intent: {round(scan['scam_score'] * 100, 1)}%
- Detected Tactics: {', '.join(tactics) if tactics else 'None'}

--------------------------------------------------------------------------------
3. TRANSCRIBED MESSAGE / CALL RECORD
--------------------------------------------------------------------------------
"{scan['transcript']}"

--------------------------------------------------------------------------------
4. LAW ENFORCEMENT & BANK ACTION REQUEST
--------------------------------------------------------------------------------
1. Freeze beneficiary UPI/Bank account under Citizen Financial Cyber Fraud System (1930).
2. Trace Call Detail Record (CDR) for suspect phone {suspect_phone}.
3. Verify telecommunication spoofing carrier headers.

Verified by FamilyShield AI Forensic Shield
================================================================================
"""
    return {
        "report_id": report_ref,
        "generated_at": generated_at,
        "markdown": markdown_dossier,
        "extracted": extracted
    }


# Family Vault Endpoints (SQLite per-user)
@app.get("/vault")
def get_vault_members(user: dict = Depends(get_current_user)):
    conn = get_db()
    cursor = conn.cursor()
    cursor.execute(
        "SELECT id, name, relation, phone, safe_word_hint, notes, voice_enrolled FROM family_members WHERE user_id = ? ORDER BY id DESC",
        (user["user_id"],)
    )
    rows = cursor.fetchall()
    conn.close()

    return [
        {
            "id": str(r["id"]),
            "name": r["name"],
            "relation": r["relation"],
            "phone": r["phone"],
            "safe_word_hint": r["safe_word_hint"],
            "notes": r["notes"],
            "voice_enrolled": bool(r["voice_enrolled"])
        }
        for r in rows
    ]


@app.post("/vault")
def add_vault_member(req: VaultMemberRequest, user: dict = Depends(get_current_user)):
    if not req.name.strip() or not req.phone.strip():
        raise HTTPException(status_code=400, detail="Name and phone number are required.")
    conn = get_db()
    cursor = conn.cursor()
    cursor.execute(
        "INSERT INTO family_members (user_id, name, relation, phone, safe_word_hint, notes, created_at) VALUES (?, ?, ?, ?, ?, ?, ?)",
        (user["user_id"], req.name.strip(), req.relation.strip(), req.phone.strip(), req.safe_word_hint or "", req.notes or "", time.time())
    )
    new_id = cursor.lastrowid
    conn.commit()
    conn.close()
    return {"success": True, "id": str(new_id)}


@app.delete("/vault/{member_id}")
def delete_vault_member(member_id: int, user: dict = Depends(get_current_user)):
    conn = get_db()
    cursor = conn.cursor()
    cursor.execute("DELETE FROM family_members WHERE id = ? AND user_id = ?", (member_id, user["user_id"]))
    conn.commit()
    conn.close()
    return {"success": True}


if __name__ == "__main__":
    import uvicorn
    port = int(os.getenv("PORT", 8000))
    uvicorn.run("main:app", host="0.0.0.0", port=port, reload=True)
