// EduTrack Enterprise Data - Working System

export interface School {
  id: string;
  name: string;
  code: string; // 6-digit unique code
  type: "Primary" | "Secondary"; // Only two types
  // Primary auto-has: Kindergarten, Lower Primary, Upper Primary
  // Secondary auto-has: O-Level (S1-S4), A-Level (S5-S6)
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
  logoUrl?: string;
}

export interface Subject {
  id: string;
  name: string;
  code: string;
  schoolType: "Primary" | "Secondary"; // Subjects are tied to school type
  level: "Kindergarten" | "Lower Primary" | "Upper Primary" | "O-Level" | "A-Level";
  hasPapers: boolean; // Whether subject has Paper 1 & Paper 2
  isDefault: boolean;
}

export interface Class {
  id: string;
  name: string;
  level: string;
  stream?: string;
  form?: string;
  totalStudents: number;
  schoolType: "Primary" | "Secondary";
}

export interface SubjectMark {
  id: string;
  studentId: string;
  teacherId: string;
  subjectId: string;
  term: number;
  year: number;
  paper1Mark: number; // Mark for Paper 1 (0-100)
  paper2Mark?: number; // Mark for Paper 2 (0-100) - optional if subject has no Paper 2
  averageScore: number; // If has papers: (paper1 + paper2) / 2, else: paper1
  grade: string;
  remarks: string;
  teacherComment?: string;
  dateRecorded: string;
}

export interface StudentResult {
  id: string;
  studentId: string;
  subjectId: string;
  term: number;
  year: number;
  averageScore: number; // Final score after paper averaging
  grade: string;
  remarks: string;
  teacherComment?: string;
}

export interface GradingScale {
  minMark: number;
  maxMark: number;
  grade: string;
  remarks: string;
}

// ============================================
// GRADING SYSTEM (as specified by user)
// 100-80 = A (Exceptional)
// 79-60 = B (Outstanding)
// 59-49 = C (Satisfactory)
// 39-20 = D (Basic)
// 29-0 = E (Elementary)
// Note: 40-49 maps to C, 20-29 maps to D based on user's ranges
// ============================================
export const GRADING_SCALE: GradingScale[] = [
  { minMark: 80, maxMark: 100, grade: "A", remarks: "Exceptional" },
  { minMark: 60, maxMark: 79, grade: "B", remarks: "Outstanding" },
  { minMark: 49, maxMark: 59, grade: "C", remarks: "Satisfactory" },
  { minMark: 20, maxMark: 48, grade: "D", remarks: "Basic" },
  { minMark: 0, maxMark: 19, grade: "E", remarks: "Elementary" },
];

// Calculate grade from mark (supports decimal/point marks)
export function calculateGrade(mark: number): { grade: string; remarks: string } {
  const roundedMark = Math.round(mark);
  const scale = GRADING_SCALE.find((s) => roundedMark >= s.minMark && roundedMark <= s.maxMark);
  return scale ? { grade: scale.grade, remarks: scale.remarks } : { grade: "E", remarks: "Elementary" };
}

// Calculate average score when subject has Paper 1 and Paper 2
export function calculateAverageScore(paper1: number, paper2?: number): number {
  if (paper2 !== undefined && paper2 !== null) {
    // Paper 1 + Paper 2, divide by 2
    return parseFloat(((paper1 + paper2) / 2).toFixed(1));
  }
  return parseFloat(paper1.toFixed(1));
}

// Calculate class position based on average scores
export function calculatePosition(studentAvg: number, allAverages: number[]): number {
  const sorted = [...allAverages].sort((a, b) => b - a);
  return sorted.indexOf(studentAvg) + 1;
}

// Get school levels based on type
export function getSchoolLevels(schoolType: "Primary" | "Secondary"): string[] {
  if (schoolType === "Primary") {
    return ["Kindergarten", "Lower Primary", "Upper Primary"];
  }
  // Secondary automatically includes O-Level and A-Level
  return ["O-Level", "A-Level"];
}

// Get classes for school type
export function getClassesForSchoolType(schoolType: "Primary" | "Secondary"): Class[] {
  return demoClasses.filter((c) => c.schoolType === schoolType);
}

// Get subjects for school type (Primary subjects only in primary, Secondary only in secondary)
export function getSubjectsForSchoolType(schoolType: "Primary" | "Secondary"): Subject[] {
  return demoSubjects.filter((s) => s.schoolType === schoolType);
}

// ============================================
// DEMO DATA
// ============================================

