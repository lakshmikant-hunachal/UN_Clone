'use client';

import React, { useState } from 'react';
import { HelpCircle, CheckCircle2, XCircle, ArrowRight, RotateCcw, Award, Lightbulb, Volume2 } from 'lucide-react';
import { QUIZ_SCENARIOS } from '../lib/quizScenarios';
import { Language } from '../types';

interface AwarenessQuizProps {
  lang: Language;
}

export const AwarenessQuiz: React.FC<AwarenessQuizProps> = ({ lang }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [showExplanation, setShowExplanation] = useState(false);
  const [score, setScore] = useState(0);
  const [isCompleted, setIsCompleted] = useState(false);

  const scenario = QUIZ_SCENARIOS[currentIndex];

  const handleSelectOption = (index: number) => {
    if (showExplanation) return;
    setSelectedOption(index);
    setShowExplanation(true);

    if (index === scenario.correctIndex) {
      setScore((prev) => prev + 1);
    }
  };

  const handleNext = () => {
    if (currentIndex < QUIZ_SCENARIOS.length - 1) {
      setCurrentIndex((prev) => prev + 1);
      setSelectedOption(null);
      setShowExplanation(false);
    } else {
      setIsCompleted(true);
    }
  };

  const handleRestart = () => {
    setCurrentIndex(0);
    setSelectedOption(null);
    setShowExplanation(false);
    setScore(0);
    setIsCompleted(false);
  };

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      {/* Header */}
      <div>
        <h2 className="text-2xl sm:text-3xl font-bold text-white flex items-center space-x-2">
          <HelpCircle className="w-7 h-7 text-blue-400" />
          <span>Family Scam Simulator & Quiz</span>
        </h2>
        <p className="text-sm text-slate-400 mt-1">
          Practice recognizing voice clones and high-pressure extortion tactics in a safe environment.
        </p>
      </div>

      {!isCompleted ? (
        <div className="bg-slate-900/90 rounded-2xl border border-slate-800 p-6 sm:p-8 shadow-xl space-y-6">
          {/* Progress bar & Question Tracker */}
          <div className="flex items-center justify-between text-xs font-semibold text-slate-400">
            <span>
              Scenario {currentIndex + 1} of {QUIZ_SCENARIOS.length}
            </span>
            <span className="text-blue-400">Score: {score} pts</span>
          </div>

          <div className="w-full bg-slate-800 h-2 rounded-full overflow-hidden">
            <div
              className="bg-blue-600 h-full transition-all duration-300"
              style={{ width: `${((currentIndex + 1) / QUIZ_SCENARIOS.length) * 100}%` }}
            />
          </div>

          {/* Scenario Details */}
          <div className="bg-slate-950/70 p-5 rounded-xl border border-slate-800 space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-blue-400 uppercase tracking-wide">
                {scenario.title}
              </span>
              <span className="text-[11px] bg-slate-800 text-slate-300 px-2 py-0.5 rounded">
                Caller: {scenario.caller}
              </span>
            </div>

            <p className="text-sm text-slate-300 font-medium">{scenario.situation}</p>

            {/* Audio Transcript simulation */}
            <div className="mt-3 bg-slate-900 p-3.5 rounded-lg border border-slate-800 flex items-start space-x-2 text-xs font-mono text-amber-200">
              <Volume2 className="w-4 h-4 text-amber-400 flex-shrink-0 mt-0.5" />
              <span>"{scenario.transcript}"</span>
            </div>
          </div>

          {/* Options */}
          <div className="space-y-3">
            <p className="text-sm font-bold text-white">What is the safest immediate action?</p>
            {scenario.options.map((opt, idx) => {
              const isSelected = selectedOption === idx;
              const isCorrect = idx === scenario.correctIndex;

              let btnStyle = 'bg-slate-800/60 border-slate-700/80 hover:bg-slate-800 text-slate-300';
              if (showExplanation) {
                if (isCorrect) {
                  btnStyle = 'bg-emerald-950/40 border-emerald-500 text-emerald-200';
                } else if (isSelected && !isCorrect) {
                  btnStyle = 'bg-rose-950/40 border-rose-500 text-rose-200';
                }
              }

              return (
                <button
                  key={idx}
                  onClick={() => handleSelectOption(idx)}
                  disabled={showExplanation}
                  className={`w-full text-left p-4 rounded-xl border transition-all text-xs sm:text-sm font-medium flex items-start space-x-3 ${btnStyle}`}
                >
                  <span className="w-5 h-5 rounded-full border border-current flex items-center justify-center flex-shrink-0 text-xs mt-0.5">
                    {String.fromCharCode(65 + idx)}
                  </span>
                  <span className="flex-1">{opt}</span>
                  {showExplanation && isCorrect && (
                    <CheckCircle2 className="w-5 h-5 text-emerald-400 flex-shrink-0" />
                  )}
                  {showExplanation && isSelected && !isCorrect && (
                    <XCircle className="w-5 h-5 text-rose-400 flex-shrink-0" />
                  )}
                </button>
              );
            })}
          </div>

          {/* Explanation Box */}
          {showExplanation && (
            <div className="p-4 rounded-xl bg-slate-800/90 border border-blue-500/30 space-y-2 animate-fadeIn">
              <div className="flex items-center space-x-2 text-blue-400 font-bold text-xs uppercase tracking-wider">
                <Lightbulb className="w-4 h-4 text-amber-400" />
                <span>Security Analysis & Why This Works:</span>
              </div>
              <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
                {scenario.explanation}
              </p>
            </div>
          )}

          {/* Next Button */}
          {showExplanation && (
            <div className="flex justify-end pt-2">
              <button
                onClick={handleNext}
                className="flex items-center space-x-2 px-6 py-2.5 bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs sm:text-sm rounded-xl shadow-lg transition-all"
              >
                <span>{currentIndex < QUIZ_SCENARIOS.length - 1 ? 'Next Scenario' : 'View Results'}</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          )}
        </div>
      ) : (
        /* Completed Quiz Score Card */
        <div className="bg-slate-900/90 rounded-2xl border border-slate-800 p-8 shadow-xl text-center space-y-6">
          <div className="w-20 h-20 rounded-full bg-blue-600/20 border border-blue-500/40 flex items-center justify-center mx-auto text-blue-400">
            <Award className="w-10 h-10 text-amber-400" />
          </div>

          <div className="space-y-2">
            <h3 className="text-2xl font-black text-white">Family Scam Training Complete!</h3>
            <p className="text-sm text-slate-400">
              You correctly solved {score} out of {QUIZ_SCENARIOS.length} extortion scenarios.
            </p>
          </div>

          <div className="max-w-md mx-auto bg-slate-950 p-4 rounded-xl border border-slate-800 text-xs text-slate-300 text-left space-y-2">
            <p className="font-bold text-white">Key Takeaways for Every Family:</p>
            <p>1. <strong>Always Hang Up:</strong> Breaking the line immediately neutralizes psychological urgency.</p>
            <p>2. <strong>Redial Saved Contact:</strong> Never call back the incoming caller ID.</p>
            <p>3. <strong>Verify the Safe-Word:</strong> Cloned voice models cannot guess your household secret.</p>
          </div>

          <button
            onClick={handleRestart}
            className="inline-flex items-center space-x-2 px-6 py-2.5 bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs sm:text-sm rounded-xl shadow-md transition-all"
          >
            <RotateCcw className="w-4 h-4" />
            <span>Retake Simulation</span>
          </button>
        </div>
      )}
    </div>
  );
};
