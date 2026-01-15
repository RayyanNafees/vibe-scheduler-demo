
import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { TimetableState, Subject, ScheduleData, TimetableTheme } from './types';

interface Dept {
  title: string;
  slug: string;
}

interface TimetableStore extends TimetableState {
  // Enhanced State
  departments: Dept[];
  branches: string[];
  professors: string[];
  classroomsList: string[]; // List of rooms for the combobox
  selectedDeptSlug: string;

  // Actions
  setMetadata: (key: 'department' | 'branch' | 'classroom', value: string) => void;
  setDeptData: (slug: string, title: string) => void;
  setDepartmentsList: (depts: Dept[]) => void;
  setBranchesList: (branches: string[]) => void;
  setProfessorsList: (profs: string[]) => void;
  addClassroom: (room: string) => void;
  
  addSubject: () => void;
  updateSubject: (id: string, updates: Partial<Subject>) => void;
  removeSubject: (id: string) => void;
  setSubjects: (subjects: Subject[]) => void;
  reorderSubjects: (oldIndex: number, newIndex: number) => void;
  setScheduleCell: (day: string, slot: string, subjectId: string | null) => void;
  setInterval: (val: number) => void;
  setStartDay: (day: string) => void;
  toggleTranspose: () => void;
  setGeneratedThemes: (themes: TimetableTheme[]) => void;
  setSelectedTheme: (theme: TimetableTheme | null) => void;
}

export const useTimetableStore = create<TimetableStore>()(
  persist(
    (set) => ({
      department: '',
      selectedDeptSlug: '',
      branch: '',
      classroom: '',
      subjects: [{ id: '1', code: '', name: '', prof: '', room: '', color: '#3b82f6' }],
      schedule: {},
      interval: 50,
      startDay: 'Monday',
      isTransposed: false,
      generatedThemes: [],
      selectedTheme: null,
      
      departments: [],
      branches: [],
      professors: [],
      classroomsList: ["Lecture Hall 1", "Room 204", "Drawing Hall"],

      setMetadata: (key, value) => set((state) => ({ ...state, [key]: value })),
      
      setDeptData: (slug, title) => set({ 
        selectedDeptSlug: slug, 
        department: title, 
        branch: '', // Reset sub-selections when dept changes
        professors: [],
        branches: []
      }),

      setDepartmentsList: (departments) => set({ departments }),
      setBranchesList: (branches) => set({ branches }),
      setProfessorsList: (professors) => set({ professors }),
      addClassroom: (room) => set((state) => ({
        classroomsList: state.classroomsList.includes(room) ? state.classroomsList : [...state.classroomsList, room]
      })),

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

      reorderSubjects: (oldIndex, newIndex) => set((state) => {
        const newSubjects = [...state.subjects];
        const [removed] = newSubjects.splice(oldIndex, 1);
        newSubjects.splice(newIndex, 0, removed);
        return { subjects: newSubjects };
      }),

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
    }),
    {
      name: 'zhcet-scheduler-storage',
      partialize: (state) => ({ 
        departments: state.departments,
        professors: state.professors,
        branches: state.branches,
        classroomsList: state.classroomsList,
        subjects: state.subjects,
        schedule: state.schedule,
        department: state.department,
        selectedDeptSlug: state.selectedDeptSlug,
        branch: state.branch,
        classroom: state.classroom
      }),
    }
  )
);