export const demoSchools: School[] = [
  {
    id: "school-1",
    name: "Gideon High School Naggalama",
    code: "482917",
    type: "Secondary",
    ownership: "Private",
    phone: "+256701234567",
    whatsapp: "+256701234567",
    email: "admin@gideonhigh.edu",
    website: "www.gideonhigh.edu",
    country: "Uganda",
    region: "Central",
    district: "Mukono",
    city: "Naggalama",
    address: "P.O BOX 26725",
    principalName: "Dr. James Ssemakula",
    principalPhone: "+256701234567",
    principalEmail: "principal@gideonhigh.edu",
    adminName: "Sarah Namukasa",
    motto: "Learn and Shine",
    vision: "Excellence in Education for Global Leadership",
    academicYearStart: "2026-02-03",
    academicYearEnd: "2026-11-29",
    subscriptionPlan: "Professional",
    maxStudents: 2000,
    currentStudents: 450,
    status: "Active",
    dateRegistered: "2024-01-01",
    logoUrl: "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100'%3E%3Ccircle cx='50' cy='50' r='45' fill='%234F46E5'/%3E%3Ctext x='50' y='60' font-size='40' font-weight='bold' fill='white' text-anchor='middle'%3EG%3C/text%3E%3C/svg%3E",
  },
  {
    id: "school-2",
    name: "Bright Future Primary School",
    code: "739261",
    type: "Primary",
    ownership: "Private",
    phone: "+256702345678",
    whatsapp: "+256702345678",
    email: "admin@brightfuture.edu",
    country: "Uganda",
    region: "Central",
    district: "Wakiso",
    city: "Entebbe",
    address: "Plot 45, Airport Road",
    principalName: "Mrs. Florence Namutebi",
    principalPhone: "+256702345678",
    principalEmail: "head@brightfuture.edu",
    adminName: "David Okello",
    motto: "Building Tomorrow's Leaders",
    vision: "Quality Primary Education for Every Child",
    academicYearStart: "2026-02-03",
    academicYearEnd: "2026-11-29",
    subscriptionPlan: "Basic",
    maxStudents: 800,
    currentStudents: 320,
    status: "Active",
    dateRegistered: "2025-03-15",
    logoUrl: "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100'%3E%3Ccircle cx='50' cy='50' r='45' fill='%2310B981'/%3E%3Ctext x='50' y='60' font-size='40' font-weight='bold' fill='white' text-anchor='middle'%3EB%3C/text%3E%3C/svg%3E",
  },
];

// SUBJECTS - Separated by school type
export const demoSubjects: Subject[] = [
  // PRIMARY SUBJECTS (Kindergarten, Lower Primary, Upper Primary)
  { id: "subj-p1", name: "Mathematics", code: "MATH", schoolType: "Primary", level: "Upper Primary", hasPapers: true, isDefault: true },
  { id: "subj-p2", name: "English", code: "ENG", schoolType: "Primary", level: "Upper Primary", hasPapers: true, isDefault: true },
  { id: "subj-p3", name: "Science", code: "SCI", schoolType: "Primary", level: "Upper Primary", hasPapers: true, isDefault: true },
  { id: "subj-p4", name: "Social Studies", code: "SST", schoolType: "Primary", level: "Upper Primary", hasPapers: true, isDefault: true },
  { id: "subj-p5", name: "Religious Education", code: "RE", schoolType: "Primary", level: "Upper Primary", hasPapers: false, isDefault: true },
  { id: "subj-p6", name: "Physical Education", code: "PE", schoolType: "Primary", level: "Lower Primary", hasPapers: false, isDefault: true },
  { id: "subj-p7", name: "Art & Craft", code: "ART", schoolType: "Primary", level: "Lower Primary", hasPapers: false, isDefault: true },
  { id: "subj-p8", name: "Music", code: "MUS", schoolType: "Primary", level: "Kindergarten", hasPapers: false, isDefault: true },
  { id: "subj-p9", name: "Literacy", code: "LIT", schoolType: "Primary", level: "Kindergarten", hasPapers: false, isDefault: true },
  { id: "subj-p10", name: "Numeracy", code: "NUM", schoolType: "Primary", level: "Kindergarten", hasPapers: false, isDefault: true },

  // SECONDARY O-LEVEL SUBJECTS (S1-S4)
  { id: "subj-s1", name: "Mathematics", code: "MATH", schoolType: "Secondary", level: "O-Level", hasPapers: true, isDefault: true },
  { id: "subj-s2", name: "English", code: "ENG", schoolType: "Secondary", level: "O-Level", hasPapers: true, isDefault: true },
  { id: "subj-s3", name: "Physics", code: "PHY", schoolType: "Secondary", level: "O-Level", hasPapers: true, isDefault: true },
  { id: "subj-s4", name: "Chemistry", code: "CHEM", schoolType: "Secondary", level: "O-Level", hasPapers: true, isDefault: true },
  { id: "subj-s5", name: "Biology", code: "BIO", schoolType: "Secondary", level: "O-Level", hasPapers: true, isDefault: true },
  { id: "subj-s6", name: "History", code: "HIST", schoolType: "Secondary", level: "O-Level", hasPapers: true, isDefault: true },
  { id: "subj-s7", name: "Geography", code: "GEO", schoolType: "Secondary", level: "O-Level", hasPapers: true, isDefault: true },
  { id: "subj-s8", name: "Agriculture", code: "AGR", schoolType: "Secondary", level: "O-Level", hasPapers: true, isDefault: true },
  { id: "subj-s9", name: "ICT", code: "ICT", schoolType: "Secondary", level: "O-Level", hasPapers: false, isDefault: true },
  { id: "subj-s10", name: "Religious Education", code: "RE", schoolType: "Secondary", level: "O-Level", hasPapers: false, isDefault: true },
  { id: "subj-s11", name: "Luganda", code: "LUG", schoolType: "Secondary", level: "O-Level", hasPapers: true, isDefault: true },
  { id: "subj-s12", name: "Art & Design", code: "ART", schoolType: "Secondary", level: "O-Level", hasPapers: true, isDefault: true },
  { id: "subj-s13", name: "Entrepreneurship", code: "ENT", schoolType: "Secondary", level: "O-Level", hasPapers: false, isDefault: true },
  { id: "subj-s14", name: "Kiswahili", code: "KIS", schoolType: "Secondary", level: "O-Level", hasPapers: true, isDefault: true },

  // SECONDARY A-LEVEL SUBJECTS (S5-S6)
  { id: "subj-a1", name: "Mathematics", code: "MATH", schoolType: "Secondary", level: "A-Level", hasPapers: true, isDefault: true },
  { id: "subj-a2", name: "English", code: "ENG", schoolType: "Secondary", level: "A-Level", hasPapers: true, isDefault: true },
  { id: "subj-a3", name: "Physics", code: "PHY", schoolType: "Secondary", level: "A-Level", hasPapers: true, isDefault: true },
  { id: "subj-a4", name: "Chemistry", code: "CHEM", schoolType: "Secondary", level: "A-Level", hasPapers: true, isDefault: true },
  { id: "subj-a5", name: "Biology", code: "BIO", schoolType: "Secondary", level: "A-Level", hasPapers: true, isDefault: true },
  { id: "subj-a6", name: "History", code: "HIST", schoolType: "Secondary", level: "A-Level", hasPapers: true, isDefault: true },
  { id: "subj-a7", name: "Geography", code: "GEO", schoolType: "Secondary", level: "A-Level", hasPapers: true, isDefault: true },
  { id: "subj-a8", name: "Economics", code: "ECON", schoolType: "Secondary", level: "A-Level", hasPapers: true, isDefault: true },
  { id: "subj-a9", name: "General Paper", code: "GP", schoolType: "Secondary", level: "A-Level", hasPapers: false, isDefault: true },
  { id: "subj-a10", name: "Subsidiary ICT", code: "SICT", schoolType: "Secondary", level: "A-Level", hasPapers: false, isDefault: true },
];

