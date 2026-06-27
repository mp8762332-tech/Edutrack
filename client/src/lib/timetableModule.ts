// Timetable Module for School Management

export interface TimetableSlot {
  id: string;
  classLevel: string;
  classStream: string;
  dayOfWeek: 'Monday' | 'Tuesday' | 'Wednesday' | 'Thursday' | 'Friday' | 'Saturday';
  startTime: string; // HH:MM format
  endTime: string;
  subject: string;
  teacher: string;
  room: string;
  term: number;
  year: number;
}

export interface ExamScheduleEntry {
  id: string;
  examName: string;
  subject: string;
  classLevel: string;
  classStream: string;
  date: string; // YYYY-MM-DD
  startTime: string;
  endTime: string;
  room: string;
  invigilators: string[];
  term: number;
  year: number;
}

export interface SyllabusEntry {
  id: string;
  subject: string;
  classLevel: string;
  classStream: string;
  topic: string;
  subtopics: string[];
  weeksToComplete: number;
  resourcesNeeded: string[];
  assessmentMethod: string;
  term: number;
  year: number;
  status: 'Not Started' | 'In Progress' | 'Completed';
  percentageComplete: number;
}

// Demo timetable data
export const demoTimetable: TimetableSlot[] = [
  // S1 East - Monday
  { id: 't-1', classLevel: 'S1', classStream: 'East', dayOfWeek: 'Monday', startTime: '08:00', endTime: '09:00', subject: 'English', teacher: 'Mrs. Grace Nakamya', room: 'S1-East-1', term: 1, year: 2026 },
  { id: 't-2', classLevel: 'S1', classStream: 'East', dayOfWeek: 'Monday', startTime: '09:00', endTime: '10:00', subject: 'Mathematics', teacher: 'Mr. Peter Kipchoge', room: 'S1-East-1', term: 1, year: 2026 },
  { id: 't-3', classLevel: 'S1', classStream: 'East', dayOfWeek: 'Monday', startTime: '10:00', endTime: '10:30', subject: 'Break', teacher: '-', room: '-', term: 1, year: 2026 },
  { id: 't-4', classLevel: 'S1', classStream: 'East', dayOfWeek: 'Monday', startTime: '10:30', endTime: '11:30', subject: 'Biology', teacher: 'Dr. James Mwangi', room: 'Lab-1', term: 1, year: 2026 },
  { id: 't-5', classLevel: 'S1', classStream: 'East', dayOfWeek: 'Monday', startTime: '11:30', endTime: '12:30', subject: 'Chemistry', teacher: 'Mr. David Ssempijja', room: 'Lab-2', term: 1, year: 2026 },
  { id: 't-6', classLevel: 'S1', classStream: 'East', dayOfWeek: 'Monday', startTime: '12:30', endTime: '13:30', subject: 'Lunch', teacher: '-', room: '-', term: 1, year: 2026 },
  { id: 't-7', classLevel: 'S1', classStream: 'East', dayOfWeek: 'Monday', startTime: '13:30', endTime: '14:30', subject: 'Physics', teacher: 'Mr. Peter Kipchoge', room: 'S1-East-1', term: 1, year: 2026 },
  { id: 't-8', classLevel: 'S1', classStream: 'East', dayOfWeek: 'Monday', startTime: '14:30', endTime: '15:30', subject: 'History', teacher: 'Mrs. Sarah Omondi', room: 'S1-East-2', term: 1, year: 2026 },

  // S1 East - Tuesday
  { id: 't-9', classLevel: 'S1', classStream: 'East', dayOfWeek: 'Tuesday', startTime: '08:00', endTime: '09:00', subject: 'Mathematics', teacher: 'Mr. Peter Kipchoge', room: 'S1-East-1', term: 1, year: 2026 },
  { id: 't-10', classLevel: 'S1', classStream: 'East', dayOfWeek: 'Tuesday', startTime: '09:00', endTime: '10:00', subject: 'English', teacher: 'Mrs. Grace Nakamya', room: 'S1-East-1', term: 1, year: 2026 },
  { id: 't-11', classLevel: 'S1', classStream: 'East', dayOfWeek: 'Tuesday', startTime: '10:00', endTime: '10:30', subject: 'Break', teacher: '-', room: '-', term: 1, year: 2026 },
  { id: 't-12', classLevel: 'S1', classStream: 'East', dayOfWeek: 'Tuesday', startTime: '10:30', endTime: '11:30', subject: 'Geography', teacher: 'Mr. Amos Kipchoge', room: 'S1-East-3', term: 1, year: 2026 },
  { id: 't-13', classLevel: 'S1', classStream: 'East', dayOfWeek: 'Tuesday', startTime: '11:30', endTime: '12:30', subject: 'Literature', teacher: 'Mrs. Grace Nakamya', room: 'S1-East-1', term: 1, year: 2026 },
  { id: 't-14', classLevel: 'S1', classStream: 'East', dayOfWeek: 'Tuesday', startTime: '12:30', endTime: '13:30', subject: 'Lunch', teacher: '-', room: '-', term: 1, year: 2026 },
  { id: 't-15', classLevel: 'S1', classStream: 'East', dayOfWeek: 'Tuesday', startTime: '13:30', endTime: '14:30', subject: 'Computer Studies', teacher: 'Mr. Rashid Hassan', room: 'Lab-3', term: 1, year: 2026 },
  { id: 't-16', classLevel: 'S1', classStream: 'East', dayOfWeek: 'Tuesday', startTime: '14:30', endTime: '15:30', subject: 'Religious Studies', teacher: 'Mr. John Kipchoge', room: 'S1-East-2', term: 1, year: 2026 },
];

