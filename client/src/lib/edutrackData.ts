// EduTrack Demo Data with Dual Curriculum Grading System

export interface Student {
  id: string;
  name: string;
  class: string;
  gender: "Male" | "Female";
  paymentRef: string;
  enrollmentDate: string;
  parentName: string;
  parentPhone: string;
  totalFees: number;
  paidAmount: number;
  photo?: string;
}

export interface Mark {
  id: string;
  studentId: string;
  subject: string;
  integrationMarks: number[]; // Array of marks throughout term
  examMark: number;
  level: string;
  session: string;
}

export interface Teacher {
  id: string;
  name: string;
  phone: string;
  subjects: string[];
  classes: string[];
  username: string;
  password: string;
  status: "active" | "deleted";
}

export interface School {
  id: string;
  name: string;
  type: "primary" | "secondary";
  adminUsername: string;
  adminPassword: string;
  currentTerm: string;
  paymentAccount: string;
  subscriptionExpiry: string;
  themeColor: string;
  lanEnabled: boolean;
  lanIpPrefix: string;
  logo?: string;
}

export interface Syllabus {
  id: string;
  subject: string;
  class: string;
  topics: string[];
  assessmentWeights: {
    integration: number;
    exam: number;
  };
}

// GRADING SYSTEMS

export const SECONDARY_GRADING = {
  scale: "1.0 to 3.0",
  integrationWeight: 0.2,
  examWeight: 0.8,
  remarks: [
    { min: 2.7, max: 3.0, grade: "Distinction" },
    { min: 2.3, max: 2.6, grade: "Merit" },
    { min: 1.7, max: 2.2, grade: "Credit" },
    { min: 1.3, max: 1.6, grade: "Pass" },
    { min: 1.0, max: 1.2, grade: "Developing" },
  ],
};

export const PRIMARY_GRADING = {
  scale: "0 to 100",
  grades: [
    { min: 80, max: 100, grade: "D1", remark: "Distinction", points: 1 },
    { min: 75, max: 79, grade: "D2", remark: "Distinction", points: 2 },
    { min: 70, max: 74, grade: "C3", remark: "Credit", points: 3 },
    { min: 65, max: 69, grade: "C4", remark: "Credit", points: 4 },
    { min: 60, max: 64, grade: "C5", remark: "Credit", points: 5 },
    { min: 55, max: 59, grade: "C6", remark: "Credit", points: 6 },
    { min: 50, max: 54, grade: "P7", remark: "Pass", points: 7 },
    { min: 45, max: 49, grade: "P8", remark: "Pass", points: 8 },
    { min: 0, max: 44, grade: "F9", remark: "Fail", points: 9 },
  ],
  divisions: [
    { min: 8, max: 12, division: "I" },
    { min: 13, max: 23, division: "II" },
    { min: 24, max: 29, division: "III" },
    { min: 30, max: 32, division: "IV" },
    { min: 33, max: 999, division: "U" },
  ],
};

// AUTO-GRADING FUNCTIONS

export function calculateSecondaryFinalScore(integrationMarks: number[], examMark: number): number {
  if (integrationMarks.length === 0 || examMark === 0) return 0;
  const integrationAvg = integrationMarks.reduce((a, b) => a + b, 0) / integrationMarks.length;
  const finalScore = integrationAvg * SECONDARY_GRADING.integrationWeight + examMark * SECONDARY_GRADING.examWeight;
  return Math.min(Math.max(finalScore, 1.0), 3.0); // Clamp between 1.0 and 3.0
}

export function getSecondaryRemark(score: number): string {
  const remark = SECONDARY_GRADING.remarks.find((r) => score >= r.min && score <= r.max);
  return remark?.grade || "Developing";
}

export function getPrimaryGrade(mark: number): { grade: string; remark: string; points: number } {
  const gradeInfo = PRIMARY_GRADING.grades.find((g) => mark >= g.min && mark <= g.max);
  return gradeInfo || { grade: "F9", remark: "Fail", points: 9 };
}

export function getPrimaryDivision(totalPoints: number): string {
  const division = PRIMARY_GRADING.divisions.find((d) => totalPoints >= d.min && totalPoints <= d.max);
  return division?.division || "U";
}

// DEMO DATA

export const demoSchools: School[] = [
  {
    id: "sch-001",
    name: "Nairobi International School",
    type: "secondary",
    adminUsername: "admin@nairobi-intl.edu",
    adminPassword: "admin123",
    currentTerm: "Term 1 2026",
    paymentAccount: "0700123456",
    subscriptionExpiry: "2026-12-31",
    themeColor: "#132F52",
    lanEnabled: false,
    lanIpPrefix: "192.168.1.",
    logo: "🏫",
  },
  {
    id: "sch-002",
    name: "Kampala Primary Academy",
    type: "primary",
    adminUsername: "admin@kampala-primary.edu",
    adminPassword: "admin123",
    currentTerm: "Term 1 2026",
    paymentAccount: "0701234567",
    subscriptionExpiry: "2026-11-30",
    themeColor: "#1A6E47",
    lanEnabled: true,
    lanIpPrefix: "192.168.2.",
    logo: "🎓",
  },
];

