
export interface Subject {
  id: string;
  code: string;
  name: string;
  prof: string;
  room: string;
  color?: string;
}

export interface ScheduleCell {
  subjectId: string; // Refers to Subject id
}

export type ScheduleData = Record<string, Record<string, ScheduleCell | null>>;

export interface TimetableState {
  department: string;
  branch: string;
  classroom: string;
  subjects: Subject[];
  schedule: ScheduleData;
  interval: number;
  startDay: string;
  isTransposed: boolean;
  generatedThemes: TimetableTheme[];
  selectedTheme: TimetableTheme | null;
}

export interface TimetableTheme {
  id: string;
  name: string;
  primaryColor: string;
  secondaryColor: string;
  textColor: string;
  accentColor: string;
  borderRadius: string;
  fontFamily: string;
  background: string;
}