// CLASSES - Separated by school type
export const demoClasses: Class[] = [
  // Primary Classes
  { id: "class-k1", name: "Baby Class", level: "Kindergarten", totalStudents: 30, schoolType: "Primary" },
  { id: "class-k2", name: "Middle Class", level: "Kindergarten", totalStudents: 28, schoolType: "Primary" },
  { id: "class-k3", name: "Top Class", level: "Kindergarten", totalStudents: 32, schoolType: "Primary" },
  { id: "class-lp1", name: "P1", level: "Lower Primary", totalStudents: 45, schoolType: "Primary" },
  { id: "class-lp2", name: "P2", level: "Lower Primary", totalStudents: 42, schoolType: "Primary" },
  { id: "class-lp3", name: "P3", level: "Lower Primary", totalStudents: 40, schoolType: "Primary" },
  { id: "class-up1", name: "P4", level: "Upper Primary", totalStudents: 38, schoolType: "Primary" },
  { id: "class-up2", name: "P5", level: "Upper Primary", totalStudents: 36, schoolType: "Primary" },
  { id: "class-up3", name: "P6", level: "Upper Primary", totalStudents: 35, schoolType: "Primary" },
  { id: "class-up4", name: "P7", level: "Upper Primary", totalStudents: 34, schoolType: "Primary" },

  // Secondary O-Level Classes
  { id: "class-s1e", name: "S1 East", level: "O-Level", stream: "East", form: "1", totalStudents: 45, schoolType: "Secondary" },
  { id: "class-s1w", name: "S1 West", level: "O-Level", stream: "West", form: "1", totalStudents: 42, schoolType: "Secondary" },
  { id: "class-s2e", name: "S2 East", level: "O-Level", stream: "East", form: "2", totalStudents: 43, schoolType: "Secondary" },
  { id: "class-s2w", name: "S2 West", level: "O-Level", stream: "West", form: "2", totalStudents: 44, schoolType: "Secondary" },
  { id: "class-s3e", name: "S3 East", level: "O-Level", stream: "East", form: "3", totalStudents: 40, schoolType: "Secondary" },
  { id: "class-s3w", name: "S3 West", level: "O-Level", stream: "West", form: "3", totalStudents: 41, schoolType: "Secondary" },
  { id: "class-s4e", name: "S4 East", level: "O-Level", stream: "East", form: "4", totalStudents: 38, schoolType: "Secondary" },
  { id: "class-s4w", name: "S4 West", level: "O-Level", stream: "West", form: "4", totalStudents: 37, schoolType: "Secondary" },

  // Secondary A-Level Classes
  { id: "class-s5meg", name: "S5 MEG", level: "A-Level", stream: "MEG", form: "5", totalStudents: 25, schoolType: "Secondary" },
  { id: "class-s5pcm", name: "S5 PCM", level: "A-Level", stream: "PCM", form: "5", totalStudents: 28, schoolType: "Secondary" },
  { id: "class-s5bcm", name: "S5 BCM", level: "A-Level", stream: "BCM", form: "5", totalStudents: 22, schoolType: "Secondary" },
  { id: "class-s6meg", name: "S6 MEG", level: "A-Level", stream: "MEG", form: "6", totalStudents: 24, schoolType: "Secondary" },
  { id: "class-s6pcm", name: "S6 PCM", level: "A-Level", stream: "PCM", form: "6", totalStudents: 26, schoolType: "Secondary" },
  { id: "class-s6bcm", name: "S6 BCM", level: "A-Level", stream: "BCM", form: "6", totalStudents: 20, schoolType: "Secondary" },
];