export const demoTeachers: Teacher[] = [
  {
    id: "tea-001",
    name: "Peter Kipchoge",
    phone: "+256700123456",
    subjects: ["Mathematics", "Physics"],
    classes: ["S3 East", "S4 Sciences"],
    username: "peter.kipchoge@school.edu",
    password: "teacher123",
    status: "active",
  },
  {
    id: "tea-002",
    name: "Grace Mwangi",
    phone: "+256701234567",
    subjects: ["English", "Literature"],
    classes: ["S1", "S2", "S3 West"],
    username: "grace.mwangi@school.edu",
    password: "teacher123",
    status: "active",
  },
  {
    id: "tea-003",
    name: "James Ochieng",
    phone: "+256702345678",
    subjects: ["Chemistry", "Biology"],
    classes: ["S4 Sciences", "S5 Sciences"],
    username: "james.ochieng@school.edu",
    password: "teacher123",
    status: "active",
  },
];

export const demoStudents: Student[] = [
  {
    id: "std-001",
    name: "Alice Kariuki",
    class: "S3 East",
    gender: "Female",
    paymentRef: "SCH-0001001",
    enrollmentDate: "2024-01-15",
    parentName: "John Kariuki",
    parentPhone: "+256700000001",
    totalFees: 150000,
    paidAmount: 100000,
    photo: "👩",
  },
  {
    id: "std-002",
    name: "David Kipchoge",
    class: "S3 East",
    gender: "Male",
    paymentRef: "SCH-0001002",
    enrollmentDate: "2024-01-15",
    parentName: "Daniel Kipchoge",
    parentPhone: "+256700000002",
    totalFees: 150000,
    paidAmount: 150000,
    photo: "👨",
  },
  {
    id: "std-003",
    name: "Sarah Omondi",
    class: "S4 Sciences",
    gender: "Female",
    paymentRef: "SCH-0001003",
    enrollmentDate: "2023-01-10",
    parentName: "Samuel Omondi",
    parentPhone: "+256700000003",
    totalFees: 180000,
    paidAmount: 90000,
    photo: "👩",
  },
  {
    id: "std-004",
    name: "Michael Ouma",
    class: "S4 Sciences",
    gender: "Male",
    paymentRef: "SCH-0001004",
    enrollmentDate: "2023-01-10",
    parentName: "Joseph Ouma",
    parentPhone: "+256700000004",
    totalFees: 180000,
    paidAmount: 180000,
    photo: "👨",
  },
];

export const demoMarks: Mark[] = [
  {
    id: "mark-001",
    studentId: "std-001",
    subject: "Mathematics",
    integrationMarks: [2.5, 2.6, 2.4],
    examMark: 2.8,
    level: "S3",
    session: "End of Term 1 2026",
  },
  {
    id: "mark-002",
    studentId: "std-001",
    subject: "Physics",
    integrationMarks: [2.3, 2.4, 2.5],
    examMark: 2.6,
    level: "S3",
    session: "End of Term 1 2026",
  },
  {
    id: "mark-003",
    studentId: "std-002",
    subject: "Mathematics",
    integrationMarks: [2.8, 2.9, 2.7],
    examMark: 3.0,
    level: "S3",
    session: "End of Term 1 2026",
  },
];

export const demoSyllabi: Syllabus[] = [
  {
    id: "syl-001",
    subject: "Mathematics",
    class: "S3 East",
    topics: [
      "Algebra - Quadratic Equations",
      "Geometry - Circles and Tangents",
      "Trigonometry - Sine and Cosine Rules",
      "Statistics - Probability",
    ],
    assessmentWeights: {
      integration: 20,
      exam: 80,
    },
  },
  {
    id: "syl-002",
    subject: "Physics",
    class: "S3 East",
    topics: [
      "Mechanics - Forces and Motion",
      "Energy - Work and Power",
      "Waves - Sound and Light",
      "Electricity - Current and Circuits",
    ],
    assessmentWeights: {
      integration: 20,
      exam: 80,
    },
  },
  {
    id: "syl-003",
    subject: "English",
    class: "S3 East",
    topics: [
      "Literature - Poetry Analysis",
      "Grammar - Sentence Structure",
      "Writing - Essay Composition",
      "Reading - Comprehension",
    ],
    assessmentWeights: {
      integration: 20,
      exam: 80,
    },
  },
];

export const demoSubscriptionTiers = [
  {
    name: "Basic",
    price: 50000,
    currency: "KES",
    period: "month",
    features: [
      "Up to 500 students",
      "Basic reporting",
      "Email support",
      "Single school",
    ],
  },
  {
    name: "Professional",
    price: 100000,
    currency: "KES",
    period: "month",
    features: [
      "Up to 2000 students",
      "Advanced reporting",
      "Priority support",
      "LAN security",
      "Custom theme",
    ],
  },
  {
    name: "Enterprise",
    price: 200000,
    currency: "KES",
    period: "month",
    features: [
      "Unlimited students",
      "Full analytics",
      "Dedicated support",
      "Multi-school support",
      "API access",
      "Custom branding",
    ],
  },
];

export function generatePaymentRef(): string {
  const random = Math.random().toString(36).substring(2, 8).toUpperCase();
  return `SCH-${random}`;
}

export function generateStudentNumber(): string {
  const year = new Date().getFullYear();
  const random = Math.floor(Math.random() * 10000)
    .toString()
    .padStart(4, "0");
  return `${year}${random}`;
}
