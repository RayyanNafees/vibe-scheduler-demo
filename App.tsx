
import React from 'react';
import { Hero } from './components/Hero';
import { FileUpload } from './components/FileUpload';
import { SubjectEntry } from './components/SubjectEntry';
import { TimetableGrid } from './components/TimetableGrid';
import { ThemeGallery } from './components/ThemeGallery';
import { Lightroom } from './components/Lightroom';

const App: React.FC = () => {
  return (
    <div className="min-h-screen bg-[#0a0a0a] text-white selection:bg-blue-500/30">
      <main className="max-w-7xl mx-auto pb-32">
        <Hero />
        
        <div className="space-y-32">
          <FileUpload />
          <SubjectEntry />
          <TimetableGrid />
          <ThemeGallery />
        </div>
      </main>

      <Lightroom />

      <footer className="py-16 border-t border-zinc-900/50 bg-zinc-950">
        <div className="max-w-7xl mx-auto px-4 text-center space-y-6">
          <h3 className="text-2xl font-bold font-handwritten bg-gradient-to-r from-blue-400 to-purple-500 bg-clip-text text-transparent">ZHCET Scheduler</h3>
          <p className="text-zinc-500 text-sm font-medium">Made with Gemini AI for Aligarh Muslim University Students</p>
          <div className="flex justify-center gap-8 text-zinc-600 text-sm">
            <a href="#" className="hover:text-blue-400 transition-colors">Privacy</a>
            <a href="#" className="hover:text-blue-400 transition-colors">Terms</a>
            <a href="#" className="hover:text-blue-400 transition-colors">Help</a>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default App;
