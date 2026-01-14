
import React from 'react';
import { useTimetableStore } from '../store';

export const Hero: React.FC = () => {
  const { department, branch, classroom, setMetadata } = useTimetableStore();

  return (
    <section className="flex flex-col items-center py-16 text-center space-y-6">
      <h1 className="text-5xl font-bold tracking-tight font-handwritten">ZHCET Scheduler</h1>
      <p className="text-zinc-400 text-lg">Craft beautiful time tables from messy schedule PDFs</p>
      
      <div className="flex flex-wrap justify-center gap-4 mt-8 w-full max-w-2xl px-4">
        <input
          type="text"
          placeholder="Department"
          value={department}
          onChange={(e) => setMetadata('department', e.target.value)}
          className="bg-zinc-900 border border-zinc-800 rounded-full px-6 py-2 focus:ring-2 focus:ring-blue-500 outline-none w-full sm:w-auto"
        />
        <input
          type="text"
          placeholder="Branch"
          value={branch}
          onChange={(e) => setMetadata('branch', e.target.value)}
          className="bg-zinc-900 border border-zinc-800 rounded-full px-6 py-2 focus:ring-2 focus:ring-blue-500 outline-none w-full sm:w-auto"
        />
        <input
          type="text"
          placeholder="Classroom"
          value={classroom}
          onChange={(e) => setMetadata('classroom', e.target.value)}
          className="bg-zinc-900 border border-zinc-800 rounded-full px-6 py-2 focus:ring-2 focus:ring-blue-500 outline-none w-full sm:w-auto"
        />
      </div>
    </section>
  );
};
