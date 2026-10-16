"""
Test Suite and Benchmark for UNclone Agent
Implements Step 10 from build guide:
Tests LLM scam reasoning and risk fusion against varied scripts.
"""

import asyncio
from scam_analyzer import heuristic_scam_analysis
from risk_fusion import fuse_risk

TEST_CASES = [
    {
        "name": "Grandson Accident Bail Scam (Classic Impersonation)",
        "fake_prob": 0.92,
        "transcript": (
            "Grandma? It's me, please don't hang up! I was in a terrible car accident on the highway. "
            "My friend's car is totaled and police have me at the precinct right now. "
            "My phone broke in the crash so I'm calling from this borrowed phone. "
            "The officer said if I pay five thousand dollars bail right now through UPI or wire, "
            "they won't throw me in county jail! Please don't tell mom and dad, they'll kill me! Send it right now!"
        ),
        "expected_risk": "HIGH"
    },
    {
        "name": "Police Narcotics Custody Extortion (High Pressure)",
        "fake_prob": 0.86,
        "transcript": (
            "Listen carefully. This is Inspector Sharma from Central Police Headquarters. "
            "Your son has been detained in connection with an illegal narcotics consignment. "
            "He is sobbing right here. If you want him released without an FIR, you must transfer "
            "fifty thousand rupees immediately via crypto or digital payment. "
            "Do not inform anyone or disconnect this line, or we will remand him into custody."
        ),
        "expected_risk": "HIGH"
    },
    {
        "name": "Legitimate Daughter University Check-in (Harmless)",
        "fake_prob": 0.05,
        "transcript": (
            "Hi Mom! Just finished my afternoon classes at university and wanted to check in. "
            "I'm heading to the library with Sarah and then cooking dinner at the dorm tonight. "
            "Love you, call me back when you get this!"
        ),
        "expected_risk": "LOW"
    },
    {
        "name": "Panicked Friend needing help without synthetic voice (Real Voice, Scam/Compromise)",
        "fake_prob": 0.15,
        "transcript": (
            "Hey please help me! My wallet was stolen at the airport and my passport is gone! "
            "I need three hundred dollars wired immediately to this Western Union counter to board my flight! "
            "Hurry please, boarding ends in 15 minutes!"
        ),
        "expected_risk": "MEDIUM"
    }
]

def run_benchmarks():
    print("=" * 60)
    print("UNclone Agent - Benchmark Evaluation Suite")
    print("=" * 60)
    
    passed = 0
    for idx, tc in enumerate(TEST_CASES, 1):
        print(f"\n[Test Case {idx}] {tc['name']}")
        scam_res = heuristic_scam_analysis(tc["transcript"])
        fusion = fuse_risk(tc["fake_prob"], scam_res["scam_score"])
        
        print(f"  • Fake Probability: {fusion['fake_percentage']}%")
        print(f"  • Scam Pattern Score: {fusion['scam_percentage']}%")
        print(f"  • Tactics Detected: {', '.join(scam_res['tactics']) if scam_res['tactics'] else 'None'}")
        print(f"  • Final Risk Level: {fusion['risk_level']} (Expected: {tc['expected_risk']})")
        
        if fusion["risk_level"] == tc["expected_risk"]:
            print("  ✓ PASS")
            passed += 1
        else:
            print(f"  ✗ FAIL: expected {tc['expected_risk']} but got {fusion['risk_level']}")
            
    print("\n" + "=" * 60)
    print(f"Results: {passed}/{len(TEST_CASES)} tests passed.")
    print("=" * 60)

if __name__ == "__main__":
    run_benchmarks()
