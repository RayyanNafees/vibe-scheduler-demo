
import React from 'react';
import { Trash2, Plus, GripVertical } from 'lucide-react';
import { useTimetableStore } from '../store';

export const SubjectEntry: React.FC = () => {
  const { subjects, addSubject, updateSubject, removeSubject } = useTimetableStore();

  return (
    <section className="w-full max-w-4xl mx-auto px-4 mb-12">
      <div className="mb-6">
        <h2 className="text-2xl font-semibold mb-1">Subjects</h2>
        <p className="text-zinc-500 text-sm italic">Add Subject codes, Short names, Assigned Professor & allotted room</p>
      </div>

      <div className="space-y-3 mb-6">
        {subjects.map((sub) => (
          <div key={sub.id} className="flex flex-wrap items-center gap-2 p-2 bg-zinc-900/40 rounded-xl border border-zinc-800/50">
            <div className="p-2 text-zinc-600 cursor-grab active:cursor-grabbing">
              <GripVertical className="w-4 h-4" />
            </div>
            
            <input
              placeholder="Code"
              value={sub.code}
              onChange={(e) => updateSubject(sub.id, { code: e.target.value })}
              className="flex-1 min-w-[80px] bg-zinc-950 border border-zinc-800 rounded-lg px-3 py-2 text-sm focus:border-blue-500 outline-none"
            />
            <input
              placeholder="Subject Name"
              value={sub.name}
              onChange={(e) => updateSubject(sub.id, { name: e.target.value })}
              className="flex-[2] min-w-[150px] bg-zinc-950 border border-zinc-800 rounded-lg px-3 py-2 text-sm focus:border-blue-500 outline-none"
            />
            <input
              placeholder="Prof"
              value={sub.prof}
              onChange={(e) => updateSubject(sub.id, { prof: e.target.value })}
              className="flex-1 min-w-[100px] bg-zinc-950 border border-zinc-800 rounded-lg px-3 py-2 text-sm focus:border-blue-500 outline-none"
            />
            <input
              placeholder="Room"
              value={sub.room}
              onChange={(e) => updateSubject(sub.id, { room: e.target.value })}
              className="flex-1 min-w-[80px] bg-zinc-950 border border-zinc-800 rounded-lg px-3 py-2 text-sm focus:border-blue-500 outline-none"
            />
            
            <button
              onClick={() => removeSubject(sub.id)}
              className="p-2 text-zinc-500 hover:text-red-500 transition-colors"
            >
              <Trash2 className="w-5 h-5" />
            </button>
          </div>
        ))}
      </div>

      <button
        onClick={addSubject}
        className="w-full py-3 border-2 border-dashed border-zinc-800 rounded-xl text-zinc-400 hover:text-blue-500 hover:border-blue-500/50 hover:bg-blue-500/5 transition-all flex items-center justify-center gap-2"
      >
        <Plus className="w-4 h-4" />
        <span>+ Add Subject</span>
      </button>
    </section>
  );
};
