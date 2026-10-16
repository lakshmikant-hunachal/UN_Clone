'use client';

import React, { useState, useRef, useEffect } from 'react';
import { MessageSquare, Mic, Square, Upload, FileText, AlertCircle, Loader2, Music, ShieldCheck } from 'lucide-react';
import { Language, AnalysisResult } from '../types';
import { translations } from '../lib/translations';

const BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_URL || 'http://127.0.0.1:8000';

interface AudioScannerProps {
  lang: Language;
  onAnalysisComplete: (result: AnalysisResult) => void;
  isLoading: boolean;
  setIsLoading: (val: boolean) => void;
  token: string | null;
}

export const AudioScanner: React.FC<AudioScannerProps> = ({
  lang,
  onAnalysisComplete,
  isLoading,
  setIsLoading,
  token,
}) => {
  const t = translations[lang];

  // Default tab is now Message / Text as requested in v2 guide!
  const [activeMode, setActiveMode] = useState<'text' | 'voice'>('text');
  const [textInput, setTextInput] = useState<string>('');
  const [selectedRelation, setSelectedRelation] = useState<string>('Grandson');
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // File Upload State
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const txtFileInputRef = useRef<HTMLInputElement | null>(null);

  // Live Recording State
  const [isRecording, setIsRecording] = useState<boolean>(false);
  const [recordingSeconds, setRecordingSeconds] = useState<number>(0);
  const [recordedBlob, setRecordedBlob] = useState<Blob | null>(null);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, []);

  // Text File (.txt) loader
  const handleTxtFileLoad = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        const content = event.target?.result as string;
        if (content) {
          setTextInput(content.slice(0, 10000));
        }
      };
      reader.readAsText(file);
    }
  };

  // 1. Text Analysis Handler
  const handleAnalyzeText = async () => {
    if (!textInput.trim()) {
      setErrorMessage('Please paste or type the message text to analyze.');
      return;
    }

    try {
      setIsLoading(true);
      setErrorMessage(null);

      const headers: Record<string, string> = {
        'Content-Type': 'application/json',
      };
      if (token) {
        headers['Authorization'] = `Bearer ${token}`;
      }

      const res = await fetch(`${BACKEND_URL}/analyze-text`, {
        method: 'POST',
        headers,
        body: JSON.stringify({
          text: textInput,
          claimed_relation: selectedRelation,
        }),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.detail || 'Text analysis failed on server.');
      }

      onAnalysisComplete(data);
    } catch (err: any) {
      setErrorMessage(err.message || 'Analysis failed. Please verify backend connection.');
    } finally {
      setIsLoading(false);
    }
  };

  // 2. Audio Analysis Handler
  const handleAnalyzeAudio = async (audioData: File | Blob, filename: string) => {
    try {
      setIsLoading(true);
      setErrorMessage(null);

      const formData = new FormData();
      formData.append('audio', audioData, filename);
      if (selectedRelation) {
        formData.append('claimed_relation', selectedRelation);
      }

      const headers: Record<string, string> = {};
      if (token) {
        headers['Authorization'] = `Bearer ${token}`;
      }

      const res = await fetch(`${BACKEND_URL}/analyze`, {
        method: 'POST',
        headers,
        body: formData,
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.detail || 'Voice analysis failed on server.');
      }

      if (audioData instanceof Blob) {
        data.audioBlobUrl = URL.createObjectURL(audioData);
      }

      onAnalysisComplete(data);
    } catch (err: any) {
      setErrorMessage(err.message || 'Voice analysis failed. Please verify backend connection.');
    } finally {
      setIsLoading(false);
    }
  };

  // Live Mic Recording
  const startRecording = async () => {
    try {
      setErrorMessage(null);
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      audioChunksRef.current = [];
      const mediaRecorder = new MediaRecorder(stream);
      mediaRecorderRef.current = mediaRecorder;

      mediaRecorder.ondataavailable = (event) => {
        if (event.data.size > 0) audioChunksRef.current.push(event.data);
      };

      mediaRecorder.onstop = () => {
        const blob = new Blob(audioChunksRef.current, { type: 'audio/wav' });
        setRecordedBlob(blob);
        stream.getTracks().forEach((track) => track.stop());
      };

      mediaRecorder.start();
      setIsRecording(true);
      setRecordingSeconds(0);
      timerRef.current = setInterval(() => setRecordingSeconds((prev) => prev + 1), 1000);
    } catch (err) {
      setErrorMessage('Microphone access denied or not available.');
    }
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop();
      setIsRecording(false);
      if (timerRef.current) clearInterval(timerRef.current);
    }
  };

  const formatSeconds = (sec: number) => {
    const m = Math.floor(sec / 60);
    const s = sec % 60;
    return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Title */}
      <div className="text-center space-y-2">
        <h1 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
          {t.scannerHeading}
        </h1>
        <p className="text-slate-400 text-xs sm:text-sm max-w-2xl mx-auto">
          {t.scannerSubheading}
        </p>
      </div>

      {/* Mode Switcher Tabs */}
      <div className="flex bg-slate-900 p-1.5 rounded-xl border border-slate-800 shadow-md">
        <button
          onClick={() => setActiveMode('text')}
          className={`flex-1 flex items-center justify-center space-x-2 py-3 rounded-lg text-sm font-semibold transition-all ${
            activeMode === 'text'
              ? 'bg-blue-600 text-white shadow-lg'
              : 'text-slate-400 hover:text-white hover:bg-slate-800/50'
          }`}
        >
          <MessageSquare className="w-4 h-4" />
          <span>{t.textModeTab}</span>
        </button>

        <button
          onClick={() => setActiveMode('voice')}
          className={`flex-1 flex items-center justify-center space-x-2 py-3 rounded-lg text-sm font-semibold transition-all ${
            activeMode === 'voice'
              ? 'bg-blue-600 text-white shadow-lg'
              : 'text-slate-400 hover:text-white hover:bg-slate-800/50'
          }`}
        >
          <Mic className="w-4 h-4" />
          <span>{t.voiceModeTab}</span>
        </button>
      </div>

      {/* Container */}
      <div className="bg-slate-900/90 rounded-2xl border border-slate-800 p-6 sm:p-8 shadow-2xl backdrop-blur-sm">
        {/* Claimed Relationship */}
        <div className="mb-6">
          <label className="block text-xs font-semibold text-slate-300 mb-2">
            Who did the caller or sender claim to be?
          </label>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
            {[
              { id: 'Grandson', label: 'Grandson / Granddaughter' },
              { id: 'Child', label: 'Son / Daughter' },
              { id: 'Police', label: 'Police / Law Enforcement' },
              { id: 'Other', label: 'Other Relative / Unknown' },
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

        {/* TAB 1: TEXT / MESSAGE INPUT (Default) */}
        {activeMode === 'text' && (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider">
                Suspicious Message Text / Conversation Transcript
              </label>
              <button
                type="button"
                onClick={() => txtFileInputRef.current?.click()}
                className="text-xs text-blue-400 hover:text-blue-300 flex items-center space-x-1 font-semibold"
              >
                <FileText className="w-3.5 h-3.5" />
                <span>{t.uploadTxtBtn}</span>
              </button>
              <input
                type="file"
                ref={txtFileInputRef}
                accept=".txt"
                className="hidden"
                onChange={handleTxtFileLoad}
              />
            </div>

            <textarea
              rows={6}
              value={textInput}
              onChange={(e) => setTextInput(e.target.value)}
              placeholder={t.textPlaceholder}
              className="w-full bg-slate-950/80 border border-slate-700/80 rounded-xl p-4 text-xs sm:text-sm text-white placeholder-slate-500 focus:outline-none focus:border-blue-500 leading-relaxed font-mono"
            />

            <div className="flex items-center justify-between text-[11px] text-slate-500">
              <span>{textInput.length} / 10,000 characters</span>
              <span>Only factual entities extracted; nothing invented</span>
            </div>

            <button
              type="button"
              onClick={handleAnalyzeText}
              disabled={isLoading || !textInput.trim()}
              className="w-full py-3.5 bg-blue-600 hover:bg-blue-500 text-white font-bold rounded-xl shadow-lg shadow-blue-600/30 flex items-center justify-center space-x-2 transition-all disabled:opacity-50"
            >
              <span>{t.analyzeTextBtn}</span>
            </button>
          </div>
        )}

        {/* TAB 2: VOICE RECORDING & AUDIO UPLOAD */}
        {activeMode === 'voice' && (
          <div className="space-y-6">
            <div className="flex flex-col sm:flex-row items-center justify-between gap-6 py-4">
              {/* Live Mic Recorder */}
              <div className="flex-1 flex flex-col items-center justify-center p-6 bg-slate-950/60 rounded-xl border border-slate-800 space-y-4 w-full">
                <div
                  className={`w-20 h-20 rounded-full flex items-center justify-center transition-all ${
                    isRecording
                      ? 'bg-rose-600 text-white shadow-xl shadow-rose-600/40 animate-pulse'
                      : 'bg-slate-800 text-slate-300 border border-slate-700'
                  }`}
                >
                  <Mic className="w-8 h-8" />
                </div>
                <div className="text-center">
                  <span className="text-2xl font-black text-white font-mono">{formatSeconds(recordingSeconds)}</span>
                  <p className="text-[11px] text-slate-400 mt-0.5">
                    {isRecording ? 'Recording microphone...' : 'Microphone audio'}
                  </p>
                </div>
                {!isRecording ? (
                  <button
                    type="button"
                    onClick={startRecording}
                    className="px-6 py-2 bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold rounded-xl transition-all"
                  >
                    {t.startRecord}
                  </button>
                ) : (
                  <button
                    type="button"
                    onClick={stopRecording}
                    className="px-6 py-2 bg-rose-600 hover:bg-rose-500 text-white text-xs font-bold rounded-xl animate-pulse"
                  >
                    {t.stopRecord}
                  </button>
                )}

                {recordedBlob && !isRecording && (
                  <button
                    type="button"
                    onClick={() => handleAnalyzeAudio(recordedBlob, 'live_call.wav')}
                    disabled={isLoading}
                    className="mt-2 w-full py-2 bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold rounded-lg shadow-md"
                  >
                    Analyze Recorded Clip
                  </button>
                )}
              </div>

              {/* File Upload Box */}
              <div className="flex-1 w-full">
                <input
                  type="file"
                  ref={fileInputRef}
                  accept="audio/*,.mp3,.wav,.ogg,.opus,.m4a"
                  className="hidden"
                  onChange={(e) => {
                    const f = e.target.files?.[0];
                    if (f) setUploadedFile(f);
                  }}
                />
                <div
                  onClick={() => fileInputRef.current?.click()}
                  className="border-2 border-dashed border-slate-700 hover:border-blue-500 rounded-xl p-6 text-center cursor-pointer transition-all bg-slate-950/40 hover:bg-slate-950/70"
                >
                  <Upload className="w-8 h-8 text-slate-400 mx-auto mb-2" />
                  <p className="text-xs font-semibold text-white">{t.uploadAudioPrompt}</p>
                  <p className="text-[10px] text-slate-500 mt-1">Audio files are never saved on server disk.</p>
                </div>

                {uploadedFile && (
                  <div className="mt-3 bg-slate-800/80 p-3 rounded-xl border border-slate-700 flex items-center justify-between">
                    <div className="truncate text-xs">
                      <p className="font-semibold text-white truncate">{uploadedFile.name}</p>
                      <p className="text-[10px] text-slate-400">{(uploadedFile.size / (1024 * 1024)).toFixed(2)} MB</p>
                    </div>
                    <button
                      type="button"
                      onClick={() => handleAnalyzeAudio(uploadedFile, uploadedFile.name)}
                      disabled={isLoading}
                      className="px-3 py-1.5 bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold rounded-lg ml-2 flex-shrink-0"
                    >
                      Analyze File
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {/* Error Alert */}
        {errorMessage && (
          <div className="mt-4 p-3 bg-rose-500/10 border border-rose-500/30 rounded-xl flex items-center space-x-2 text-rose-300 text-xs">
            <AlertCircle className="w-4 h-4 flex-shrink-0" />
            <span>{errorMessage}</span>
          </div>
        )}

        {/* Loading Spinner */}
        {isLoading && (
          <div className="mt-6 p-6 bg-slate-800/90 rounded-xl border border-blue-500/40 text-center space-y-2 animate-pulse">
            <Loader2 className="w-8 h-8 text-blue-400 animate-spin mx-auto" />
            <p className="text-sm font-bold text-white">Analyzing Forensic Artifacts & Extortion Intent...</p>
            <p className="text-xs text-slate-400">DetectifAI voice verification & Gemini reasoning pipeline active.</p>
          </div>
        )}
      </div>

      {/* Honest Disclaimer */}
      <div className="bg-slate-900/60 p-4 rounded-xl border border-slate-800 flex items-start space-x-3 text-slate-400 text-xs">
        <ShieldCheck className="w-4 h-4 text-cyan-400 flex-shrink-0 mt-0.5" />
        <p>{t.disclaimer}</p>
      </div>
    </div>
  );
};
