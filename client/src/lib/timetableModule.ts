/**
 * Multi-Type Timetable System
 * Manages ACADEMIC, MID_TERM_EXAM, and END_OF_TERM_EXAM schedules
 */

export type TimetableType = "ACADEMIC" | "MID_TERM_EXAM" | "END_OF_TERM_EXAM";

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
  type?: TimetableType; // ACADEMIC by default
}

export interface TimetableOverride {
  id: string;
  originalEntryId: string;
  overrideType: TimetableType;
  reason: string;
  startDate: Date;
  endDate: Date;
  replacementEntry?: TimetableSlot;
  isActive: boolean;
  createdAt: Date;
}

export interface TimetableArchive {
  id: string;
  timetableId: string;
  archivedType: TimetableType;
  archivedData: TimetableSlot[];
  archivedAt: Date;
  reason: string;
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


// ============= Helper Functions for Multi-Type Timetables =============

/**
 * Convert time string to minutes for comparison
 */
export function timeToMinutes(time: string): number {
  const [hours, minutes] = time.split(":").map(Number);
  return hours * 60 + minutes;
}

/**
 * Check for scheduling conflicts
 */
export function checkScheduleConflicts(
  entries: TimetableSlot[],
  newEntry: TimetableSlot
): { hasConflict: boolean; conflicts: TimetableSlot[] } {
  const conflicts = entries.filter((e) => {
    if (e.dayOfWeek !== newEntry.dayOfWeek) return false;
    if (e.classLevel !== newEntry.classLevel || e.classStream !== newEntry.classStream) return false;

    const newStart = timeToMinutes(newEntry.startTime);
    const newEnd = timeToMinutes(newEntry.endTime);
    const existingStart = timeToMinutes(e.startTime);
    const existingEnd = timeToMinutes(e.endTime);

    // Check for overlap
    return newStart < existingEnd && newEnd > existingStart;
  });

  return {
    hasConflict: conflicts.length > 0,
    conflicts,
  };
}

/**
 * Create a timetable override
 */
export function createTimetableOverride(
  originalEntryId: string,
  overrideType: TimetableType,
  reason: string,
  startDate: Date,
  endDate: Date,
  replacementEntry?: TimetableSlot
): TimetableOverride {
  return {
    id: Math.random().toString(),
    originalEntryId,
    overrideType,
    reason,
    startDate,
    endDate,
    replacementEntry,
    isActive: true,
    createdAt: new Date(),
  };
}

/**
 * Get active overrides for a specific date
 */
export function getActiveOverridesForDate(
  overrides: TimetableOverride[],
  date: Date
): TimetableOverride[] {
  return overrides.filter((o) => {
    const dateTime = date.getTime();
    const startTime = o.startDate.getTime();
    const endTime = o.endDate.getTime();
    return o.isActive && dateTime >= startTime && dateTime <= endTime;
  });
}

/**
 * Apply overrides to timetable entries
 */
export function applyOverridesToTimetable(
  entries: TimetableSlot[],
  overrides: TimetableOverride[],
  date: Date
): TimetableSlot[] {
  const activeOverrides = getActiveOverridesForDate(overrides, date);
  const overrideMap = new Map<string, TimetableOverride>();

  activeOverrides.forEach((o) => {
    overrideMap.set(o.originalEntryId, o);
  });

  return entries.map((entry) => {
    const override = overrideMap.get(entry.id);
    if (override && override.replacementEntry) {
      return override.replacementEntry;
    }
    return entry;
  });
}

/**
 * Archive a timetable
 */
export function archiveTimetable(
  timetableId: string,
  entries: TimetableSlot[],
  type: TimetableType,
  reason: string
): TimetableArchive {
  return {
    id: Math.random().toString(),
    timetableId,
    archivedType: type,
    archivedData: entries,
    archivedAt: new Date(),
    reason,
  };
}

/**
 * Filter timetable by type
 */
export function filterTimetableByType(entries: TimetableSlot[], type: TimetableType): TimetableSlot[] {
  return entries.filter((e) => (e.type || "ACADEMIC") === type);
}

/**
 * Validate timetable entry times
 */
export function validateTimetableEntry(startTime: string, endTime: string): { isValid: boolean; error?: string } {
  const start = timeToMinutes(startTime);
  const end = timeToMinutes(endTime);

  if (start >= end) {
    return { isValid: false, error: "Start time must be before end time" };
  }

  if (end - start < 30) {
    return { isValid: false, error: "Minimum class duration is 30 minutes" };
  }

  if (end - start > 180) {
    return { isValid: false, error: "Maximum class duration is 3 hours" };
  }

  return { isValid: true };
}

/**
 * Calculate total teaching hours per subject per week
 */
export function calculateTeachingHours(entries: TimetableSlot[]): Map<string, number> {
  const hours = new Map<string, number>();

  entries.forEach((entry) => {
    if (entry.subject === "Break" || entry.subject === "Lunch") return;

    const start = timeToMinutes(entry.startTime);
    const end = timeToMinutes(entry.endTime);
    const duration = (end - start) / 60; // Convert to hours

    const current = hours.get(entry.subject) || 0;
    hours.set(entry.subject, current + duration);
  });

  return hours;
}

/**
 * Generate timetable HTML for printing
 */
export function generateTimetableHTML(
  classLevel: string,
  classStream: string,
  entries: TimetableSlot[],
  type: TimetableType,
  schoolName: string
): string {
  const filteredEntries = filterTimetableByType(entries, type);
  const days = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];

