import { QuizScenario } from '../types';

export const QUIZ_SCENARIOS: QuizScenario[] = [
  {
    id: 1,
    title: "Scenario 1: The 'Broken Phone' Call",
    caller: "Voice sounding like your grandson",
    situation: "You receive a call from an unknown number. The voice sounds like your grandson crying, saying he dropped his phone in a lake and needs money wired to his friend's account for a taxi home.",
    transcript: "Grandma, it's me! My phone fell in the lake so I'm using a stranger's phone. I'm stuck 50 miles away and need 2,000 rupees right now for a cab! Please don't tell mom!",
    riskLevel: "HIGH",
    options: [
      "Send the 2,000 rupees right away since he sounds distressed.",
      "Hang up immediately, dial your grandson's real saved phone number, and ask for your Family Safe-Word.",
      "Ask the caller to send his friend's Aadhaar or bank account details.",
      "Tell him to wait and message him on WhatsApp on the stranger's number."
    ],
    correctIndex: 1,
    explanation: "Scammers frequently use the 'broken phone' excuse so you won't question why the call came from an unfamiliar number. ALWAYS hang up, call the real number saved in your contacts, and verify the Family Safe-Word."
  },
  {
    id: 2,
    title: "Scenario 2: The 'Police Custody' Coercion",
    caller: "Someone claiming to be a Police Sub-Inspector",
    situation: "A stern voice claims to be Inspector Rao. He says your daughter is in police lockup for an accident and will be sent to judicial jail unless you transfer bail money via UPI within 20 minutes.",
    transcript: "This is Inspector Rao. Your daughter was involved in a collision. We have not registered the FIR yet. Transfer twenty thousand rupees to this UPI ID within 20 minutes to settle bail, or she will be sent to jail.",
    riskLevel: "HIGH",
    options: [
      "Pay the UPI immediately so your daughter doesn't have a criminal record.",
      "Argue with the inspector and negotiate a lower amount.",
      "Hang up immediately! Indian police and courts NEVER demand bail via phone or personal UPI. Dial 1930 / 112 to verify.",
      "Ask the inspector to send a photo of your daughter on WhatsApp."
    ],
    correctIndex: 2,
    explanation: "Indian Law Enforcement and legal courts NEVER demand bail via telephone or ask for transfers to personal UPI IDs. This is 100% extortion. Hang up and contact your daughter and dial 112 / 1930."
  },
  {
    id: 3,
    title: "Scenario 3: The Gift Card / Crypto Request",
    caller: "Your nephew claiming to need emergency hospital deposit",
    situation: "A voice identical to your nephew calls saying he had a sudden medical emergency and the private hospital only accepts payment via Apple gift cards or cryptocurrency vouchers.",
    transcript: "Uncle, I need surgery immediately! The clinic cashier says their card machine is down and they will only take an Apple Gift Card code right now to start treatment! Hurry!",
    riskLevel: "HIGH",
    options: [
      "Rush to the store to buy gift cards because medical emergencies cannot wait.",
      "Hang up immediately. No legitimate hospital or doctor demands gift cards or crypto. Call his parents immediately.",
      "Ask him to send the hospital bill invoice first.",
      "Send half the amount to test if it works."
    ],
    correctIndex: 1,
    explanation: "Demands for Gift Cards, Apple cards, or cryptocurrency are definitive proof of fraud. These payment methods are untraceable and cannot be reversed."
  },
  {
    id: 4,
    title: "Scenario 4: Routine Family Voice Note",
    caller: "Your daughter",
    situation: "Your daughter sends an audio message on WhatsApp from her verified contact saying she will be late for dinner due to traffic and asks if you need any groceries.",
    transcript: "Hey Dad, quick update: the metro is running 15 minutes late today. Do we need milk or vegetables for dinner tonight? Let me know, see you soon!",
    riskLevel: "LOW",
    options: [
      "Flag as high risk deepfake and report to police.",
      "Normal everyday message: came from her verified number with normal conversational tone and zero financial pressure.",
      "Demand she send a selfie with today's newspaper before replying.",
      "Block her number immediately."
    ],
    correctIndex: 1,
    explanation: "Standard conversational messages with no panic, no secrecy, and no urgent money requests coming from an existing trusted thread are safe."
  }
];
