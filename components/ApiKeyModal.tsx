import React, { useState } from 'react';
import { setApiKey, hasApiKey } from '../services/geminiService';
import { Key, ChevronRight, Lock, ExternalLink, X } from 'lucide-react';

interface Props {
  onSave: () => void;
  onClose?: () => void;
}

const ApiKeyModal: React.FC<Props> = ({ onSave, onClose }) => {
  const [inputKey, setInputKey] = useState('');
  const [error, setError] = useState('');
  
  // Allow closing if we already have a key (manual open from settings)
  const canClose = hasApiKey();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputKey.trim()) {
      setError('Please enter a valid API key');
      return;
    }
    setApiKey(inputKey.trim());
    onSave();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/80 backdrop-blur-sm">
      <div className="w-full max-w-md bg-slate-800 border border-slate-700 rounded-3xl shadow-2xl p-8 relative overflow-hidden animate-in zoom-in-95 duration-200">
        {/* Decorative background elements */}
        <div className="absolute top-0 right-0 w-32 h-32 bg-rose-500/10 rounded-full blur-2xl -mr-16 -mt-16"></div>
        <div className="absolute bottom-0 left-0 w-32 h-32 bg-indigo-500/10 rounded-full blur-2xl -ml-16 -mb-16"></div>

        {canClose && onClose && (
          <button 
            onClick={onClose}
            className="absolute top-4 right-4 p-2 text-slate-500 hover:text-white rounded-full hover:bg-slate-700/50 transition-colors z-20"
          >
            <X className="w-5 h-5" />
          </button>
        )}

        <div className="relative z-10">
          <div className="w-12 h-12 bg-slate-700/50 rounded-2xl flex items-center justify-center mb-6 text-rose-500 border border-slate-600">
            <Key className="w-6 h-6" />
          </div>

          <h2 className="text-2xl font-bold text-white mb-2">API Key Required</h2>
          <p className="text-slate-400 mb-8 text-sm leading-relaxed">
            BioMaster AI connects to Google Gemini to generate custom quizzes and mind maps. 
            Please enter your API key to proceed.
          </p>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <label htmlFor="apiKey" className="text-xs font-bold text-slate-500 uppercase tracking-wider">
                Gemini API Key
              </label>
              <div className="relative">
                <input
                  id="apiKey"
                  type="password"
                  value={inputKey}
                  onChange={(e) => {
                    setInputKey(e.target.value);
                    setError('');
                  }}
                  className="w-full bg-slate-900 border border-slate-700 rounded-xl px-4 py-3.5 text-white placeholder-slate-600 focus:outline-none focus:ring-2 focus:ring-rose-500/50 focus:border-rose-500 transition-all pl-10"
                  placeholder="AIzaSy..."
                />
                <Lock className="w-4 h-4 text-slate-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
              </div>
              {error && <p className="text-rose-500 text-xs mt-1">{error}</p>}
            </div>

            <button
              type="submit"
              className="w-full py-3.5 bg-gradient-to-r from-rose-500 to-orange-500 hover:from-rose-400 hover:to-orange-400 text-white font-bold rounded-xl shadow-lg transition-all transform active:scale-95 flex items-center justify-center gap-2 group"
            >
              Start Learning
              <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </button>
          </form>

          <div className="mt-6 pt-6 border-t border-slate-700/50 flex justify-center">
            <a 
              href="https://aistudio.google.com/app/apikey" 
              target="_blank" 
              rel="noopener noreferrer"
              className="text-xs text-slate-500 hover:text-rose-400 transition-colors flex items-center gap-1.5"
            >
              Get your free API key here
              <ExternalLink className="w-3 h-3" />
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ApiKeyModal;