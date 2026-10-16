import { Language } from '../types';

export const translations = {
  en: {
    appTitle: "FamilyShield AI",
    appSubtitle: "AI Voice-Clone & Family Emergency Scam Defense",
    helplineAlert: "Emergency Cyber Helpline (India): Dial 1930 immediately or visit cybercrime.gov.in",
    tabScan: "Analyze Message / Voice",
    tabResult: "Assessment & Extraction",
    tabVault: "Family Vault",
    tabReport: "Cybercrime Dossier (1930)",
    tabAwareness: "Scam Simulator",
    tabHistory: "Account History",
    
    // Scanner
    textModeTab: "Paste Message / Text",
    voiceModeTab: "Voice Recording / Note",
    scannerHeading: "Analyze a Suspicious Family Message or Call",
    scannerSubheading: "Paste what the caller said, upload a WhatsApp chat export (.txt), or record audio. Extracts real entities with zero invented data.",
    textPlaceholder: "Paste message text or type what the caller said (up to 10,000 characters)...\n\nExample: 'Grandma it's me, I was in an accident and the police have me. Send 50,000 rupees by UPI to rahul@okaxis right now, don't tell mom.'",
    uploadTxtBtn: "Load .txt Chat Export",
    analyzeTextBtn: "Analyze Message For Scam Extortion",
    startRecord: "Start Recording",
    stopRecord: "Stop & Analyze",
    uploadAudioPrompt: "Upload voice note or call recording (.mp3, .wav, .ogg, WhatsApp .opus up to 15MB)",
    
    // Results
    resultHeading: "Forensic Assessment & Real Data Extraction",
    voiceNotAnalysed: "Voice Not Analysed (Text Input or DetectifAI key not configured)",
    extractedDataTitle: "Extracted Incident Artifacts (From Message)",
    overallRisk: "Overall Threat Level",
    
    // Checklist
    checklistTitle: "Immediate Action Plan",
    checklistDesc: "Follow these golden rules before taking ANY action:",
    step1: "1. Hang up immediately. Do not stay on the phone.",
    step2: "2. Call back on the number saved in your phone address book.",
    step3: "3. Ask the caller for your private Family Safe-Word.",
    
    // Vault
    vaultTitle: "Private Family Vault",
    vaultDesc: "Manage trusted family contacts and your unique household safe-word. Saved securely in your account.",
    addMemberBtn: "Add Family Contact",
    emptyVault: "Your Family Vault is currently empty. Add trusted family contacts below.",
    
    // Report
    reportTitle: "Official Cybercrime Incident Dossier (Helpline 1930)",
    reportDesc: "Filled exclusively from real extracted data of this scan. Empty until you analyze a message or call.",
    emptyReportMessage: "No scan data available yet. Please analyze a message or call first to generate an official complaint dossier.",
    
    // Auth
    login: "Log In",
    register: "Create Account",
    logout: "Log Out",
    welcome: "Welcome",
    
    disclaimer: "Defensive Security Disclaimer: Detection results are advisory. Always verify emergency claims by calling the contact back on your saved phone number."
  },

  hi: {
    appTitle: "FamilyShield AI",
    appSubtitle: "परिवार सुरक्षा: AI वॉयस-क्लोन और आपातकालीन घोटाला कवच",
    helplineAlert: "साइबर हेल्पलाइन (भारत): तुरंत 1930 डायल करें या cybercrime.gov.in पर जाएं",
    tabScan: "संदेश / कॉल की जांच करें",
    tabResult: "मूल्यांकन और विवरण",
    tabVault: "फैमिली वॉल्ट",
    tabReport: "साइबर क्राइम रिपोर्ट (1930)",
    tabAwareness: "स्कैम सिमुलेटर",
    tabHistory: "अकाउंट इतिहास",
    
    textModeTab: "संदेश / चैट पेस्ट करें",
    voiceModeTab: "कॉल / वॉयस रिकॉर्डिंग",
    scannerHeading: "संदिग्ध पारिवारिक संदेश या कॉल की जांच करें",
    scannerSubheading: "कॉलर द्वारा कही गई बातें लिखें, व्हाट्सएप चैट (.txt) अपलोड करें, या ऑडियो रिकॉर्ड करें।",
    textPlaceholder: "संदेश यहां पेस्ट करें या लिखें कि कॉलर ने क्या कहा (10,000 अक्षरों तक)...",
    uploadTxtBtn: ".txt चैट फाइल लोड करें",
    analyzeTextBtn: "संदेश का विश्लेषण करें",
    startRecord: "रिकॉर्डिंग शुरू करें",
    stopRecord: "रोकें और जांचें",
    uploadAudioPrompt: "ऑडियो फाइल अपलोड करें (.mp3, .wav, .ogg, WhatsApp .opus)",
    
    resultHeading: "सटीक डेटा निष्कर्षण और जोखिम रिपोर्ट",
    voiceNotAnalysed: "आवाज का विश्लेषण नहीं किया गया (टेक्स्ट इनपुट)",
    extractedDataTitle: "निकाली गई जानकारी (वास्तविक संदेश से)",
    overallRisk: "कुल जोखिम स्तर",
    
    checklistTitle: "तत्काल सुरक्षा कदम",
    checklistDesc: "पैसे भेजने से पहले इन नियमों का पालन करें:",
    step1: "1. तुरंत फोन काट दें। लाइन पर न रहें।",
    step2: "2. अपने फोन में सेव किए गए नंबर पर वापस कॉल करें।",
    step3: "3. परिवार का गुप्त कोड (सेफ-वर्ड) पूछें।",
    
    vaultTitle: "निजी फैमिली वॉल्ट",
    vaultDesc: "विश्वसनीय संपर्कों को जोड़ें और अपना गुप्त सेफ-वर्ड सुरक्षित रखें।",
    addMemberBtn: "नया संपर्क जोड़ें",
    emptyVault: "आपकी फैमिली वॉल्ट अभी खाली है। नीचे विश्वसनीय संपर्क जोड़ें।",
    
    reportTitle: "आधिकारिक साइबर क्राइम रिपोर्ट (हेल्पलाइन 1930)",
    reportDesc: "यह रिपोर्ट केवल आपके द्वारा स्कैन किए गए वास्तविक डेटा से भरी जाती है।",
    emptyReportMessage: "अभी तक कोई स्कैन नहीं किया गया है। रिपोर्ट तैयार करने के लिए पहले किसी संदेश की जांच करें।",
    
    login: "लॉग इन",
    register: "अकाउंट बनाएं",
    logout: "लॉग आउट",
    welcome: "स्वागत",
    
    disclaimer: "महत्वपूर्ण सूचना: परिणाम केवल सलाह हैं। अपने परिचित नंबर पर दोबारा कॉल करके हमेशा पुष्टि करें।"
  },

  kn: {
    appTitle: "FamilyShield AI",
    appSubtitle: "AI ಧ್ವನಿ ನಕಲು ಮತ್ತು ಕುಟುಂಬ ತುರ್ತು ವಂಚನೆ ರಕ್ಷಣೆ",
    helplineAlert: "ಸೈಬರ್ ಹೆಲ್ಪ್‌ಲೈನ್ (ಭಾರತ): ತಕ್ಷಣ 1930 ಗೆ ಕರೆ ಮಾಡಿ ಅಥವಾ cybercrime.gov.in ಗೆ ಭೇಟಿ ನೀಡಿ",
    tabScan: "ಸಂದೇಶ / ಕರೆ ಪರಿಶೀಲಿಸಿ",
    tabResult: "ವಿಶ್ಲೇಷಣೆ ಮತ್ತು ವಿವರ",
    tabVault: "ಕುಟುಂಬದ ವಾಲ್ಟ್",
    tabReport: "ಸೈಬರ್ ದೂರು (1930)",
    tabAwareness: "ಸಿಮ್ಯುಲೇಟರ್",
    tabHistory: "ಖಾತೆ ಇತಿಹಾಸ",
    
    textModeTab: "ಸಂದೇಶ ಪೇಸ್ಟ್ ಮಾಡಿ",
    voiceModeTab: "ಧ್ವನಿ ರೆಕಾರ್ಡಿಂಗ್",
    scannerHeading: "ಅನುಮಾನಾಸ್ಪದ ಸಂದೇಶ ಅಥವಾ ಕರೆಯನ್ನು ಪರಿಶೀಲಿಸಿ",
    scannerSubheading: "ಕರೆ ಮಾಡಿದವರು ಹೇಳಿದ ಸಂದೇಶವನ್ನು ಪೇಸ್ಟ್ ಮಾಡಿ ಅಥವಾ ಆಡಿಯೋ ಅಪ್‌ಲೋಡ್ ಮಾಡಿ.",
    textPlaceholder: "ಸಂದೇಶವನ್ನು ಇಲ್ಲಿ ಪೇಸ್ಟ್ ಮಾಡಿ...",
    uploadTxtBtn: ".txt ಫೈಲ್ ಅಪ್‌ಲೋಡ್",
    analyzeTextBtn: "ವಿಶ್ಲೇಷಿಸಿ",
    startRecord: "ರೆಕಾರ್ಡಿಂಗ್ ಪ್ರಾರಂಭಿಸಿ",
    stopRecord: "ನಿಲ್ಲಿಸಿ ಮತ್ತು ಪರಿಶೀಲಿಸಿ",
    uploadAudioPrompt: "ಆಡಿಯೋ ಫೈಲ್ ಅಪ್‌ಲೋಡ್ ಮಾಡಿ (.mp3, .wav, WhatsApp .opus)",
    
    resultHeading: "ನಿಜವಾದ ಡೇಟಾ ಹೊರತೆಗೆಯುವಿಕೆ ಮತ್ತು ಅಪಾಯ ವರದಿ",
    voiceNotAnalysed: "ಧ್ವನಿ ವಿಶ್ಲೇಷಿಸಲಾಗಿಲ್ಲ (ಪಠ್ಯ ಇನ್‌ಪುಟ್)",
    extractedDataTitle: "ಪತ್ತೆಯಾದ ನಿರ್ದಿಷ್ಟ ವಿವರಗಳು",
    overallRisk: "ಒಟ್ಟಾರೆ ಅಪಾಯದ ಮಟ್ಟ",
    
    checklistTitle: "ತಕ್ಷಣದ ಸುರಕ್ಷತಾ ಕ್ರಮಗಳು",
    checklistDesc: "ಹಣ ಕಳುಹಿಸುವ ಮುನ್ನ ಈ ನಿಯಮಗಳನ್ನು ಪಾಲಿಸಿ:",
    step1: "1. ತಕ್ಷಣ ಫೋನ್ ಕಟ್ ಮಾಡಿ.",
    step2: "2. ನಿಮ್ಮ ಫೋನ್‌ನಲ್ಲಿ ಉಳಿಸಿರುವ ನಂಬರ್‌ಗೆ ಮರಳಿ ಕರೆ ಮಾಡಿ.",
    step3: "3. ಕುಟುಂಬದ ರಹಸ್ಯ ಪದವನ್ನು ಕೇಳಿ.",
    
    vaultTitle: "ಕುಟುಂಬದ ಖಾಸಗಿ ವಾಲ್ಟ್",
    vaultDesc: "ವಿಶ್ವಾಸಾರ್ಹ ಕುಟುಂಬ ಸದಸ್ಯರನ್ನು ಸೇರಿಸಿ ಮತ್ತು ರಹಸ್ಯ ಪದವನ್ನು ರಕ್ಷಿಸಿ.",
    addMemberBtn: "ಸದಸ್ಯರನ್ನು ಸೇರಿಸಿ",
    emptyVault: "ನಿಮ್ಮ ವಾಲ್ಟ್ ಸದ್ಯಕ್ಕೆ ಖಾಲಿಯಾಗಿದೆ.",
    
    reportTitle: "ಅಧಿಕೃತ ಸೈಬರ್ ಕ್ರೈಮ್ ವರದಿ (1930)",
    reportDesc: "ನಿಜವಾದ ಡೇಟಾದಿಂದ ರಚಿಸಲಾದ ಅಧಿಕೃತ ವರದಿ.",
    emptyReportMessage: "ವರದಿ ತಯಾರಿಸಲು ಮೊದಲು ಸಂದೇಶ ಅಥವಾ ಕರೆಯನ್ನು ಪರಿಶೀಲಿಸಿ.",
    
    login: "ಲಾಗಿನ್",
    register: "ಖಾತೆ ರಚಿಸಿ",
    logout: "ಲಾಗೌಟ್",
    welcome: "ಸ್ವಾಗತ",
    
    disclaimer: "ಗಮನಿಸಿ: ನಿಮ್ಮ ಪರಿಚಿತ ಸಂಖ್ಯೆಗೆ ಕರೆ ಮಾಡಿ ನೇರವಾಗಿ ಖಚಿತಪಡಿಸಿಕೊಳ್ಳುವುದು ಅತ್ಯಗತ್ಯ."
  }
};