// Demo Students
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
    firstName: "Namunyama",
    lastName: "Rayat",
    studentId: "GHS/S1/001",
    gender: "Female",
    dateOfBirth: "2009-05-15",
    nationality: "Ugandan",
    classId: "class-s1e",
    level: "O-Level",
    admissionDate: "2024-02-03",
    parentName: "John Rayat",
    parentPhone: "+256701234567",
    bloodGroup: "O+",
    medicalConditions: "None",
    photoUrl: "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100'%3E%3Crect width='100' height='100' fill='%23E5E7EB'/%3E%3Ccircle cx='50' cy='35' r='15' fill='%239CA3AF'/%3E%3Cpath d='M 30 70 Q 50 55 70 70 L 70 100 L 30 100 Z' fill='%239CA3AF'/%3E%3C/svg%3E",
    status: "Active",
  },
  {
    id: "std-2",
    firstName: "David",
    lastName: "Ssempijja",
    studentId: "GHS/S1/002",
    gender: "Male",
    dateOfBirth: "2009-08-22",
    nationality: "Ugandan",
    classId: "class-s1e",
    level: "O-Level",
    admissionDate: "2024-02-03",
    parentName: "Peter Ssempijja",
    parentPhone: "+256702345678",
    bloodGroup: "A+",
    medicalConditions: "Asthma",
    photoUrl: "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100'%3E%3Crect width='100' height='100' fill='%23E5E7EB'/%3E%3Ccircle cx='50' cy='35' r='15' fill='%239CA3AF'/%3E%3Cpath d='M 30 70 Q 50 55 70 70 L 70 100 L 30 100 Z' fill='%239CA3AF'/%3E%3C/svg%3E",
    status: "Active",
  },
  {
    id: "std-3",
    firstName: "Grace",
    lastName: "Nakamya",
    studentId: "GHS/S1/003",
    gender: "Female",
    dateOfBirth: "2009-03-10",
    nationality: "Ugandan",
    classId: "class-s1e",
    level: "O-Level",
    admissionDate: "2024-02-03",
    parentName: "David Nakamya",
    parentPhone: "+256703456789",
    bloodGroup: "B+",
    medicalConditions: "None",
    photoUrl: "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100'%3E%3Crect width='100' height='100' fill='%23E5E7EB'/%3E%3Ccircle cx='50' cy='35' r='15' fill='%239CA3AF'/%3E%3Cpath d='M 30 70 Q 50 55 70 70 L 70 100 L 30 100 Z' fill='%239CA3AF'/%3E%3C/svg%3E",
    status: "Active",
  },
  {
    id: "std-4",
    firstName: "Joseph",
    lastName: "Kato",
    studentId: "GHS/S1/004",
    gender: "Male",
    dateOfBirth: "2009-11-05",
    nationality: "Ugandan",
    classId: "class-s1w",
    level: "O-Level",
    admissionDate: "2024-02-03",
    parentName: "Moses Kato",
    parentPhone: "+256704567890",
    bloodGroup: "AB+",
    medicalConditions: "None",
    photoUrl: "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100'%3E%3Crect width='100' height='100' fill='%23E5E7EB'/%3E%3Ccircle cx='50' cy='35' r='15' fill='%239CA3AF'/%3E%3Cpath d='M 30 70 Q 50 55 70 70 L 70 100 L 30 100 Z' fill='%239CA3AF'/%3E%3C/svg%3E",
    status: "Active",
  },
  {
    id: "std-5",
    firstName: "Sarah",
    lastName: "Namubiru",
    studentId: "GHS/S2/001",
    gender: "Female",
    dateOfBirth: "2008-07-20",
    nationality: "Ugandan",
    classId: "class-s2e",
    level: "O-Level",
    admissionDate: "2023-02-03",
    parentName: "James Namubiru",
    parentPhone: "+256705678901",
    bloodGroup: "O-",
    medicalConditions: "None",
    photoUrl: "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100'%3E%3Crect width='100' height='100' fill='%23E5E7EB'/%3E%3Ccircle cx='50' cy='35' r='15' fill='%239CA3AF'/%3E%3Cpath d='M 30 70 Q 50 55 70 70 L 70 100 L 30 100 Z' fill='%239CA3AF'/%3E%3C/svg%3E",
    status: "Active",
  },
];

