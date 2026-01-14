
import { create } from 'zustand';
import { TimetableState, Subject, ScheduleData, TimetableTheme } from './types';

interface TimetableStore extends TimetableState {
  setMetadata: (key: 'department' | 'branch' | 'classroom', value: string) => void;
  addSubject: () => void;
  updateSubject: (id: string, updates: Partial<Subject>) => void;
  removeSubject: (id: string) => void;
  setSubjects: (subjects: Subject[]) => void;
  setScheduleCell: (day: string, slot: string, subjectId: string | null) => void;
  setInterval: (val: number) => void;
  setStartDay: (day: string) => void;
  toggleTranspose: () => void;
  setGeneratedThemes: (themes: TimetableTheme[]) => void;
  setSelectedTheme: (theme: TimetableTheme | null) => void;
}

export const useTimetableStore = create<TimetableStore>((set) => ({
  department: '',
  branch: '',
  classroom: '',
  subjects: [{ id: '1', code: '', name: '', prof: '', room: '', color: '#3b82f6' }],
  schedule: {},
  interval: 50,
  startDay: 'Monday',
  isTransposed: false,
  generatedThemes: [],
  selectedTheme: null,

  setMetadata: (key, value) => set((state) => ({ ...state, [key]: value })),
  
  addSubject: () => set((state) => ({
    subjects: [
      ...state.subjects,
      { 
        id: Math.random().toString(36).substr(2, 9), 
        code: '', 
        name: '', 
        prof: '', 
        room: '', 
        color: `#${Math.floor(Math.random()*16777215).toString(16)}` 
      }
    ]
  })),

  updateSubject: (id, updates) => set((state) => ({
    subjects: state.subjects.map(s => s.id === id ? { ...s, ...updates } : s)
  })),

  removeSubject: (id) => set((state) => ({
    subjects: state.subjects.filter(s => s.id !== id)
  })),

  setSubjects: (subjects) => set({ subjects }),

  setScheduleCell: (day, slot, subjectId) => set((state) => {
    const newSchedule = { ...state.schedule };
    if (!newSchedule[day]) newSchedule[day] = {};
    if (subjectId) {
      newSchedule[day][slot] = { subjectId };
    } else {
      delete newSchedule[day][slot];
    }
    return { schedule: newSchedule };
  }),

  setInterval: (interval) => set({ interval }),
  setStartDay: (startDay) => set({ startDay }),
  toggleTranspose: () => set((state) => ({ isTransposed: !state.isTransposed })),
  setGeneratedThemes: (generatedThemes) => set({ generatedThemes }),
  setSelectedTheme: (selectedTheme) => set({ selectedTheme }),
}));
