
import React from 'react';
import { Trash2, Plus, GripVertical } from 'lucide-react';
import { 
  DndContext, 
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DragEndEvent
} from '@dnd-kit/core';
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
  useSortable
} from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { useTimetableStore } from '../store';
import { Subject } from '../types';

interface SortableSubjectRowProps {
  sub: Subject;
  onUpdate: (id: string, updates: Partial<Subject>) => void;
  onRemove: (id: string) => void;
}

const SortableSubjectRow: React.FC<SortableSubjectRowProps> = ({ sub, onUpdate, onRemove }) => {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging
  } = useSortable({ id: sub.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    zIndex: isDragging ? 50 : 'auto',
    opacity: isDragging ? 0.5 : 1,
  };

  return (
    <div 
      ref={setNodeRef} 
      style={style} 
      className={`flex flex-wrap items-center gap-2 p-2 bg-zinc-900/40 rounded-xl border border-zinc-800/50 group transition-all ${isDragging ? 'shadow-2xl ring-2 ring-blue-500/20 bg-zinc-800' : 'hover:border-zinc-700'}`}
    >
      <div 
        {...attributes} 
        {...listeners} 
        className="p-2 text-zinc-600 cursor-grab active:cursor-grabbing hover:text-zinc-400 transition-colors"
      >
        <GripVertical className="w-4 h-4" />
      </div>
      
      <input
        placeholder="Code"
        value={sub.code}
        onChange={(e) => onUpdate(sub.id, { code: e.target.value })}
        className="flex-1 min-w-[80px] bg-zinc-950 border border-zinc-800 rounded-lg px-3 py-2 text-sm focus:border-blue-500 outline-none placeholder:text-zinc-700"
      />
      <input
        placeholder="Subject Name"
        value={sub.name}
        onChange={(e) => onUpdate(sub.id, { name: e.target.value })}
        className="flex-[2] min-w-[150px] bg-zinc-950 border border-zinc-800 rounded-lg px-3 py-2 text-sm focus:border-blue-500 outline-none placeholder:text-zinc-700"
      />
      <input
        placeholder="Prof"
        value={sub.prof}
        onChange={(e) => onUpdate(sub.id, { prof: e.target.value })}
        className="flex-1 min-w-[100px] bg-zinc-950 border border-zinc-800 rounded-lg px-3 py-2 text-sm focus:border-blue-500 outline-none placeholder:text-zinc-700"
      />
      <input
        placeholder="Room"
        value={sub.room}
        onChange={(e) => onUpdate(sub.id, { room: e.target.value })}
        className="flex-1 min-w-[80px] bg-zinc-950 border border-zinc-800 rounded-lg px-3 py-2 text-sm focus:border-blue-500 outline-none placeholder:text-zinc-700"
      />
      <input
        type="color"
        value={sub.color}
        onChange={(e) => onUpdate(sub.id, { color: e.target.value })}
        className="w-10 h-9 p-1 bg-zinc-950 border border-zinc-800 rounded-lg cursor-pointer"
      />
      
      <button
        onClick={() => onRemove(sub.id)}
        className="p-2 text-zinc-600 hover:text-red-500 transition-colors"
      >
        <Trash2 className="w-5 h-5" />
      </button>
    </div>
  );
};

export const SubjectEntry: React.FC = () => {
  const { subjects, addSubject, updateSubject, removeSubject, reorderSubjects } = useTimetableStore();

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    if (active.id !== over?.id) {
      const oldIndex = subjects.findIndex((s) => s.id === active.id);
      const newIndex = subjects.findIndex((s) => s.id === over?.id);
      reorderSubjects(oldIndex, newIndex);
    }
  };

  return (
    <section className="w-full max-w-4xl mx-auto px-4 mb-12">
      <div className="mb-8">
        <h2 className="text-3xl font-bold mb-2">Subjects</h2>
        <p className="text-zinc-500 text-sm">Add Subject codes, Short names, Assigned Professor & allotted room. Drag to reorder.</p>
      </div>

      <div className="mb-6">
        <DndContext 
          sensors={sensors}
          collisionDetection={closestCenter}
          onDragEnd={handleDragEnd}
        >
          <SortableContext 
            items={subjects.map(s => s.id)}
            strategy={verticalListSortingStrategy}
          >
            <div className="space-y-3">
              {subjects.map((sub) => (
                <SortableSubjectRow 
                  key={sub.id} 
                  sub={sub} 
                  onUpdate={updateSubject} 
                  onRemove={removeSubject} 
                />
              ))}
            </div>
          </SortableContext>
        </DndContext>
      </div>

      <button
        onClick={addSubject}
        className="w-full py-4 border-2 border-dashed border-zinc-800 rounded-2xl text-zinc-500 hover:text-blue-500 hover:border-blue-500/50 hover:bg-blue-500/5 transition-all flex items-center justify-center gap-2 group"
      >
        <Plus className="w-5 h-5 group-hover:scale-110 transition-transform" />
        <span className="font-medium">Add Subject</span>
      </button>
    </section>
  );
};
