// Enterprise School Management System - Demo Data

export interface School {
  id: string;
  name: string;
  code: string;
  type: "Nursery" | "Primary" | "Secondary";
  level: "Primary" | "O-Level" | "A-Level" | "Mixed";
  ownership: "Government" | "Private" | "Religious" | "NGO";
  phone: string;
  whatsapp: string;
  email: string;
  website?: string;
  country: string;
  region: string;
  district: string;
  city: string;
  address: string;
  principalName: string;
  principalPhone: string;
  principalEmail: string;
  bursarName: string;
  adminName: string;
  motto: string;
  vision: string;
  academicYearStart: string;
  academicYearEnd: string;
  subscriptionPlan: "Free" | "Basic" | "Professional" | "Enterprise";
  maxStudents: number;
  currentStudents: number;
  status: "Active" | "Suspended" | "Trial";
  dateRegistered: string;
  ipAddress?: string;
  networkName?: string;
  logoUrl?: string;
}

export interface Subject {
  id: string;
  name: string;
  code: string;
  level: "Primary" | "O-Level" | "A-Level";
  isDefault: boolean;
}

export interface Class {
  id: string;
  name: string;
  level: string;
  stream?: string;
  form?: string;
  totalStudents: number;
}

export interface AOIMark {
  id: string;
  studentId: string;
  teacherId: string;
  subjectId: string;
  term: number;
  year: number;
  aoiMark: number; // 1.0 - 3.0
  projectWorkMark: number; // 1.0 - 3.0
  totalAOI: number; // aoiMark + projectWorkMark = 20% of final mark
  dateRecorded: string;
}

export interface ExamMark {
  id: string;
  studentId: string;
  teacherId: string;
  subjectId: string;
  term: number;
  year: number;
  integrationMark: number; // 0-40
  examMark: number; // 0-60
  totalExamMark: number; // integration + exam = 80% of final mark
  dateRecorded: string;
}

export interface StudentResult {
  id: string;
  studentId: string;
  subjectId: string;
  term: number;
  year: number;
  aoiMarks: number; // 20%
  examMarks: number; // 80%
  totalMark: number; // 0-100
  grade: "A+" | "A" | "B" | "C" | "D" | "E" | "F";
  result: "1" | "2" | "3"; // 1=Excellent, 2=Good, 3=Poor
  remarks: string;
}

export interface GradingScale {
  minMark: number;
  maxMark: number;
  grade: "A+" | "A" | "B" | "C" | "D" | "E" | "F";
  result: "1" | "2" | "3";
  remarks: string;
}

// Grading Scale
export const GRADING_SCALE: GradingScale[] = [
  { minMark: 85, maxMark: 100, grade: "A+", result: "1", remarks: "Excellent" },
  { minMark: 80, maxMark: 84, grade: "A", result: "1", remarks: "Very Good" },
  { minMark: 70, maxMark: 79, grade: "B", result: "1", remarks: "Good" },
  { minMark: 60, maxMark: 69, grade: "C", result: "2", remarks: "Satisfactory" },
  { minMark: 50, maxMark: 59, grade: "D", result: "2", remarks: "Pass" },
  { minMark: 30, maxMark: 49, grade: "E", result: "3", remarks: "Needs Improvement" },
  { minMark: 0, maxMark: 29, grade: "F", result: "3", remarks: "Fail" },
];

// Calculate grade from mark
export function calculateGrade(mark: number): { grade: string; result: string; remarks: string } {
  const scale = GRADING_SCALE.find((s) => mark >= s.minMark && mark <= s.maxMark);
  return scale || { grade: "F", result: "3", remarks: "Fail" };
}

// Calculate total mark from AOI and Exam marks
export function calculateTotalMark(aoiMarks: number, examMarks: number): number {
  const aoiPercentage = (aoiMarks / 3.0) * 20; // AOI is 20%
  const examPercentage = ((examMarks / 100) * 80); // Exam is 80%
  return Math.round(aoiPercentage + examPercentage);
}