// Demo exam schedule
export const demoExamSchedule: ExamScheduleEntry[] = [
  { id: 'e-1', examName: 'Term 1 Exams', subject: 'Mathematics', classLevel: 'S1', classStream: 'East', date: '2026-04-15', startTime: '09:00', endTime: '11:00', room: 'Hall-A', invigilators: ['Mrs. Grace Nakamya', 'Mr. Amos Kipchoge'], term: 1, year: 2026 },
  { id: 'e-2', examName: 'Term 1 Exams', subject: 'English', classLevel: 'S1', classStream: 'East', date: '2026-04-16', startTime: '09:00', endTime: '11:00', room: 'Hall-A', invigilators: ['Mr. Peter Kipchoge', 'Mrs. Sarah Omondi'], term: 1, year: 2026 },
  { id: 'e-3', examName: 'Term 1 Exams', subject: 'Biology', classLevel: 'S1', classStream: 'East', date: '2026-04-17', startTime: '09:00', endTime: '11:00', room: 'Hall-B', invigilators: ['Dr. James Mwangi', 'Mr. David Ssempijja'], term: 1, year: 2026 },
  { id: 'e-4', examName: 'Term 1 Exams', subject: 'Chemistry', classLevel: 'S1', classStream: 'East', date: '2026-04-18', startTime: '09:00', endTime: '11:00', room: 'Hall-B', invigilators: ['Mr. David Ssempijja', 'Dr. James Mwangi'], term: 1, year: 2026 },
  { id: 'e-5', examName: 'Term 1 Exams', subject: 'Physics', classLevel: 'S1', classStream: 'East', date: '2026-04-19', startTime: '09:00', endTime: '11:00', room: 'Hall-C', invigilators: ['Mr. Peter Kipchoge', 'Mr. Amos Kipchoge'], term: 1, year: 2026 },
];

