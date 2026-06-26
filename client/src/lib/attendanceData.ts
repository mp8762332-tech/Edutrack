// Attendance tracking data structure
export interface AttendanceRecord {
  id: string;
  studentId: string;
  studentName: string;
  classId: string;
  week: number;
  year: number;
  monday: boolean;
  tuesday: boolean;
  wednesday: boolean;
  thursday: boolean;
  friday: boolean;
  saturday: boolean;
  recordedBy: string;
  recordedDate: string;
}

export interface WeeklyAttendanceSummary {
  studentId: string;
  studentName: string;
  presentDays: number;
  absentDays: number;
  attendancePercentage: number;
  week: number;
}

// Demo attendance data
export const demoAttendanceRecords: AttendanceRecord[] = [
  {
    id: "att-1",
    studentId: "STU001",
    studentName: "Alice Kariuki",
    classId: "class-1",
    week: 24,
    year: 2026,
    monday: true,
    tuesday: true,
    wednesday: true,
    thursday: true,
    friday: true,
    saturday: true,
    recordedBy: "peter.kipchoge@school.edu",
    recordedDate: "2026-06-19",
  },
  {
    id: "att-2",
    studentId: "STU002",
    studentName: "Bob Mwangi",
    classId: "class-1",
    week: 24,
    year: 2026,
    monday: true,
    tuesday: true,
    wednesday: false,
    thursday: true,
    friday: true,
    saturday: true,
    recordedBy: "peter.kipchoge@school.edu",
    recordedDate: "2026-06-19",
  },
  {
    id: "att-3",
    studentId: "STU003",
    studentName: "Carol Omondi",
    classId: "class-1",
    week: 24,
    year: 2026,
    monday: true,
    tuesday: false,
    wednesday: false,
    thursday: true,
    friday: true,
    saturday: false,
    recordedBy: "peter.kipchoge@school.edu",
    recordedDate: "2026-06-19",
  },
  {
    id: "att-4",
    studentId: "STU004",
    studentName: "David Kipchoge",
    classId: "class-1",
    week: 24,
    year: 2026,
    monday: true,
    tuesday: true,
    wednesday: true,
    thursday: false,
    friday: true,
    saturday: true,
    recordedBy: "peter.kipchoge@school.edu",
    recordedDate: "2026-06-19",
  },
  {
    id: "att-5",
    studentId: "STU005",
    studentName: "Eve Njeri",
    classId: "class-1",
    week: 24,
    year: 2026,
    monday: true,
    tuesday: true,
    wednesday: true,
    thursday: true,
    friday: false,
    saturday: true,
    recordedBy: "peter.kipchoge@school.edu",
    recordedDate: "2026-06-19",
  },
];

export const days = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
export const dayShorts = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

export function calculateAttendancePercentage(presentDays: number, totalDays: number = 6): number {
  return Math.round((presentDays / totalDays) * 100);
}

export function getAttendanceSummary(records: AttendanceRecord[]): WeeklyAttendanceSummary[] {
  return records.map((record) => {
    const presentDays =
      (record.monday ? 1 : 0) +
      (record.tuesday ? 1 : 0) +
      (record.wednesday ? 1 : 0) +
      (record.thursday ? 1 : 0) +
      (record.friday ? 1 : 0) +
      (record.saturday ? 1 : 0);

    return {
      studentId: record.studentId,
      studentName: record.studentName,
      presentDays,
      absentDays: 6 - presentDays,
      attendancePercentage: calculateAttendancePercentage(presentDays),
      week: record.week,
    };
  });
}

export function getAbsentStudents(records: AttendanceRecord[]): WeeklyAttendanceSummary[] {
  const summary = getAttendanceSummary(records);
  return summary.filter((s) => s.absentDays > 2); // More than 2 absences
}
