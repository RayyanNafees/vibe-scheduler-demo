
import React, { useState } from 'react';
import { ArrowRight, Sparkles, ChevronLeft, ChevronRight, Loader2 } from 'lucide-react';
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
          className="group relative px-12 py-5 bg-white text-black font-bold text-2xl rounded-2xl hover:bg-zinc-200 transition-all flex items-center gap-4 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isGenerating ? <Loader2 className="w-8 h-8 animate-spin" /> : "Generate"}
          {!isGenerating && <ArrowRight className="w-8 h-8 group-hover:translate-x-1 transition-transform" />}
        </button>

        {generatedThemes.length > 0 && (
          <div className="w-full space-y-8">
            <div className="relative group">
              <div className="flex overflow-x-auto gap-6 pb-8 snap-x no-scrollbar">
                {generatedThemes.map((theme) => (
                  <button
                    key={theme.id}
                    onClick={() => setSelectedTheme(theme)}
                    className="flex-shrink-0 w-64 h-40 rounded-3xl snap-center p-4 text-left flex flex-col justify-end transition-transform hover:scale-105"
                    style={{ 
                      background: theme.background,
                      border: `1px solid ${theme.accentColor}30`,
                    }}
                  >
                    <div 
                      className="w-10 h-10 rounded-full mb-2" 
                      style={{ backgroundColor: theme.primaryColor }}
                    />
                    <h3 className="font-bold text-lg" style={{ color: theme.textColor }}>{theme.name}</h3>
                    <p className="text-xs opacity-60" style={{ color: theme.textColor }}>Click to view</p>
                  </button>
                ))}
              </div>
              
              <button className="absolute -left-12 top-1/2 -translate-y-1/2 p-2 bg-zinc-900 rounded-full border border-zinc-800 text-zinc-400 hover:text-white transition-colors hidden md:block">
                <ChevronLeft className="w-6 h-6" />
              </button>
              <button className="absolute -right-12 top-1/2 -translate-y-1/2 p-2 bg-zinc-900 rounded-full border border-zinc-800 text-zinc-400 hover:text-white transition-colors hidden md:block">
                <ChevronRight className="w-6 h-6" />
              </button>
            </div>

            <div className="flex justify-center gap-2">
              {[0, 1, 2, 3].map((i) => (
                <div key={i} className={`w-2 h-2 rounded-full ${i === 0 ? 'bg-blue-500' : 'bg-zinc-800'}`} />
              ))}
            </div>
          </div>
        )}

        <div className="w-full flex flex-col items-center gap-6 mt-8">
          <label className="flex items-center gap-3 cursor-pointer select-none">
            <div className="relative">
              <input 
                type="checkbox" 
                className="sr-only" 
                checked={showAiInput}
                onChange={() => setShowAiInput(!showAiInput)}
              />
              <div className={`w-12 h-6 rounded-full transition-colors ${showAiInput ? 'bg-blue-600' : 'bg-zinc-800'}`} />
              <div className={`absolute top-1 left-1 bg-white w-4 h-4 rounded-full transition-transform ${showAiInput ? 'translate-x-6' : 'translate-x-0'}`} />
            </div>
            <div className="flex items-center gap-2 text-zinc-400 font-medium">
              <Sparkles className="w-4 h-4 text-blue-500" />
              Customise with AI
            </div>
          </label>

          {showAiInput && (
            <textarea
              placeholder="Describe your style (e.g., 'Modern minimalist with pastel colors', 'Cyberpunk neon vibe', 'Earthy tones and rounded corners')..."
              value={customPrompt}
              onChange={(e) => setCustomPrompt(e.target.value)}
              className="w-full max-w-2xl bg-zinc-900 border border-zinc-800 rounded-2xl p-4 text-sm outline-none focus:border-blue-500 min-h-[100px]"
            />
          )}
        </div>
      </div>
    </section>
  );
};