// Demo Schools
export const demoSchools: School[] = [
  {
    id: "school-1",
    name: "Nairobi International School",
    code: "NIS001",
    type: "Secondary",
    level: "Mixed",
    ownership: "Private",
    phone: "+256701234567",
    whatsapp: "+256701234567",
    email: "admin@nairobi-intl.edu",
    website: "www.nairobi-intl.edu",
    country: "Uganda",
    region: "Central",
    district: "Kampala",
    city: "Kampala",
    address: "123 Education Lane, Kampala",
    principalName: "Dr. James Kipchoge",
    principalPhone: "+256701234567",
    principalEmail: "principal@nairobi-intl.edu",
    bursarName: "Grace Mwangi",
    adminName: "Peter Kipchoge",
    motto: "Learn and Shine",
    vision: "Excellence in Education for Global Leadership",
    academicYearStart: "2026-01-15",
    academicYearEnd: "2026-11-30",
    subscriptionPlan: "Professional",
    maxStudents: 500,
    currentStudents: 450,
    status: "Active",
    dateRegistered: "2024-01-01",
    ipAddress: "192.168.1.0/24",
    networkName: "NIS-STAFF-NETWORK",
    logoUrl: "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100'%3E%3Ccircle cx='50' cy='50' r='45' fill='%234F46E5'/%3E%3Ctext x='50' y='60' font-size='50' font-weight='bold' fill='white' text-anchor='middle'%3EN%3C/text%3E%3C/svg%3E",
  },
];

// Demo Subjects
export const demoSubjects: Subject[] = [
  // Primary Subjects
  { id: "subj-1", name: "Mathematics", code: "MATH", level: "Primary", isDefault: true },
  { id: "subj-2", name: "English", code: "ENG", level: "Primary", isDefault: true },
  { id: "subj-3", name: "Science", code: "SCI", level: "Primary", isDefault: true },
  { id: "subj-4", name: "Social Studies", code: "SS", level: "Primary", isDefault: true },
  { id: "subj-5", name: "Physical Education", code: "PE", level: "Primary", isDefault: true },
  { id: "subj-6", name: "Art", code: "ART", level: "Primary", isDefault: true },
  { id: "subj-7", name: "Music", code: "MUS", level: "Primary", isDefault: true },

  // O-Level Subjects
  { id: "subj-8", name: "Mathematics", code: "MATH", level: "O-Level", isDefault: true },
  { id: "subj-9", name: "English", code: "ENG", level: "O-Level", isDefault: true },
  { id: "subj-10", name: "Physics", code: "PHY", level: "O-Level", isDefault: true },
  { id: "subj-11", name: "Chemistry", code: "CHEM", level: "O-Level", isDefault: true },
  { id: "subj-12", name: "Biology", code: "BIO", level: "O-Level", isDefault: true },
  { id: "subj-13", name: "History", code: "HIST", level: "O-Level", isDefault: true },
  { id: "subj-14", name: "Geography", code: "GEO", level: "O-Level", isDefault: true },
  { id: "subj-15", name: "Agriculture", code: "AGR", level: "O-Level", isDefault: true },
  { id: "subj-16", name: "ICT", code: "ICT", level: "O-Level", isDefault: true },
  { id: "subj-17", name: "Religious Education", code: "RE", level: "O-Level", isDefault: true },
  { id: "subj-18", name: "Luganda", code: "LUG", level: "O-Level", isDefault: true },
  { id: "subj-19", name: "Kiswahili", code: "KIS", level: "O-Level", isDefault: true },

  // A-Level Subjects
  { id: "subj-20", name: "Mathematics", code: "MATH", level: "A-Level", isDefault: true },
  { id: "subj-21", name: "English", code: "ENG", level: "A-Level", isDefault: true },
  { id: "subj-22", name: "Physics", code: "PHY", level: "A-Level", isDefault: true },
  { id: "subj-23", name: "Chemistry", code: "CHEM", level: "A-Level", isDefault: true },
  { id: "subj-24", name: "Biology", code: "BIO", level: "A-Level", isDefault: true },
  { id: "subj-25", name: "History", code: "HIST", level: "A-Level", isDefault: true },
  { id: "subj-26", name: "Geography", code: "GEO", level: "A-Level", isDefault: true },
  { id: "subj-27", name: "Economics", code: "ECON", level: "A-Level", isDefault: true },
];

