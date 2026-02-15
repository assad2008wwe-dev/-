import React, { useState } from 'react';
import { Section, Difficulty, Question } from '../types';
import { generateMCQ } from '../services/geminiService';
import { Loader2, CheckCircle, XCircle, ChevronRight, RefreshCw, AlertCircle, Activity, ArrowLeft, Settings2 } from 'lucide-react';

interface Props {
  section: Section;
  onBack: () => void;
}

const MCQView: React.FC<Props> = ({ section, onBack }) => {
  const [configStep, setConfigStep] = useState(true);
  const [difficulty, setDifficulty] = useState<Difficulty>(Difficulty.Medium);
  const [questionCount, setQuestionCount] = useState<number>(10);
  const [loading, setLoading] = useState(false);
  const [questions, setQuestions] = useState<Question[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [score, setScore] = useState(0);
  const [showResult, setShowResult] = useState(false);
  const [quizCompleted, setQuizCompleted] = useState(false);

  const startQuiz = async () => {
    setLoading(true);
    try {
      const qs = await generateMCQ(section.content, difficulty, questionCount);
      setQuestions(qs);
      setConfigStep(false);
      setCurrentIndex(0);
      setScore(0);
      setQuizCompleted(false);
    } catch (e) {
      alert("Failed to generate quiz. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleAnswer = (index: number) => {
    if (showResult) return;
    setSelectedAnswer(index);
    setShowResult(true);
    if (index === questions[currentIndex].correctAnswerIndex) {
      setScore(s => s + 1);
    }
  };

  const nextQuestion = () => {
    if (currentIndex < questions.length - 1) {
      setCurrentIndex(prev => prev + 1);
      setSelectedAnswer(null);
      setShowResult(false);
    } else {
      setQuizCompleted(true);
    }
  };

  // --- RENDERING ---

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center h-full min-h-[500px] text-slate-400">
        <div className="relative">
          <div className="absolute inset-0 bg-rose-500 blur-xl opacity-20 rounded-full animate-pulse"></div>
          <Loader2 className="w-16 h-16 animate-spin text-rose-500 relative z-10 mb-6" />
        </div>
        <h3 className="text-xl font-bold text-slate-200 mb-2">Creating Quiz</h3>
        <p className="text-sm">Analyzing {section.title}...</p>
      </div>
    );
  }

  if (configStep) {
    return (
      <div className="p-4 sm:p-8 max-w-xl mx-auto">
        <div className="flex items-center mb-8">
            <button onClick={onBack} className="p-2 -ml-2 text-slate-400 hover:text-white transition-colors">
                <ArrowLeft className="w-6 h-6" />
            </button>
            <h2 className="text-2xl font-bold text-white ml-2">New Quiz</h2>
        </div>
        
        <div className="bg-slate-800 rounded-3xl p-8 shadow-2xl border border-slate-700">
          <div className="flex items-center gap-3 mb-8 text-rose-500">
            <Settings2 className="w-6 h-6" />
            <span className="font-semibold tracking-wider uppercase text-xs">Configuration</span>
          </div>

          <div className="space-y-8">
            <div>
              <label className="block text-sm font-medium text-slate-400 mb-4">Difficulty Level</label>
              <div className="grid grid-cols-3 gap-3">
                {[Difficulty.Easy, Difficulty.Medium, Difficulty.Hard].map((d) => (
                  <button
                    key={d}
                    onClick={() => setDifficulty(d)}
                    className={`py-3 px-4 rounded-xl text-sm font-bold transition-all ${
                      difficulty === d
                        ? 'bg-rose-500 text-white shadow-lg shadow-rose-500/30 translate-y-[-2px]'
                        : 'bg-slate-700 text-slate-300 hover:bg-slate-600'
                    }`}
                  >
                    {d}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-400 mb-4">Questions</label>
              <div className="flex gap-3 overflow-x-auto pb-2 no-scrollbar">
                {[5, 10, 15, 20, 30].map((n) => (
                  <button
                    key={n}
                    onClick={() => setQuestionCount(n)}
                    className={`min-w-[60px] py-3 rounded-xl text-sm font-bold transition-all ${
                      questionCount === n
                        ? 'bg-rose-500 text-white shadow-lg shadow-rose-500/30'
                        : 'bg-slate-700 text-slate-300 hover:bg-slate-600'
                    }`}
                  >
                    {n}
                  </button>
                ))}
              </div>
            </div>

            <button 
                onClick={startQuiz}
                className="w-full py-4 bg-gradient-to-r from-rose-500 to-orange-500 hover:from-rose-400 hover:to-orange-400 text-white font-bold rounded-2xl shadow-lg transition-all transform hover:scale-[1.02] mt-4"
              >
                Start Challenge
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (quizCompleted) {
    const percentage = Math.round((score / questions.length) * 100);
    return (
      <div className="p-4 sm:p-8 max-w-xl mx-auto text-center h-full flex flex-col justify-center">
        <div className="bg-slate-800 rounded-3xl p-10 shadow-2xl border border-slate-700 relative overflow-hidden">
          {/* Background decoration */}
          <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-rose-500 to-orange-500"></div>
          
          <div className="mb-6 inline-flex p-6 rounded-full bg-slate-700/50 relative">
            {percentage >= 70 ? (
              <CheckCircle className="w-16 h-16 text-emerald-400" />
            ) : (
              <Activity className="w-16 h-16 text-rose-500" />
            )}
          </div>
          
          <h2 className="text-3xl font-bold text-white mb-2">Quiz Complete</h2>
          <p className="text-slate-400 mb-8">You scored {score} out of {questions.length}</p>
          
          <div className="text-6xl font-black text-transparent bg-clip-text bg-gradient-to-r from-rose-400 to-orange-400 mb-10">
            {percentage}%
          </div>

          <div className="grid grid-cols-2 gap-4">
            <button onClick={onBack} className="py-3 bg-slate-700 hover:bg-slate-600 text-white rounded-xl font-semibold transition-colors">
              Menu
            </button>
            <button 
              onClick={() => setConfigStep(true)}
              className="py-3 bg-white text-slate-900 hover:bg-slate-200 rounded-xl font-bold transition-colors flex items-center justify-center gap-2"
            >
              <RefreshCw className="w-4 h-4" />
              Retry
            </button>
          </div>
        </div>
      </div>
    );
  }

  const currentQ = questions[currentIndex];

  return (
    <div className="max-w-3xl mx-auto p-4 flex flex-col h-full">
      {/* Top Bar */}
      <div className="flex justify-between items-center mb-6">
         <button onClick={onBack} className="p-2 rounded-full hover:bg-slate-800 text-slate-400 hover:text-white transition-colors">
            <XCircle className="w-6 h-6" />
         </button>
         <div className="flex flex-col items-center">
             <span className="text-xs font-bold text-slate-500 tracking-widest uppercase">Question</span>
             <span className="text-lg font-bold text-white">{currentIndex + 1} <span className="text-slate-600">/ {questions.length}</span></span>
         </div>
         <div className="p-2 bg-slate-800 rounded-lg text-rose-500 font-bold text-sm">
             Pts: {score}
         </div>
      </div>

      {/* Progress Bar */}
      <div className="w-full h-1.5 bg-slate-800 rounded-full mb-8">
          <div 
            className="h-full bg-gradient-to-r from-rose-500 to-orange-500 rounded-full transition-all duration-500"
            style={{ width: `${((currentIndex + 1) / questions.length) * 100}%` }}
          ></div>
      </div>

      {/* Question Card */}
      <div className="bg-slate-800 rounded-3xl p-6 sm:p-10 shadow-xl border border-slate-700 flex-1 flex flex-col">
        <h3 className="text-xl sm:text-2xl font-bold text-white mb-8 leading-relaxed">
            {currentQ.text}
        </h3>

        <div className="space-y-4 flex-1">
          {currentQ.options.map((option, idx) => {
            let btnClass = "w-full text-left p-5 rounded-2xl border-2 transition-all duration-200 flex justify-between items-center group ";
            if (showResult) {
              if (idx === currentQ.correctAnswerIndex) {
                btnClass += "border-emerald-500/50 bg-emerald-500/10 text-emerald-400";
              } else if (idx === selectedAnswer) {
                btnClass += "border-rose-500/50 bg-rose-500/10 text-rose-400";
              } else {
                btnClass += "border-slate-700 bg-slate-800/50 text-slate-500 opacity-50";
              }
            } else {
              btnClass += "border-slate-700 bg-slate-700/30 hover:bg-slate-700 hover:border-rose-500/50 text-slate-200";
            }

            return (
              <button
                key={idx}
                onClick={() => handleAnswer(idx)}
                disabled={showResult}
                className={btnClass}
              >
                <span className="font-medium text-lg">{option}</span>
                {showResult && idx === currentQ.correctAnswerIndex && <CheckCircle className="w-6 h-6 text-emerald-500" />}
                {showResult && idx === selectedAnswer && idx !== currentQ.correctAnswerIndex && <XCircle className="w-6 h-6 text-rose-500" />}
              </button>
            );
          })}
        </div>

        {/* Explanation & Next */}
        {showResult && (
            <div className="mt-8 pt-6 border-t border-slate-700 animate-in fade-in slide-in-from-bottom-4">
                {currentQ.explanation && (
                    <div className="mb-6 p-4 bg-slate-900/50 rounded-xl text-blue-300 text-sm flex gap-3 border border-slate-700">
                    <AlertCircle className="w-5 h-5 flex-shrink-0" />
                    <p>{currentQ.explanation}</p>
                    </div>
                )}
                
                <button 
                    onClick={nextQuestion}
                    className="w-full py-4 bg-white hover:bg-slate-200 text-slate-900 font-bold rounded-2xl transition-all flex items-center justify-center gap-2"
                >
                    {currentIndex === questions.length - 1 ? "Finish Quiz" : "Next Question"}
                    <ChevronRight className="w-5 h-5" />
                </button>
            </div>
        )}
      </div>
    </div>
  );
};

export default MCQView;