  let tableRows = "";
  days.forEach((day) => {
    const dayEntries = filteredEntries
      .filter((e) => e.dayOfWeek === day)
      .sort((a, b) => a.startTime.localeCompare(b.startTime));

    dayEntries.forEach((entry, idx) => {
      tableRows += `
        <tr>
          <td style="padding: 8px; border: 1px solid #ddd;">${idx === 0 ? day : ""}</td>
          <td style="padding: 8px; border: 1px solid #ddd;">${entry.subject}</td>
          <td style="padding: 8px; border: 1px solid #ddd;">${entry.startTime} - ${entry.endTime}</td>
          <td style="padding: 8px; border: 1px solid #ddd;">${entry.teacher}</td>
          <td style="padding: 8px; border: 1px solid #ddd;">${entry.room}</td>
        </tr>
      `;
    });
  });

  const html = `
<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <title>${classLevel} ${classStream} - ${type} Timetable</title>
  <style>
    body {
      font-family: Arial, sans-serif;
      margin: 20px;
      background: white;
    }
    h1 {
      text-align: center;
      color: #333;
    }
    h2 {
      color: #666;
      margin-top: 20px;
    }
    table {
      width: 100%;
      border-collapse: collapse;
      margin-top: 10px;
    }
    th {
      background: #333;
      color: white;
      padding: 10px;
      text-align: left;
      border: 1px solid #333;
    }
    td {
      padding: 8px;
      border: 1px solid #ddd;
    }
    tr:nth-child(even) {
      background: #f9f9f9;
    }
    .footer {
      text-align: center;
      margin-top: 30px;
      font-size: 12px;
      color: #999;
    }
  </style>
</head>
<body>
  <h1>${schoolName}</h1>
  <h2>${classLevel} ${classStream} - ${type} Timetable</h2>
  
  <table>
    <thead>
      <tr>
        <th>Day</th>
        <th>Subject</th>
        <th>Time</th>
        <th>Teacher</th>
        <th>Room</th>
      </tr>
    </thead>
    <tbody>
      ${tableRows}
    </tbody>
  </table>
  
  <div class="footer">
    Generated on ${new Date().toLocaleDateString()} | ${type} Schedule
  </div>
</body>
</html>
  `;

  return html;
}

/**
 * Export timetable to CSV
 */
export function exportTimetableToCSV(
  classLevel: string,
  classStream: string,
  entries: TimetableSlot[],
  type: TimetableType
): string {
  const filteredEntries = filterTimetableByType(entries, type);
  const headers = ["Day", "Subject", "Start Time", "End Time", "Teacher", "Room"];
  const rows: string[] = [];

  filteredEntries
    .sort((a, b) => {
      const dayOrder = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
      const dayCompare = dayOrder.indexOf(a.dayOfWeek) - dayOrder.indexOf(b.dayOfWeek);
      return dayCompare !== 0 ? dayCompare : a.startTime.localeCompare(b.startTime);
    })
    .forEach((entry) => {
      rows.push([entry.dayOfWeek, entry.subject, entry.startTime, entry.endTime, entry.teacher, entry.room].join(","));
    });

  return [headers.join(","), ...rows].join("\n");
}