// Demo Subject Marks (with Paper 1 & Paper 2 support)
export const demoSubjectMarks: SubjectMark[] = [
  // Student 1 - Namunyama Rayat (S1 East)
  { id: "m-1", studentId: "std-1", teacherId: "t-1", subjectId: "subj-s1", term: 1, year: 2026, paper1Mark: 80, paper2Mark: 60, averageScore: 70, grade: "B", remarks: "Outstanding", dateRecorded: "2026-03-20" },
  { id: "m-2", studentId: "std-1", teacherId: "t-2", subjectId: "subj-s2", term: 1, year: 2026, paper1Mark: 85, paper2Mark: 78, averageScore: 81.5, grade: "A", remarks: "Exceptional", dateRecorded: "2026-03-20" },
  { id: "m-3", studentId: "std-1", teacherId: "t-3", subjectId: "subj-s3", term: 1, year: 2026, paper1Mark: 72, paper2Mark: 68, averageScore: 70, grade: "B", remarks: "Outstanding", dateRecorded: "2026-03-20" },
  { id: "m-4", studentId: "std-1", teacherId: "t-4", subjectId: "subj-s4", term: 1, year: 2026, paper1Mark: 90, paper2Mark: 85, averageScore: 87.5, grade: "A", remarks: "Exceptional", dateRecorded: "2026-03-20" },
  { id: "m-5", studentId: "std-1", teacherId: "t-5", subjectId: "subj-s5", term: 1, year: 2026, paper1Mark: 65, paper2Mark: 58, averageScore: 61.5, grade: "B", remarks: "Outstanding", dateRecorded: "2026-03-20" },
  { id: "m-6", studentId: "std-1", teacherId: "t-6", subjectId: "subj-s6", term: 1, year: 2026, paper1Mark: 78, paper2Mark: 82, averageScore: 80, grade: "A", remarks: "Exceptional", dateRecorded: "2026-03-20" },
  { id: "m-7", studentId: "std-1", teacherId: "t-7", subjectId: "subj-s7", term: 1, year: 2026, paper1Mark: 55, paper2Mark: 48, averageScore: 51.5, grade: "C", remarks: "Satisfactory", dateRecorded: "2026-03-20" },
  { id: "m-8", studentId: "std-1", teacherId: "t-8", subjectId: "subj-s8", term: 1, year: 2026, paper1Mark: 88, paper2Mark: 92, averageScore: 90, grade: "A", remarks: "Exceptional", dateRecorded: "2026-03-20" },
  { id: "m-9", studentId: "std-1", teacherId: "t-9", subjectId: "subj-s9", term: 1, year: 2026, paper1Mark: 75, averageScore: 75, grade: "B", remarks: "Outstanding", dateRecorded: "2026-03-20" },
  { id: "m-10", studentId: "std-1", teacherId: "t-10", subjectId: "subj-s13", term: 1, year: 2026, paper1Mark: 82, averageScore: 82, grade: "A", remarks: "Exceptional", dateRecorded: "2026-03-20" },

  // Student 2 - David Ssempijja (S1 East)
  { id: "m-11", studentId: "std-2", teacherId: "t-1", subjectId: "subj-s1", term: 1, year: 2026, paper1Mark: 65, paper2Mark: 70, averageScore: 67.5, grade: "B", remarks: "Outstanding", dateRecorded: "2026-03-20" },
  { id: "m-12", studentId: "std-2", teacherId: "t-2", subjectId: "subj-s2", term: 1, year: 2026, paper1Mark: 72, paper2Mark: 68, averageScore: 70, grade: "B", remarks: "Outstanding", dateRecorded: "2026-03-20" },
  { id: "m-13", studentId: "std-2", teacherId: "t-3", subjectId: "subj-s3", term: 1, year: 2026, paper1Mark: 58, paper2Mark: 52, averageScore: 55, grade: "C", remarks: "Satisfactory", dateRecorded: "2026-03-20" },
  { id: "m-14", studentId: "std-2", teacherId: "t-4", subjectId: "subj-s4", term: 1, year: 2026, paper1Mark: 80, paper2Mark: 75, averageScore: 77.5, grade: "B", remarks: "Outstanding", dateRecorded: "2026-03-20" },
  { id: "m-15", studentId: "std-2", teacherId: "t-5", subjectId: "subj-s5", term: 1, year: 2026, paper1Mark: 45, paper2Mark: 50, averageScore: 47.5, grade: "D", remarks: "Basic", dateRecorded: "2026-03-20" },

  // Student 3 - Grace Nakamya (S1 East)
  { id: "m-16", studentId: "std-3", teacherId: "t-1", subjectId: "subj-s1", term: 1, year: 2026, paper1Mark: 92, paper2Mark: 88, averageScore: 90, grade: "A", remarks: "Exceptional", dateRecorded: "2026-03-20" },
  { id: "m-17", studentId: "std-3", teacherId: "t-2", subjectId: "subj-s2", term: 1, year: 2026, paper1Mark: 95, paper2Mark: 90, averageScore: 92.5, grade: "A", remarks: "Exceptional", dateRecorded: "2026-03-20" },
  { id: "m-18", studentId: "std-3", teacherId: "t-3", subjectId: "subj-s3", term: 1, year: 2026, paper1Mark: 85, paper2Mark: 80, averageScore: 82.5, grade: "A", remarks: "Exceptional", dateRecorded: "2026-03-20" },
  { id: "m-19", studentId: "std-3", teacherId: "t-4", subjectId: "subj-s4", term: 1, year: 2026, paper1Mark: 88, paper2Mark: 92, averageScore: 90, grade: "A", remarks: "Exceptional", dateRecorded: "2026-03-20" },
  { id: "m-20", studentId: "std-3", teacherId: "t-5", subjectId: "subj-s5", term: 1, year: 2026, paper1Mark: 78, paper2Mark: 82, averageScore: 80, grade: "A", remarks: "Exceptional", dateRecorded: "2026-03-20" },
];

