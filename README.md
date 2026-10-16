# UNclone Agent 🛡️
### AI Voice-Clone & Family Emergency Scam Shield
*Built with the **DetectifAI Foundation API**, **Faster-Whisper**, and **Google Gemini**.*

---

## 📌 The Problem
In a **family emergency scam**, a fraudster calls an elderly parent or grandparent pretending to be a son, daughter, or grandchild in distress:
> *"Mom/Grandma, I had an accident, my phone is broken, the police have me in custody, please send bail money right now through UPI, don't tell anyone!"*

With modern generative voice cloning, fraudsters only need **3–5 seconds of real audio** from social media to produce a convincing voice clone. Panicked families fall victim in minutes.

---

## 💡 What UNclone Agent Does
**UNclone Agent** is a family defense tool that analyzes suspicious emergency calls and voice notes in seconds:
1. **Voice Authenticity Probability**: Detects synthetic vocoder artifacts, deepfakes, and replayed audio using **DetectifAI API**.
2. **Scam-Pattern Intent Reasoning**: Analyzes transcript tactics (urgency, secrecy, money requests, broken-phone excuses, police impersonation) using **Google Gemini**.
3. **Dual Risk Fusion Engine**: Fuses acoustic deepfake probability with NLP extortion intent:
   $$\text{Score} = 0.5 \times \text{FakeProb} + 0.5 \times \text{ScamScore}$$
   - 🔴 **HIGH RISK**: $\text{FakeProb} > 0.85$ or $\text{Score} \ge 0.7$
   - 🟡 **MEDIUM RISK**: $\text{Score} \ge 0.4$
   - 🟢 **LOW RISK**: $\text{Score} < 0.4$
4. **Senior Accessibility**: Large text, high-contrast UI, and a **Text-to-Speech Voice Warning** (`window.speechSynthesis`) that reads the alert aloud to elderly grandparents.
5. **Interactive Immediate Action Checklist**: Hang up, direct callback on saved numbers, and safe-word verification.
6. **Family Vault & Safe-Word Coach**: Generates unguessable household code-words that cloned voices cannot know.
7. **India Cybercrime Report Helper (1930 / cybercrime.gov.in)**: Formats an electronic dossier for the National Cyber Crime Reporting Portal and bank fraud desks within the crucial 2-hour "Golden Hour".
8. **Scam Awareness Simulator**: Interactive quiz mode teaching families how to recognize deepfakes.
9. **Multilingual Support**: Full UI and instructions in **English**, **Hindi (हिंदी)**, and **Kannada (ಕನ್ನಡ)**.

---

## 🏗️ Project Architecture

```
UNclone/
├── backend/                   # FastAPI Python microservice
│   ├── main.py                # REST API (/analyze, /report/generate, /health)
│   ├── detectifai_service.py  # DetectifAI API client + acoustic fallback
│   ├── transcriber.py         # Faster-Whisper CPU transcription
│   ├── scam_analyzer.py       # Gemini 1.5 JSON scam reasoning + heuristic NLP
│   ├── risk_fusion.py         # Step 6 Risk Fusion Engine
│   ├── test_samples.py        # Benchmark evaluation test suite
│   ├── requirements.txt       # Python dependencies
│   └── .env.example           # Backend environment template
│
├── frontend/                  # Next.js 14 + React + Tailwind CSS
│   ├── src/
│   │   ├── app/
│   │   │   ├── layout.tsx     # Root layout & metadata
│   │   │   ├── page.tsx       # Main tabbed dashboard
│   │   │   ├── globals.css    # Dark mode & typography
│   │   │   └── api/analyze/   # Next.js proxy & integrated fallback engine
│   │   ├── components/
│   │   │   ├── Navbar.tsx     # Navigation & 1930 emergency banner
│   │   │   ├── AudioScanner.tsx # MediaRecorder live mic + file upload + demo selector
│   │   │   ├── RiskMeter.tsx  # Animated SVG speedometer & dual signals
│   │   │   ├── ResultView.tsx # Scores, reasons, TTS audio readout, highlighted transcript
│   │   │   ├── CallbackChecklist.tsx # Interactive action plan
│   │   │   ├── FamilyVault.tsx # Contact directory & Safe-Word Coach
│   │   │   ├── IncidentReport.tsx # 1930 Cybercrime Dossier exporter
│   │   │   ├── AwarenessQuiz.tsx # Family scam awareness simulator
│   │   │   └── ScanHistory.tsx # Stored scan history
│   │   ├── lib/
│   │   │   ├── demoScenarios.ts # 4 preloaded audio test scenarios
│   │   │   ├── quizScenarios.ts # Interactive training cases
│   │   │   └── translations.ts  # English, Hindi, Kannada localizations
│   │   └── types/index.ts     # TypeScript definitions
│   └── package.json
└── README.md
```

