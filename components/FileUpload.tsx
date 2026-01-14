
import React, { useState } from 'react';
import { Upload, Sparkles, Loader2 } from 'lucide-react';
import { parseScheduleFile } from '../geminiService';
import { useTimetableStore } from '../store';

export const FileUpload: React.FC = () => {
  const [isUploading, setIsUploading] = useState(false);
  const setSubjects = useTimetableStore((state) => state.setSubjects);

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsUploading(true);
    try {
      const reader = new FileReader();
      reader.onload = async () => {
        const base64 = (reader.result as string).split(',')[1];
        const result = await parseScheduleFile(base64, file.type);
        if (result && Array.isArray(result)) {
          const newSubjects = result.map((s: any) => ({
            id: Math.random().toString(36).substr(2, 9),
            code: s.code || '',
            name: s.name || '',
            prof: s.prof || '',
            room: s.room || '',
            color: `#${Math.floor(Math.random()*16777215).toString(16)}`
          }));
          setSubjects(newSubjects);
        }
      };
      reader.readAsDataURL(file);
    } catch (err) {
      console.error(err);
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div className="w-full max-w-2xl mx-auto px-4">
      <label className="group relative flex flex-col items-center justify-center w-full h-48 border-2 border-dashed border-zinc-800 rounded-3xl cursor-pointer hover:border-zinc-700 hover:bg-zinc-900/50 transition-all overflow-hidden">
        <input type="file" className="hidden" onChange={handleFileChange} accept="image/*,application/pdf" />
        {isUploading ? (
          <div className="flex flex-col items-center space-y-2">
            <Loader2 className="w-8 h-8 animate-spin text-blue-500" />
            <span className="text-zinc-400">AI is parsing your schedule...</span>
          </div>
        ) : (
          <>
            <div className="flex items-center gap-2 mb-2">
              <Upload className="w-6 h-6 text-zinc-400 group-hover:text-blue-500" />
              <Sparkles className="w-4 h-4 text-blue-500" />
            </div>
            <p className="text-zinc-400 font-medium">Upload Registration card or Time table pic</p>
            <p className="text-zinc-600 text-sm mt-1">Image or PDF supported</p>
          </>
        )}
      </label>
      
      <div className="relative flex py-8 items-center">
        <div className="flex-grow border-t border-zinc-800"></div>
        <span className="flex-shrink mx-4 text-zinc-600 text-sm italic font-handwritten">OR (enter details)</span>
        <div className="flex-grow border-t border-zinc-800"></div>
      </div>
    </div>
  );
};
