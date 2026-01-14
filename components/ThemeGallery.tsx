
import React, { useState } from 'react';
import { ArrowRight, Sparkles, ChevronLeft, ChevronRight, Loader2, Send } from 'lucide-react';
import { generateTimetableThemes } from '../geminiService';
import { useTimetableStore } from '../store';

export const ThemeGallery: React.FC = () => {
  const { generatedThemes, setGeneratedThemes, setSelectedTheme } = useTimetableStore();
  const [isGenerating, setIsGenerating] = useState(false);
  const [customPrompt, setCustomPrompt] = useState('');
  const [showAiInput, setShowAiInput] = useState(false);

  const handleGenerate = async () => {
    setIsGenerating(true);
    try {
      const themes = await generateTimetableThemes(showAiInput ? customPrompt : undefined);
      setGeneratedThemes(themes);
    } catch (err) {
      console.error(err);
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <section className="w-full max-w-5xl mx-auto px-4 py-16">
      <div className="flex flex-col items-center gap-12">
        <button
          onClick={handleGenerate}
          disabled={isGenerating}
          className="group relative px-12 py-5 bg-white text-black font-bold text-2xl rounded-2xl hover:bg-zinc-200 transition-all flex items-center gap-4 disabled:opacity-50 disabled:cursor-not-allowed shadow-[0_0_40px_rgba(255,255,255,0.1)] hover:shadow-[0_0_60px_rgba(255,255,255,0.2)]"
        >
          {isGenerating ? <Loader2 className="w-8 h-8 animate-spin" /> : "Generate"}
          {!isGenerating && <ArrowRight className="w-8 h-8 group-hover:translate-x-2 transition-transform" />}
        </button>

        <div className="w-full flex flex-col items-center gap-8 mt-4">
          <label className="flex items-center gap-4 cursor-pointer select-none group">
            <div className="relative">
              <input 
                type="checkbox" 
                className="sr-only" 
                checked={showAiInput}
                onChange={() => setShowAiInput(!showAiInput)}
              />
              <div className={`w-14 h-7 rounded-full transition-colors ${showAiInput ? 'bg-blue-600' : 'bg-zinc-800 group-hover:bg-zinc-700'}`} />
              <div className={`absolute top-1 left-1 bg-white w-5 h-5 rounded-full transition-transform duration-300 ${showAiInput ? 'translate-x-7' : 'translate-x-0'}`} />
            </div>
            <div className={`flex items-center gap-2 font-semibold transition-colors ${showAiInput ? 'text-blue-400' : 'text-zinc-500'}`}>
              <Sparkles className={`w-5 h-5 ${showAiInput ? 'animate-pulse' : ''}`} />
              Customise with AI
            </div>
          </label>

          {showAiInput && (
            <div className="w-full max-w-2xl relative animate-in slide-in-from-top-4 duration-300">
              <textarea
                placeholder="Describe your style (e.g., 'Modern minimalist with pastel colors', 'Cyberpunk neon vibe', 'Earthy tones and rounded corners')..."
                value={customPrompt}
                onChange={(e) => setCustomPrompt(e.target.value)}
                className="w-full bg-zinc-900 border border-zinc-800 rounded-2xl p-5 pb-16 text-sm outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 min-h-[140px] shadow-2xl placeholder:text-zinc-600 transition-all"
              />
              <div className="absolute bottom-4 right-4 flex items-center gap-3">
                <span className="text-[10px] text-zinc-600 font-mono">Press Shift+Enter to submit</span>
                <button
                  onClick={handleGenerate}
                  disabled={isGenerating || !customPrompt.trim()}
                  className="bg-blue-600 hover:bg-blue-500 disabled:bg-zinc-800 disabled:text-zinc-600 p-3 rounded-xl transition-all flex items-center gap-2 group/btn"
                >
                  <span className="text-xs font-bold uppercase tracking-wider px-1">Refine Themes</span>
                  <Send className="w-4 h-4 group-hover/btn:translate-x-1 group-hover/btn:-translate-y-1 transition-transform" />
                </button>
              </div>
            </div>
          )}
        </div>

        {generatedThemes.length > 0 && (
          <div className="w-full space-y-8 animate-in fade-in slide-in-from-bottom-8 duration-700">
            <div className="flex items-center justify-between mb-2">
                <h3 className="text-xl font-bold text-zinc-400">Select a theme</h3>
                <div className="flex gap-2">
                    <button className="p-2 bg-zinc-900 rounded-xl border border-zinc-800 text-zinc-400 hover:text-white hover:bg-zinc-800 transition-all">
                        <ChevronLeft className="w-5 h-5" />
                    </button>
                    <button className="p-2 bg-zinc-900 rounded-xl border border-zinc-800 text-zinc-400 hover:text-white hover:bg-zinc-800 transition-all">
                        <ChevronRight className="w-5 h-5" />
                    </button>
                </div>
            </div>

            <div className="relative group">
              <div className="flex overflow-x-auto gap-6 pb-8 snap-x no-scrollbar scroll-smooth">
                {generatedThemes.map((theme) => (
                  <button
                    key={theme.id}
                    onClick={() => setSelectedTheme(theme)}
                    className="flex-shrink-0 w-72 h-44 rounded-[2rem] snap-center p-6 text-left flex flex-col justify-end transition-all hover:scale-[1.03] hover:shadow-2xl active:scale-[0.98] group/card"
                    style={{ 
                      background: theme.background,
                      border: `1px solid ${theme.accentColor}30`,
                    }}
                  >
                    <div 
                      className="w-12 h-12 rounded-2xl mb-auto shadow-lg flex items-center justify-center" 
                      style={{ backgroundColor: theme.primaryColor }}
                    >
                        <div className="w-4 h-4 rounded-full bg-white/20" />
                    </div>
                    <div>
                        <h3 className="font-bold text-xl mb-1" style={{ color: theme.textColor }}>{theme.name}</h3>
                        <p className="text-xs font-medium opacity-60 uppercase tracking-widest" style={{ color: theme.textColor }}>Preview Design</p>
                    </div>
                  </button>
                ))}
              </div>
            </div>

            <div className="flex justify-center gap-3">
              {[0, 1, 2, 3].map((i) => (
                <div key={i} className={`h-1.5 rounded-full transition-all ${i === 0 ? 'w-8 bg-blue-500' : 'w-2 bg-zinc-800'}`} />
              ))}
            </div>
          </div>
        )}
      </div>
    </section>
  );
};