---

## 🚀 Quick Start Guide

### 1. Prerequisites
- **Node.js** (v18.0.0 or higher)
- **Python** (v3.10 or higher) — *optional if running frontend standalone mode*

---

### 2. Frontend Setup (Next.js)

```bash
cd frontend
npm install
npm run dev
```
Open **[http://localhost:3000](http://localhost:3000)** in your browser.

> **Note:** The frontend includes an **integrated fallback engine**. You can immediately test all features and demo scenarios in 1-click even before starting the Python backend!

---

### 3. Backend Setup (FastAPI Python Service)

In a new terminal:
```bash
cd backend

# Create and activate virtual environment
python -m venv venv

# On Windows:
venv\Scripts\activate
# On Linux/macOS:
# source venv/bin/activate

# Install requirements
pip install -r requirements.txt

# Configure your API keys (optional for live APIs)
cp .env.example .env

# Run FastAPI server
uvicorn main:app --port 8000 --reload
```
Backend API will be running at **[http://127.0.0.1:8000](http://127.0.0.1:8000)** with interactive Swagger docs at **[http://127.0.0.1:8000/docs](http://127.0.0.1:8000/docs)**.

---

### 4. Running the Benchmark Test Suite
You can verify the accuracy of the detection and fusion engine across synthetic vs. human scripts:
```bash
cd backend
python test_samples.py
```

---

## 🔑 Environment Configuration

In `backend/.env` (and optionally `frontend/.env.local`):

```ini
# DetectifAI API credentials (from https://detectif.ai dashboard)
DETECTIF_API_URL=https://api.detectif.ai/v1/detect
DETECTIF_API_KEY=your_detectifai_api_key_here

# Google Gemini API key (Free tier from https://aistudio.google.com)
GEMINI_API_KEY=your_gemini_api_key_here

# Whisper model size (tiny, base, small)
WHISPER_MODEL_SIZE=base
```

---

## 🎤 30-Second Demo & Pitch Flow (Step 12)

1. **The Hook (0–10s):**
   Show a WhatsApp voice note claiming: *"Grandma, I had an accident, my phone is broken, send 5,000 dollars bail right now!"*
2. **The Scan (10–20s):**
   Click the **Demo Scenario** button in UNclone. Within 2 seconds:
   - **DetectifAI** flags 93% AI Voice Clone.
   - **Gemini** flags 95% scam extortion (urgency, secrecy, UPI).
   - Speedometer swings into **HIGH RISK (94%)**.
3. **The Voice Readout for Elderly Users (20–25s):**
   Click **"Read Warning Aloud"** — the app speaks clearly to the senior: *"Warning! Do not send money. This call is a suspected voice clone."*
4. **The Safe Resolution (25–30s):**
   Show the **Family Safe-Word Coach** and **1930 Cybercrime Dossier** ready for one-click submission to Indian authorities.

---

## 🔒 Privacy & Ethical Design (Step 9)
- **User Consent Required**: Explicit consent confirmed before analyzing any recording.
- **Data Minimization**: Audio files are analyzed in temporary memory buffers and automatically cleared.
- **Honest Disclaimer**: AI detection is an advisory assistant, never a substitute for a direct call-back to a saved phone number.

---
*Developed for defensive cybersecurity and family protection.*
