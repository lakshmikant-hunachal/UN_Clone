'use client';

import React, { useState, useRef, useEffect } from 'react';
import { Mic, Square, Upload, Sparkles, AlertCircle, Play, Check, ShieldCheck, Loader2, Music } from 'lucide-react';
import { Language, AnalysisResult } from '../types';
import { translations } from '../lib/translations';
import { DEMO_SCENARIOS, DemoItem } from '../lib/demoScenarios';

interface AudioScannerProps {
  lang: Language;
  onAnalysisComplete: (result: AnalysisResult) => void;
  isLoading: boolean;
  setIsLoading: (val: boolean) => void;
}

export const AudioScanner: React.FC<AudioScannerProps> = ({
  lang,
  onAnalysisComplete,
  isLoading,
  setIsLoading,
}) => {
  const t = translations[lang];

  // Tab: 'record' | 'upload' | 'demo'
  const [activeMode, setActiveMode] = useState<'record' | 'upload' | 'demo'>('demo');
  const [selectedRelation, setSelectedRelation] = useState<string>('Grandson');
  const [hasConsent, setHasConsent] = useState<boolean>(true);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // File Upload State
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  // MediaRecorder Live State
  const [isRecording, setIsRecording] = useState<boolean>(false);
  const [recordingSeconds, setRecordingSeconds] = useState<number>(0);
  const [recordedBlob, setRecordedBlob] = useState<Blob | null>(null);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  // Clean up timer on unmount
  useEffect(() => {
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, []);

  // Live Recording Handlers
  const startRecording = async () => {
    try {
      setErrorMessage(null);
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      audioChunksRef.current = [];
      const mediaRecorder = new MediaRecorder(stream);
      mediaRecorderRef.current = mediaRecorder;

      mediaRecorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          audioChunksRef.current.push(event.data);
        }
      };

      mediaRecorder.onstop = () => {
        const audioBlob = new Blob(audioChunksRef.current, { type: 'audio/wav' });
        setRecordedBlob(audioBlob);
        stream.getTracks().forEach((track) => track.stop());
      };

      mediaRecorder.start();
      setIsRecording(true);
      setRecordingSeconds(0);

      timerRef.current = setInterval(() => {
        setRecordingSeconds((prev) => prev + 1);
      }, 1000);
    } catch (err: any) {
      setErrorMessage('Microphone access denied or not available. Please allow microphone permissions or use file upload.');
      console.error(err);
    }
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop();
      setIsRecording(false);
      if (timerRef.current) clearInterval(timerRef.current);
    }
  };

  // Submit audio file or recorded blob for analysis
  const runAnalysis = async (fileToAnalyze: File | Blob, filename: string) => {
    if (!hasConsent) {
      setErrorMessage('Please check the consent confirmation box before analyzing.');
      return;
    }

    try {
      setIsLoading(true);
      setErrorMessage(null);

      const formData = new FormData();
      formData.append('audio', fileToAnalyze, filename);
      formData.append('claimed_relation', selectedRelation);

      const response = await fetch('/api/analyze', {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        throw new Error(`Server returned error code ${response.status}`);
      }

      const data: AnalysisResult = await response.json();
      
      // Store blob URL if available for audio playback
      if (fileToAnalyze instanceof Blob) {
        data.audioBlobUrl = URL.createObjectURL(fileToAnalyze);
      }

      onAnalysisComplete(data);
    } catch (err: any) {
      console.error('Analysis failed:', err);
      setErrorMessage(`Analysis failed: ${err.message || 'Please check backend server connection.'}`);
    } finally {
      setIsLoading(false);
    }
  };

  // Handle Demo Scenario Selection
  const handleSelectDemo = (demo: DemoItem) => {
    if (!hasConsent) {
      setErrorMessage('Please check the consent confirmation box before analyzing.');
      return;
    }
    setIsLoading(true);
    setErrorMessage(null);

    // Simulate instant analysis pipeline with realistic timing
    setTimeout(() => {
      setIsLoading(false);
      onAnalysisComplete(demo.mockResult);
    }, 1200);
  };

  const formatSeconds = (sec: number) => {
    const m = Math.floor(sec / 60);
    const s = sec % 60;
    return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Hero Title & Description */}
      <div className="text-center space-y-2">
        <h1 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
          {t.scannerHeading}
        </h1>
        <p className="text-slate-400 text-sm sm:text-base max-w-2xl mx-auto">
          {t.scannerSubheading}
        </p>
      </div>

      {/* Mode Switcher Tabs */}
      <div className="flex bg-slate-900 p-1.5 rounded-xl border border-slate-800 shadow-md">
        <button
          onClick={() => setActiveMode('demo')}
          className={`flex-1 flex items-center justify-center space-x-2 py-3 rounded-lg text-sm font-semibold transition-all ${
            activeMode === 'demo'
              ? 'bg-blue-600 text-white shadow-lg'
              : 'text-slate-400 hover:text-white hover:bg-slate-800/50'
          }`}
        >
          <Sparkles className="w-4 h-4 text-amber-300" />
          <span>{t.demoTab} (1-Click Test)</span>
        </button>

        <button
          onClick={() => setActiveMode('record')}
          className={`flex-1 flex items-center justify-center space-x-2 py-3 rounded-lg text-sm font-semibold transition-all ${
            activeMode === 'record'
              ? 'bg-blue-600 text-white shadow-lg'
              : 'text-slate-400 hover:text-white hover:bg-slate-800/50'
          }`}
        >
          <Mic className="w-4 h-4" />
          <span>{t.recordTab}</span>
        </button>

        <button
          onClick={() => setActiveMode('upload')}
          className={`flex-1 flex items-center justify-center space-x-2 py-3 rounded-lg text-sm font-semibold transition-all ${
            activeMode === 'upload'
              ? 'bg-blue-600 text-white shadow-lg'
              : 'text-slate-400 hover:text-white hover:bg-slate-800/50'
          }`}
        >
          <Upload className="w-4 h-4" />
          <span>{t.uploadTab}</span>
        </button>
      </div>

      {/* Main Action Container */}
      <div className="bg-slate-900/90 rounded-2xl border border-slate-800 p-6 sm:p-8 shadow-2xl backdrop-blur-sm">
        {/* Caller Claim Selector */}
        <div className="mb-6">
          <label className="block text-sm font-semibold text-slate-300 mb-2">
            {t.selectRelation}
          </label>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
            {[
              { id: 'Grandson', label: t.relationGrandson },
              { id: 'Child', label: t.relationChild },
              { id: 'Police', label: t.relationPolice },
              { id: 'Other', label: t.relationOther },
            ].map((item) => (
              <button
                key={item.id}
                type="button"
                onClick={() => setSelectedRelation(item.id)}
                className={`py-2 px-3 text-xs font-medium rounded-lg border text-center transition-all ${
                  selectedRelation === item.id
                    ? 'bg-blue-500/20 border-blue-500 text-blue-300 shadow-sm'
                    : 'bg-slate-800/60 border-slate-700/80 text-slate-400 hover:border-slate-600'
                }`}
              >
                {item.label}
              </button>
            ))}
          </div>
        </div>

        {/* MODE 1: DEMO SCENARIOS */}
        {activeMode === 'demo' && (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">
                Instant Evaluation Library (No Mic Required)
              </span>
              <span className="text-[11px] bg-slate-800 text-slate-400 px-2 py-0.5 rounded">
                Click any scenario to analyze
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {DEMO_SCENARIOS.map((demo) => {
                const isHigh = demo.expectedRisk === 'HIGH';
                const isLow = demo.expectedRisk === 'LOW';

                return (
                  <div
                    key={demo.id}
                    onClick={() => handleSelectDemo(demo)}
                    className="group bg-slate-800/60 hover:bg-slate-800 border border-slate-700/80 hover:border-blue-500 rounded-xl p-4 cursor-pointer transition-all flex flex-col justify-between hover:shadow-lg relative overflow-hidden"
                  >
                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <span
                          className={`text-[10px] font-black px-2 py-0.5 rounded border uppercase tracking-wider ${
                            isHigh
                              ? 'bg-rose-500/20 text-rose-300 border-rose-500/40'
                              : isLow
                              ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40'
                              : 'bg-amber-500/20 text-amber-300 border-amber-500/40'
                          }`}
                        >
                          {demo.expectedRisk} RISK
                        </span>
                        <span className="text-xs text-slate-400 font-medium">{demo.relation}</span>
                      </div>

                      <h3 className="font-bold text-white text-sm group-hover:text-blue-400 transition-colors">
                        {demo.title}
                      </h3>
                      <p className="text-xs text-slate-400 line-clamp-2">{demo.callerDesc}</p>
                    </div>

                    <div className="mt-4 pt-3 border-t border-slate-700/60 flex items-center justify-between text-xs text-blue-400 font-semibold">
                      <span className="flex items-center space-x-1">
                        <Play className="w-3.5 h-3.5 fill-current" />
                        <span>Run Full Scan</span>
                      </span>
                      <Sparkles className="w-4 h-4 opacity-0 group-hover:opacity-100 transition-opacity" />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* MODE 2: LIVE MICROPHONE RECORDING */}
        {activeMode === 'record' && (
          <div className="flex flex-col items-center justify-center py-8 space-y-6">
            {/* Visual Record Orb */}
            <div className="relative">
              {isRecording && (
                <div className="absolute inset-0 rounded-full bg-rose-500 animate-ping opacity-40 scale-125" />
              )}
              <div
                className={`w-28 h-28 rounded-full flex items-center justify-center transition-all ${
                  isRecording
                    ? 'bg-rose-600 text-white shadow-xl shadow-rose-600/30'
                    : 'bg-slate-800 text-slate-300 border border-slate-700 hover:border-blue-500'
                }`}
              >
                <Mic className={`w-12 h-12 ${isRecording ? 'animate-pulse' : ''}`} />
              </div>
            </div>

            {/* Timer and Status */}
            <div className="text-center">
              <span className="text-3xl font-black text-white font-mono tracking-wider">
                {formatSeconds(recordingSeconds)}
              </span>
              <p className="text-xs text-slate-400 mt-1">
                {isRecording ? t.recordingInProgress : 'Press button below to begin recording'}
              </p>
            </div>

            {/* Control Button */}
            {!isRecording ? (
              <button
                type="button"
                onClick={startRecording}
                disabled={isLoading}
                className="w-full sm:w-auto px-8 py-3.5 bg-blue-600 hover:bg-blue-500 text-white font-bold rounded-xl shadow-lg shadow-blue-600/30 flex items-center justify-center space-x-2 transition-all"
              >
                <Mic className="w-5 h-5" />
                <span>{t.startRecord}</span>
              </button>
            ) : (
              <button
                type="button"
                onClick={stopRecording}
                className="w-full sm:w-auto px-8 py-3.5 bg-rose-600 hover:bg-rose-500 text-white font-bold rounded-xl shadow-lg shadow-rose-600/30 flex items-center justify-center space-x-2 transition-all animate-pulse"
              >
                <Square className="w-5 h-5 fill-current" />
                <span>{t.stopRecord}</span>
              </button>
            )}

            {/* If recorded blob ready */}
            {recordedBlob && !isRecording && (
              <div className="w-full max-w-md bg-slate-800/80 p-4 rounded-xl border border-slate-700 flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <Music className="w-5 h-5 text-cyan-400" />
                  <div>
                    <p className="text-xs font-semibold text-white">Recorded Voice Note ({formatSeconds(recordingSeconds)})</p>
                    <p className="text-[10px] text-slate-400">Ready for forensic scan</p>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => runAnalysis(recordedBlob, 'live_recording.wav')}
                  disabled={isLoading}
                  className="px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold rounded-lg transition-all shadow-md"
                >
                  Analyze Audio
                </button>
              </div>
            )}
          </div>
        )}

        {/* MODE 3: AUDIO FILE UPLOAD */}
        {activeMode === 'upload' && (
          <div className="space-y-4">
            <input
              type="file"
              ref={fileInputRef}
              accept="audio/*,.mp3,.wav,.ogg,.opus,.m4a"
              className="hidden"
              onChange={(e) => {
                const file = e.target.files?.[0];
                if (file) setUploadedFile(file);
              }}
            />

            <div
              onClick={() => fileInputRef.current?.click()}
              className="border-2 border-dashed border-slate-700 hover:border-blue-500 rounded-xl p-8 text-center cursor-pointer transition-all bg-slate-800/30 hover:bg-slate-800/60"
            >
              <Upload className="w-10 h-10 text-slate-400 mx-auto mb-3" />
              <p className="text-sm font-semibold text-white">{t.dragDropText}</p>
              <p className="text-xs text-slate-500 mt-1">Supports WhatsApp Voice Notes (.opus, .ogg) & Calls (.mp3, .wav)</p>
            </div>

            {uploadedFile && (
              <div className="bg-slate-800/80 p-4 rounded-xl border border-slate-700 flex items-center justify-between">
                <div className="flex items-center space-x-3 truncate">
                  <Music className="w-5 h-5 text-blue-400 flex-shrink-0" />
                  <div className="truncate">
                    <p className="text-xs font-semibold text-white truncate">{uploadedFile.name}</p>
                    <p className="text-[10px] text-slate-400">
                      {(uploadedFile.size / (1024 * 1024)).toFixed(2)} MB • {uploadedFile.type || 'audio'}
                    </p>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => runAnalysis(uploadedFile, uploadedFile.name)}
                  disabled={isLoading}
                  className="px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold rounded-lg transition-all shadow-md ml-3 flex-shrink-0"
                >
                  {t.analyzeBtn}
                </button>
              </div>
            )}
          </div>
        )}

        {/* Consent & Ethics Disclaimer Checkbox (Step 9 from guide) */}
        <div className="mt-6 pt-4 border-t border-slate-800">
          <label className="flex items-start space-x-3 cursor-pointer">
            <input
              type="checkbox"
              checked={hasConsent}
              onChange={(e) => setHasConsent(e.target.checked)}
              className="mt-0.5 w-4 h-4 rounded text-blue-600 bg-slate-800 border-slate-700 focus:ring-blue-500"
            />
            <span className="text-xs text-slate-400 leading-relaxed">
              {t.consentText}
            </span>
          </label>
        </div>

        {/* Error Notification */}
        {errorMessage && (
          <div className="mt-4 p-3 bg-rose-500/10 border border-rose-500/30 rounded-xl flex items-center space-x-3 text-rose-300 text-xs">
            <AlertCircle className="w-4 h-4 flex-shrink-0" />
            <span>{errorMessage}</span>
          </div>
        )}

        {/* Loading Spinner Indicator */}
        {isLoading && (
          <div className="mt-6 p-6 bg-slate-800/90 rounded-xl border border-blue-500/40 text-center space-y-3 animate-pulse">
            <Loader2 className="w-8 h-8 text-blue-400 animate-spin mx-auto" />
            <div>
              <p className="text-sm font-bold text-white">{t.analyzingText}</p>
              <p className="text-xs text-slate-400 mt-1">
                Querying DetectifAI API & Gemini Reasoning Engine...
              </p>
            </div>
          </div>
        )}
      </div>

      {/* Honest Disclaimer (Step 9 from build guide) */}
      <div className="bg-slate-900/60 p-4 rounded-xl border border-slate-800 flex items-start space-x-3 text-slate-400 text-xs">
        <ShieldCheck className="w-4 h-4 text-cyan-400 flex-shrink-0 mt-0.5" />
        <p>{t.disclaimer}</p>
      </div>
    </div>
  );
};