// Demo Classes
export const demoClasses: Class[] = [
  { id: "class-1", name: "S1 East", level: "O-Level", stream: "East", form: "1", totalStudents: 45 },
  { id: "class-2", name: "S1 West", level: "O-Level", stream: "West", form: "1", totalStudents: 42 },
  { id: "class-3", name: "S2 East", level: "O-Level", stream: "East", form: "2", totalStudents: 43 },
  { id: "class-4", name: "S2 West", level: "O-Level", stream: "West", form: "2", totalStudents: 44 },
  { id: "class-5", name: "S3 East", level: "O-Level", stream: "East", form: "3", totalStudents: 40 },
  { id: "class-6", name: "S3 West", level: "O-Level", stream: "West", form: "3", totalStudents: 41 },
  { id: "class-7", name: "S4 East", level: "O-Level", stream: "East", form: "4", totalStudents: 38 },
  { id: "class-8", name: "S4 West", level: "O-Level", stream: "West", form: "4", totalStudents: 37 },
  { id: "class-9", name: "S5 MEG", level: "A-Level", stream: "MEG", form: "5", totalStudents: 25 },
  { id: "class-10", name: "S5 PCM", level: "A-Level", stream: "PCM", form: "5", totalStudents: 28 },
  { id: "class-11", name: "S6 MEG", level: "A-Level", stream: "MEG", form: "6", totalStudents: 24 },
  { id: "class-12", name: "S6 PCM", level: "A-Level", stream: "PCM", form: "6", totalStudents: 26 },
];

// Demo Students with AOI and Exam Marks
export interface DemoStudent {
  id: string;
  firstName: string;
  lastName: string;
  studentId: string;
  gender: string;
  dateOfBirth: string;
  nationality: string;
  classId: string;
  level: string;
  admissionDate: string;
  parentName: string;
  parentPhone: string;
  bloodGroup: string;
  medicalConditions: string;
  photoUrl: string;
  status: "Active" | "Graduated" | "Transferred" | "Suspended";
}

export const demoStudents: DemoStudent[] = [
  {
    id: "std-1",
    firstName: "Alice",
    lastName: "Kariuki",
    studentId: "NIS/S1/001",
    gender: "Female",
    dateOfBirth: "2009-05-15",
    nationality: "Kenyan",
    classId: "class-1",
    level: "O-Level",
    admissionDate: "2024-01-15",
    parentName: "John Kariuki",
    parentPhone: "+256701234567",
    bloodGroup: "O+",
    medicalConditions: "None",
    photoUrl: "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100'%3E%3Crect width='100' height='100' fill='%23E5E7EB'/%3E%3Ccircle cx='50' cy='35' r='15' fill='%239CA3AF'/%3E%3Cpath d='M 30 70 Q 50 55 70 70 L 70 100 L 30 100 Z' fill='%239CA3AF'/%3E%3C/svg%3E",
    status: "Active",
  },
  {
    id: "std-2",
    firstName: "John",
    lastName: "Kipchoge",
    studentId: "NIS/S1/002",
    gender: "Male",
    dateOfBirth: "2009-08-22",
    nationality: "Ugandan",
    classId: "class-1",
    level: "O-Level",
    admissionDate: "2024-01-15",
    parentName: "Peter Kipchoge",
    parentPhone: "+256702345678",
    bloodGroup: "A+",
    medicalConditions: "Asthma",
    photoUrl: "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100'%3E%3Crect width='100' height='100' fill='%23E5E7EB'/%3E%3Ccircle cx='50' cy='35' r='15' fill='%239CA3AF'/%3E%3Cpath d='M 30 70 Q 50 55 70 70 L 70 100 L 30 100 Z' fill='%239CA3AF'/%3E%3C/svg%3E",
    status: "Active",
  },
  {
    id: "std-3",
    firstName: "Grace",
    lastName: "Mwangi",
    studentId: "NIS/S1/003",
    gender: "Female",
    dateOfBirth: "2009-03-10",
    nationality: "Kenyan",
    classId: "class-1",
    level: "O-Level",
    admissionDate: "2024-01-15",
    parentName: "David Mwangi",
    parentPhone: "+256703456789",
    bloodGroup: "B+",
    medicalConditions: "None",
    photoUrl: "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100'%3E%3Crect width='100' height='100' fill='%23E5E7EB'/%3E%3Ccircle cx='50' cy='35' r='15' fill='%239CA3AF'/%3E%3Cpath d='M 30 70 Q 50 55 70 70 L 70 100 L 30 100 Z' fill='%239CA3AF'/%3E%3C/svg%3E",
    status: "Active",
  },
];