// Demo syllabus
export const demoSyllabus: SyllabusEntry[] = [
  { id: 's-1', subject: 'Mathematics', classLevel: 'S1', classStream: 'East', topic: 'Algebra', subtopics: ['Linear Equations', 'Quadratic Equations', 'Polynomials'], weeksToComplete: 4, resourcesNeeded: ['Textbook', 'Whiteboard', 'Calculator'], assessmentMethod: 'Quiz + Assignment', term: 1, year: 2026, status: 'Completed', percentageComplete: 100 },
  { id: 's-2', subject: 'Mathematics', classLevel: 'S1', classStream: 'East', topic: 'Geometry', subtopics: ['Angles', 'Triangles', 'Circles'], weeksToComplete: 3, resourcesNeeded: ['Textbook', 'Compass', 'Ruler'], assessmentMethod: 'Practical + Test', term: 1, year: 2026, status: 'In Progress', percentageComplete: 65 },
  { id: 's-3', subject: 'English', classLevel: 'S1', classStream: 'East', topic: 'Literature', subtopics: ['Poetry', 'Prose', 'Drama'], weeksToComplete: 5, resourcesNeeded: ['Books', 'Projector'], assessmentMethod: 'Essay + Presentation', term: 1, year: 2026, status: 'In Progress', percentageComplete: 45 },
  { id: 's-4', subject: 'Biology', classLevel: 'S1', classStream: 'East', topic: 'Cell Biology', subtopics: ['Cell Structure', 'Cell Division', 'Photosynthesis'], weeksToComplete: 4, resourcesNeeded: ['Microscope', 'Slides', 'Textbook'], assessmentMethod: 'Lab Report + Test', term: 1, year: 2026, status: 'Completed', percentageComplete: 100 },
  { id: 's-5', subject: 'Chemistry', classLevel: 'S1', classStream: 'East', topic: 'Atomic Structure', subtopics: ['Atoms', 'Electrons', 'Bonding'], weeksToComplete: 3, resourcesNeeded: ['Models', 'Textbook', 'Lab Equipment'], assessmentMethod: 'Experiment + Quiz', term: 1, year: 2026, status: 'Not Started', percentageComplete: 0 },
];

// Get timetable for specific class
export function getClassTimetable(classLevel: string, classStream: string): TimetableSlot[] {
  return demoTimetable.filter(t => t.classLevel === classLevel && t.classStream === classStream);
}

// Get teacher's timetable
export function getTeacherTimetable(teacherName: string): TimetableSlot[] {
  return demoTimetable.filter(t => t.teacher === teacherName && t.subject !== 'Break' && t.subject !== 'Lunch');
}

// Get timetable by day
export function getTimetableByDay(day: string, classLevel: string, classStream: string): TimetableSlot[] {
  return demoTimetable.filter(t => t.dayOfWeek === day && t.classLevel === classLevel && t.classStream === classStream);
}

// Get exam schedule for class
export function getClassExamSchedule(classLevel: string, classStream: string): ExamScheduleEntry[] {
  return demoExamSchedule.filter(e => e.classLevel === classLevel && e.classStream === classStream);
}

// Get syllabus for subject
export function getSubjectSyllabus(subject: string, classLevel: string, classStream: string): SyllabusEntry[] {
  return demoSyllabus.filter(s => s.subject === subject && s.classLevel === classLevel && s.classStream === classStream);
}

// Calculate syllabus completion percentage
export function calculateSyllabusCompletion(subject: string, classLevel: string, classStream: string): number {
  const syllabus = getSubjectSyllabus(subject, classLevel, classStream);
  if (syllabus.length === 0) return 0;
  const totalPercentage = syllabus.reduce((sum, s) => sum + s.percentageComplete, 0);
  return Math.round(totalPercentage / syllabus.length);
}

// Get upcoming exams
export function getUpcomingExams(days: number = 30): ExamScheduleEntry[] {
  const today = new Date();
  const futureDate = new Date(today.getTime() + days * 24 * 60 * 60 * 1000);
  return demoExamSchedule.filter(e => {
    const examDate = new Date(e.date);
    return examDate >= today && examDate <= futureDate;
  });
}