// Timetable Data
export interface TimetableEntry {
  id: string;
  day: "Monday" | "Tuesday" | "Wednesday" | "Thursday" | "Friday" | "Saturday";
  period: number;
  startTime: string;
  endTime: string;
  subjectId: string;
  teacherId: string;
  classId: string;
  room?: string;
}

export const demoTimetable: TimetableEntry[] = [
  // Monday
  { id: "tt-1", day: "Monday", period: 1, startTime: "08:00", endTime: "08:40", subjectId: "subj-s1", teacherId: "t-1", classId: "class-s1e", room: "Room 1" },
  { id: "tt-2", day: "Monday", period: 2, startTime: "08:40", endTime: "09:20", subjectId: "subj-s2", teacherId: "t-2", classId: "class-s1e", room: "Room 1" },
  { id: "tt-3", day: "Monday", period: 3, startTime: "09:40", endTime: "10:20", subjectId: "subj-s3", teacherId: "t-3", classId: "class-s1e", room: "Lab 1" },
  { id: "tt-4", day: "Monday", period: 4, startTime: "10:20", endTime: "11:00", subjectId: "subj-s4", teacherId: "t-4", classId: "class-s1e", room: "Lab 1" },
  { id: "tt-5", day: "Monday", period: 5, startTime: "11:20", endTime: "12:00", subjectId: "subj-s5", teacherId: "t-5", classId: "class-s1e", room: "Lab 2" },
  { id: "tt-6", day: "Monday", period: 6, startTime: "12:00", endTime: "12:40", subjectId: "subj-s6", teacherId: "t-6", classId: "class-s1e", room: "Room 1" },
  { id: "tt-7", day: "Monday", period: 7, startTime: "14:00", endTime: "14:40", subjectId: "subj-s7", teacherId: "t-7", classId: "class-s1e", room: "Room 2" },
  { id: "tt-8", day: "Monday", period: 8, startTime: "14:40", endTime: "15:20", subjectId: "subj-s9", teacherId: "t-9", classId: "class-s1e", room: "ICT Lab" },
  // Tuesday
  { id: "tt-9", day: "Tuesday", period: 1, startTime: "08:00", endTime: "08:40", subjectId: "subj-s3", teacherId: "t-3", classId: "class-s1e", room: "Lab 1" },
  { id: "tt-10", day: "Tuesday", period: 2, startTime: "08:40", endTime: "09:20", subjectId: "subj-s1", teacherId: "t-1", classId: "class-s1e", room: "Room 1" },
  { id: "tt-11", day: "Tuesday", period: 3, startTime: "09:40", endTime: "10:20", subjectId: "subj-s5", teacherId: "t-5", classId: "class-s1e", room: "Lab 2" },
  { id: "tt-12", day: "Tuesday", period: 4, startTime: "10:20", endTime: "11:00", subjectId: "subj-s2", teacherId: "t-2", classId: "class-s1e", room: "Room 1" },
  { id: "tt-13", day: "Tuesday", period: 5, startTime: "11:20", endTime: "12:00", subjectId: "subj-s8", teacherId: "t-8", classId: "class-s1e", room: "Room 3" },
  { id: "tt-14", day: "Tuesday", period: 6, startTime: "12:00", endTime: "12:40", subjectId: "subj-s4", teacherId: "t-4", classId: "class-s1e", room: "Lab 1" },
  // Wednesday
  { id: "tt-15", day: "Wednesday", period: 1, startTime: "08:00", endTime: "08:40", subjectId: "subj-s2", teacherId: "t-2", classId: "class-s1e", room: "Room 1" },
  { id: "tt-16", day: "Wednesday", period: 2, startTime: "08:40", endTime: "09:20", subjectId: "subj-s7", teacherId: "t-7", classId: "class-s1e", room: "Room 2" },
  { id: "tt-17", day: "Wednesday", period: 3, startTime: "09:40", endTime: "10:20", subjectId: "subj-s1", teacherId: "t-1", classId: "class-s1e", room: "Room 1" },
  { id: "tt-18", day: "Wednesday", period: 4, startTime: "10:20", endTime: "11:00", subjectId: "subj-s6", teacherId: "t-6", classId: "class-s1e", room: "Room 1" },
  { id: "tt-19", day: "Wednesday", period: 5, startTime: "11:20", endTime: "12:00", subjectId: "subj-s13", teacherId: "t-10", classId: "class-s1e", room: "Room 4" },
  // Thursday
  { id: "tt-20", day: "Thursday", period: 1, startTime: "08:00", endTime: "08:40", subjectId: "subj-s4", teacherId: "t-4", classId: "class-s1e", room: "Lab 1" },
  { id: "tt-21", day: "Thursday", period: 2, startTime: "08:40", endTime: "09:20", subjectId: "subj-s3", teacherId: "t-3", classId: "class-s1e", room: "Lab 1" },
  { id: "tt-22", day: "Thursday", period: 3, startTime: "09:40", endTime: "10:20", subjectId: "subj-s2", teacherId: "t-2", classId: "class-s1e", room: "Room 1" },
  { id: "tt-23", day: "Thursday", period: 4, startTime: "10:20", endTime: "11:00", subjectId: "subj-s1", teacherId: "t-1", classId: "class-s1e", room: "Room 1" },
  { id: "tt-24", day: "Thursday", period: 5, startTime: "11:20", endTime: "12:00", subjectId: "subj-s5", teacherId: "t-5", classId: "class-s1e", room: "Lab 2" },
  // Friday
  { id: "tt-25", day: "Friday", period: 1, startTime: "08:00", endTime: "08:40", subjectId: "subj-s6", teacherId: "t-6", classId: "class-s1e", room: "Room 1" },
  { id: "tt-26", day: "Friday", period: 2, startTime: "08:40", endTime: "09:20", subjectId: "subj-s8", teacherId: "t-8", classId: "class-s1e", room: "Room 3" },
  { id: "tt-27", day: "Friday", period: 3, startTime: "09:40", endTime: "10:20", subjectId: "subj-s9", teacherId: "t-9", classId: "class-s1e", room: "ICT Lab" },
  { id: "tt-28", day: "Friday", period: 4, startTime: "10:20", endTime: "11:00", subjectId: "subj-s7", teacherId: "t-7", classId: "class-s1e", room: "Room 2" },
];