// Demo AOI Marks
export const demoAOIMarks: AOIMark[] = [
  {
    id: "aoi-1",
    studentId: "std-1",
    teacherId: "teacher-1",
    subjectId: "subj-8",
    term: 1,
    year: 2026,
    aoiMark: 2.8,
    projectWorkMark: 2.9,
    totalAOI: 5.7,
    dateRecorded: "2026-03-15",
  },
  {
    id: "aoi-2",
    studentId: "std-2",
    teacherId: "teacher-1",
    subjectId: "subj-8",
    term: 1,
    year: 2026,
    aoiMark: 2.5,
    projectWorkMark: 2.6,
    totalAOI: 5.1,
    dateRecorded: "2026-03-15",
  },
  {
    id: "aoi-3",
    studentId: "std-3",
    teacherId: "teacher-1",
    subjectId: "subj-8",
    term: 1,
    year: 2026,
    aoiMark: 3.0,
    projectWorkMark: 3.0,
    totalAOI: 6.0,
    dateRecorded: "2026-03-15",
  },
];

// Demo Exam Marks
export const demoExamMarks: ExamMark[] = [
  {
    id: "exam-1",
    studentId: "std-1",
    teacherId: "teacher-1",
    subjectId: "subj-8",
    term: 1,
    year: 2026,
    integrationMark: 38,
    examMark: 58,
    totalExamMark: 96,
    dateRecorded: "2026-03-20",
  },
  {
    id: "exam-2",
    studentId: "std-2",
    teacherId: "teacher-1",
    subjectId: "subj-8",
    term: 1,
    year: 2026,
    integrationMark: 35,
    examMark: 52,
    totalExamMark: 87,
    dateRecorded: "2026-03-20",
  },
  {
    id: "exam-3",
    studentId: "std-3",
    teacherId: "teacher-1",
    subjectId: "subj-8",
    term: 1,
    year: 2026,
    integrationMark: 39,
    examMark: 60,
    totalExamMark: 99,
    dateRecorded: "2026-03-20",
  },
];

// Calculate student results
export function calculateStudentResult(aoiMarks: AOIMark, examMarks: ExamMark): StudentResult {
  const aoiPercentage = (aoiMarks.totalAOI / 6.0) * 20; // AOI out of 6.0, 20% of total
  const examPercentage = (examMarks.totalExamMark / 100) * 80; // Exam out of 100, 80% of total
  const totalMark = Math.round(aoiPercentage + examPercentage);
  const gradeInfo = calculateGrade(totalMark);

  return {
    id: `result-${aoiMarks.studentId}-${examMarks.subjectId}`,
    studentId: aoiMarks.studentId,
    subjectId: aoiMarks.subjectId,
    term: aoiMarks.term,
    year: aoiMarks.year,
    aoiMarks: aoiPercentage,
    examMarks: examPercentage,
    totalMark,
    grade: gradeInfo.grade as any,
    result: gradeInfo.result as any,
    remarks: gradeInfo.remarks,
  };
}

// Demo Platform Owner Data
export interface PlatformStats {
  totalSchools: number;
  activeSchools: number;
  suspendedSchools: number;
  totalStudents: number;
  totalTeachers: number;
  totalRevenue: number;
  monthlyRevenue: number;
  expiringSubscriptions: number;
  supportTickets: number;
}

export const demoPlatformStats: PlatformStats = {
  totalSchools: 156,
  activeSchools: 142,
  suspendedSchools: 14,
  totalStudents: 45230,
  totalTeachers: 3456,
  totalRevenue: 45600000,
  monthlyRevenue: 3200000,
  expiringSubscriptions: 12,
  supportTickets: 28,
};
