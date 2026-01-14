
import React, { useState } from 'react';
import { Upload, Sparkles, Loader2 } from 'lucide-react';
import { parseScheduleFile } from '../geminiService';
import { useTimetableStore } from '../store';
import { Combobox } from './Combobox';

const DEPTS = ["Computer Engineering", "Mechanical Engineering", "Civil Engineering", "Electronics Engineering", "Electrical Engineering", "Applied Physics", "Applied Chemistry", "Applied Mathematics"];
const BRANCHES = ["B.Tech CS", "B.Tech ME", "B.Tech CE", "B.Tech EE", "B.Tech EC", "M.Tech", "PhD", "B.Arch"];
const ROOMS = ["Lecture Hall 1", "Lecture Hall 2", "Drawing Hall", "CS Lab 1", "ME Lab 3", "Room 101", "Room 204", "Seminar Room"];

export const FileUpload: React.FC = () => {
  const [isUploading, setIsUploading] = useState(false);
  const { setSubjects, department, branch, classroom, setMetadata } = useTimetableStore();

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
    <div className="w-full max-w-4xl mx-auto px-4">
      <div className="max-w-2xl mx-auto">
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
              <p className="text-zinc-400 font-medium text-center">Upload Registration card or Time table pic</p>
              <p className="text-zinc-600 text-sm mt-1">Image or PDF supported</p>
            </>
          )}
        </label>
      </div>
      
      <div className="relative flex py-10 items-center max-w-2xl mx-auto">
        <div className="flex-grow border-t border-zinc-800"></div>
        <span className="flex-shrink mx-4 text-zinc-600 text-sm italic font-handwritten">OR (enter details)</span>
        <div className="flex-grow border-t border-zinc-800"></div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-4">
        <div className="space-y-2">
          <label className="text-xs font-bold uppercase tracking-widest text-zinc-600 ml-1">Department</label>
          <Combobox 
            options={DEPTS} 
            value={department} 
            onChange={(val) => setMetadata('department', val)} 
            placeholder="Select Department" 
          />
        </div>
        <div className="space-y-2">
          <label className="text-xs font-bold uppercase tracking-widest text-zinc-600 ml-1">Branch</label>
          <Combobox 
            options={BRANCHES} 
            value={branch} 
            onChange={(val) => setMetadata('branch', val)} 
            placeholder="Select Branch" 
          />
        </div>
        <div className="space-y-2">
          <label className="text-xs font-bold uppercase tracking-widest text-zinc-600 ml-1">Classroom</label>
          <Combobox 
            options={ROOMS} 
            value={classroom} 
            onChange={(val) => setMetadata('classroom', val)} 
            placeholder="Select Room" 
          />
        </div>
      </div>
    </div>
  );
};