// Exam Schedule
export interface ExamScheduleEntry {
  id: string;
  subjectId: string;
  classId: string;
  date: string;
  startTime: string;
  endTime: string;
  paper: "Paper 1" | "Paper 2" | "Single Paper";
  venue: string;
  invigilator: string;
}

export const demoExamSchedule: ExamScheduleEntry[] = [
  { id: "ex-1", subjectId: "subj-s1", classId: "class-s1e", date: "2026-07-07", startTime: "08:30", endTime: "11:30", paper: "Paper 1", venue: "Main Hall", invigilator: "Mr. Okello" },
  { id: "ex-2", subjectId: "subj-s1", classId: "class-s1e", date: "2026-07-07", startTime: "14:00", endTime: "16:00", paper: "Paper 2", venue: "Main Hall", invigilator: "Mr. Okello" },
  { id: "ex-3", subjectId: "subj-s2", classId: "class-s1e", date: "2026-07-08", startTime: "08:30", endTime: "11:30", paper: "Paper 1", venue: "Main Hall", invigilator: "Mrs. Nambi" },
  { id: "ex-4", subjectId: "subj-s2", classId: "class-s1e", date: "2026-07-08", startTime: "14:00", endTime: "16:00", paper: "Paper 2", venue: "Main Hall", invigilator: "Mrs. Nambi" },
  { id: "ex-5", subjectId: "subj-s3", classId: "class-s1e", date: "2026-07-09", startTime: "08:30", endTime: "11:30", paper: "Paper 1", venue: "Lab 1", invigilator: "Mr. Kizza" },
  { id: "ex-6", subjectId: "subj-s3", classId: "class-s1e", date: "2026-07-09", startTime: "14:00", endTime: "16:00", paper: "Paper 2", venue: "Lab 1", invigilator: "Mr. Kizza" },
  { id: "ex-7", subjectId: "subj-s4", classId: "class-s1e", date: "2026-07-10", startTime: "08:30", endTime: "11:30", paper: "Paper 1", venue: "Lab 1", invigilator: "Mrs. Apio" },
  { id: "ex-8", subjectId: "subj-s4", classId: "class-s1e", date: "2026-07-10", startTime: "14:00", endTime: "16:00", paper: "Paper 2", venue: "Lab 1", invigilator: "Mrs. Apio" },
  { id: "ex-9", subjectId: "subj-s5", classId: "class-s1e", date: "2026-07-11", startTime: "08:30", endTime: "11:30", paper: "Paper 1", venue: "Lab 2", invigilator: "Mr. Ssali" },
  { id: "ex-10", subjectId: "subj-s5", classId: "class-s1e", date: "2026-07-11", startTime: "14:00", endTime: "16:00", paper: "Paper 2", venue: "Lab 2", invigilator: "Mr. Ssali" },
  { id: "ex-11", subjectId: "subj-s9", classId: "class-s1e", date: "2026-07-14", startTime: "08:30", endTime: "10:30", paper: "Single Paper", venue: "ICT Lab", invigilator: "Mr. Mugisha" },
  { id: "ex-12", subjectId: "subj-s13", classId: "class-s1e", date: "2026-07-14", startTime: "14:00", endTime: "16:00", paper: "Single Paper", venue: "Room 4", invigilator: "Mrs. Tendo" },
];

