# FamilyShield AI 🛡️👨‍👩‍👧‍👦
### AI Voice-Clone & Family Emergency Scam Defense (v2)
*Real user data • Per-user SQLite accounts • Text & Voice extraction • Honest forensic scoring*

---

## 📌 Rebrand & Purpose
**FamilyShield AI** is designed specifically to protect families and elderly relatives from emergency extortion scams:
> *"Mom/Grandpa, I've had a terrible accident, my phone is broken, the police have me in custody, please send bail money right now through UPI, don't tell anyone!"*

---

## 🚀 Key Improvements in v2 (No Invented Data)
1. **Family-Centric Brand**: Renamed to **FamilyShield AI** to clearly reflect family defense and protection.
2. **Per-User Accounts & SQLite Storage**:
   - `/login` & registration with minimum 8-character passwords.
   - Passwords securely hashed with **PBKDF2-SHA256** and random salt.
   - 5 consecutive failed attempts locks the account for 15 minutes.
   - Signed **JWT** tokens valid for 72 hours.
   - Scan history and family contacts are isolated per user in SQLite (`backend/familyshield.db`). Audio files are never stored on disk.
3. **Primary Input is Now Message / Text**:
   - Paste SMS / WhatsApp text or type what the caller said (up to 10,000 characters).
   - Load `.txt` chat export files with one click.
4. **Structured Forensic Entity Extraction**:
   Extracts only facts present in the text:
   - Caller claims to be (e.g. Police, Grandson, Daughter)
   - Situation (e.g. Accident, Custody)
   - Money demanded (e.g. INR 50,000, $5,000)
   - Payment method (UPI, Crypto, Wire)
   - Suspect UPI ID (e.g. `rahul@okaxis`)
   - Suspect phone number
   - Pressure / deadline & Secrecy demands
   - Links & Masked bank account numbers (`****1234`)
   - *Harmless messages return LOW risk with empty money fields.*
5. **Honest Risk Scoring**:
   - **Voice + Text**: $0.5 \times \text{fake\_prob} + 0.5 \times \text{scam\_score}$ (only when DetectifAI API key is configured).
   - **Text-Only / Unanalysed Voice**: Scored purely on the message intent and clearly labeled `"voice not analysed"`. Zero invented scores.
6. **Real Cybercrime 1930 Dossier**:
   - Report fields are empty until a scan is run.
   - Filled exclusively from the real extracted artifacts of that scan.
7. **Per-User Family Vault**:
   - Starts empty for each new account.
   - Unique random household safe-word generated on signup.

---

## 🏃 How to Run

### Backend (Terminal 1)
```bash
cd backend
python -m venv venv

# Windows:
venv\Scripts\activate
# Linux/macOS:
# source venv/bin/activate

pip install -r requirements.txt
uvicorn main:app --port 8000 --reload
```
Interactive API documentation: **[http://127.0.0.1:8000/docs](http://127.0.0.1:8000/docs)**.

### Frontend (Terminal 2)
```bash
cd frontend
npm install
npm run dev
```
Open **[http://localhost:3000](http://localhost:3000)** in your browser.
Create a new user account on `/login`, then paste a message or upload audio to scan.

### Run Automated Test Suite (19 Checks)
```bash
cd backend
python test_api.py
```

---

## 🔑 Environment Variables (`backend/.env`)

```ini
JWT_SECRET=your-random-32-char-secret-string

# DetectifAI API credentials (optional; without it, voice shows 'voice not analysed')
DETECTIF_API_URL=https://api.detectif.ai/v1/detect
DETECTIF_API_KEY=

# Google Gemini API key (optional; without it, rule-based extractor is used)
GEMINI_API_KEY=
GEMINI_MODEL=gemini-2.5-flash
```

---
*FamilyShield AI • Built for family protection and defensive cybersecurity.*