// Syllabus Data
export interface SyllabusEntry {
  id: string;
  subjectId: string;
  classId: string;
  term: number;
  topic: string;
  subtopics: string[];
  weeksAllocated: number;
  completed: boolean;
  teacherNotes?: string;
}

export const demoSyllabus: SyllabusEntry[] = [
  { id: "syl-1", subjectId: "subj-s1", classId: "class-s1e", term: 1, topic: "Number Systems", subtopics: ["Natural numbers", "Integers", "Fractions", "Decimals", "Number patterns"], weeksAllocated: 3, completed: true },
  { id: "syl-2", subjectId: "subj-s1", classId: "class-s1e", term: 1, topic: "Algebra", subtopics: ["Expressions", "Equations", "Inequalities", "Substitution"], weeksAllocated: 4, completed: true },
  { id: "syl-3", subjectId: "subj-s1", classId: "class-s1e", term: 1, topic: "Geometry", subtopics: ["Angles", "Triangles", "Quadrilaterals", "Circles", "Constructions"], weeksAllocated: 4, completed: false },
  { id: "syl-4", subjectId: "subj-s1", classId: "class-s1e", term: 1, topic: "Statistics", subtopics: ["Data collection", "Frequency tables", "Bar graphs", "Pie charts", "Mean, Median, Mode"], weeksAllocated: 3, completed: false },
  { id: "syl-5", subjectId: "subj-s2", classId: "class-s1e", term: 1, topic: "Comprehension", subtopics: ["Reading passages", "Inference", "Summary writing", "Vocabulary in context"], weeksAllocated: 4, completed: true },
  { id: "syl-6", subjectId: "subj-s2", classId: "class-s1e", term: 1, topic: "Grammar", subtopics: ["Tenses", "Parts of speech", "Sentence structure", "Punctuation"], weeksAllocated: 3, completed: true },
  { id: "syl-7", subjectId: "subj-s2", classId: "class-s1e", term: 1, topic: "Composition", subtopics: ["Narrative writing", "Descriptive writing", "Letter writing", "Report writing"], weeksAllocated: 4, completed: false },
  { id: "syl-8", subjectId: "subj-s3", classId: "class-s1e", term: 1, topic: "Mechanics", subtopics: ["Forces", "Motion", "Pressure", "Work and Energy"], weeksAllocated: 5, completed: true },
  { id: "syl-9", subjectId: "subj-s3", classId: "class-s1e", term: 1, topic: "Heat", subtopics: ["Temperature", "Heat transfer", "Expansion", "Change of state"], weeksAllocated: 4, completed: false },
];

// Platform Stats (Author's revenue tracking only)
export interface PlatformStats {
  totalSchools: number;
  activeSchools: number;
  suspendedSchools: number;
  totalStudents: number;
  totalTeachers: number;
  subscriptionRevenue: number; // Author's subscription income
  monthlySubscriptionIncome: number;
  expiringSubscriptions: number;
  newSchoolsThisMonth: number;
}

export const demoPlatformStats: PlatformStats = {
  totalSchools: 156,
  activeSchools: 142,
  suspendedSchools: 14,
  totalStudents: 45230,
  totalTeachers: 3456,
  subscriptionRevenue: 45600000,
  monthlySubscriptionIncome: 3200000,
  expiringSubscriptions: 12,
  newSchoolsThisMonth: 8,
};
