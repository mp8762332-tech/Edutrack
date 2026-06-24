/**
 * Automatic Report Generation System
 * Generates term reports, fee summaries, and performance analytics
 */

export interface StudentReport {
  studentId: string;
  studentName: string;
  class: string;
  term: string;
  generatedDate: string;
  subjects: SubjectResult[];
  overallAverage: number;
  position: number;
  totalStudentsInClass: number;
  remarks: string;
  attendance: number;
  paymentStatus: PaymentStatus;
}

export interface SubjectResult {
  subject: string;
  integrationMark: number;
  examMark: number;
  finalScore: number;
  grade: string;
  remark: string;
}

export interface PaymentStatus {
  totalFees: number;
  paidAmount: number;
  balance: number;
  paymentPercentage: number;
  status: "Paid" | "Partial" | "Outstanding";
}

export interface TermReport {
  schoolName: string;
  term: string;
  year: number;
  generatedDate: string;
  totalStudents: number;
  classReports: ClassReport[];
}

export interface ClassReport {
  className: string;
  totalStudents: number;
  averagePercentage: number;
  topPerformer: string;
  bottomPerformer: string;
  passRate: number;
  failRate: number;
}

export interface FeeReport {
  schoolName: string;
  generatedDate: string;
  totalExpectedFees: number;
  totalCollected: number;
  totalOutstanding: number;
  collectionRate: number;
  studentPaymentDetails: StudentPaymentDetail[];
}

export interface StudentPaymentDetail {
  studentName: string;
  class: string;
  paymentRef: string;
  totalFees: number;
  paidAmount: number;
  balance: number;
  lastPaymentDate: string;
  status: string;
}

export interface PerformanceAnalytics {
  schoolName: string;
  term: string;
  generatedDate: string;
  totalStudents: number;
  averageScore: number;
  highestScore: number;
  lowestScore: number;
  passPercentage: number;
  failPercentage: number;
  subjectAnalytics: SubjectAnalytic[];
  classAnalytics: ClassAnalytic[];
}

export interface SubjectAnalytic {
  subject: string;
  averageScore: number;
  passRate: number;
  failRate: number;
  topScore: number;
  lowestScore: number;
}

export interface ClassAnalytic {
  className: string;
  averageScore: number;
  passRate: number;
  totalStudents: number;
}

/**
 * Generate individual student term report
 */
export function generateStudentReport(
  student: any,
  marks: any[],
  payments: any[],
  classmates: any[]
): StudentReport {
  const subjects = marks.map((mark) => ({
    subject: mark.subject,
    integrationMark: mark.integrationMark || 0,
    examMark: mark.examMark || 0,
    finalScore: calculateFinalScore(mark.integrationMark, mark.examMark),
    grade: getGrade(calculateFinalScore(mark.integrationMark, mark.examMark)),
    remark: getRemarkForScore(calculateFinalScore(mark.integrationMark, mark.examMark)),
  }));

  const overallAverage =
    subjects.reduce((sum, s) => sum + s.finalScore, 0) / subjects.length;

  // Calculate position
  const classScores = classmates.map((c) => ({
    id: c.id,
    average: c.marks
      ? c.marks.reduce((sum: number, m: any) => sum + calculateFinalScore(m.integrationMark, m.examMark), 0) /
        c.marks.length
      : 0,
  }));

  const position =
    classScores.filter((c) => c.average > overallAverage).length + 1;

  // Calculate payment status
  const totalPaid = payments.reduce((sum, p) => sum + p.amount, 0);
  const totalFees = student.totalFees || 50000;
  const balance = Math.max(0, totalFees - totalPaid);

  return {
    studentId: student.id,
    studentName: student.name,
    class: student.class,
    term: "Term 1 2026",
    generatedDate: new Date().toISOString().split("T")[0],
    subjects,
    overallAverage: Math.round(overallAverage * 100) / 100,
    position,
    totalStudentsInClass: classmates.length,
    remarks: getStudentRemarks(overallAverage, position, classmates.length),
    attendance: 95,
    paymentStatus: {
      totalFees,
      paidAmount: totalPaid,
      balance,
      paymentPercentage: Math.round((totalPaid / totalFees) * 100),
      status: balance === 0 ? "Paid" : balance < totalFees / 2 ? "Partial" : "Outstanding",
    },
  };
}

/**
 * Generate comprehensive term report for entire school
 */
export function generateTermReport(
  schoolName: string,
  students: any[],
  marks: any[],
  term: string = "Term 1"
): TermReport {
  const classSet = new Set(students.map((s) => s.class));
  const classes = Array.from(classSet);

  const classReports = classes.map((className) => {
    const classStudents = students.filter((s) => s.class === className);
    const classMarks = marks.filter((m) =>
      classStudents.some((s) => s.id === m.studentId)
    );

    const scores = classStudents.map((student) => {
      const studentMarks = classMarks.filter((m) => m.studentId === student.id);
      return studentMarks.reduce((sum, m) => sum + calculateFinalScore(m.integrationMark, m.examMark), 0) /
        (studentMarks.length || 1);
    });

    const passCount = scores.filter((s) => s >= 40).length;

    return {
      className,
      totalStudents: classStudents.length,
      averagePercentage: Math.round((scores.reduce((a, b) => a + b, 0) / scores.length) * 100) / 100,
      topPerformer: classStudents[scores.indexOf(Math.max(...scores))]?.name || "N/A",
      bottomPerformer: classStudents[scores.indexOf(Math.min(...scores))]?.name || "N/A",
      passRate: Math.round((passCount / classStudents.length) * 100),
      failRate: Math.round(((classStudents.length - passCount) / classStudents.length) * 100),
    };
  });

  return {
    schoolName,
    term,
    year: new Date().getFullYear(),
    generatedDate: new Date().toISOString().split("T")[0],
    totalStudents: students.length,
    classReports,
  };
}

/**
 * Generate fee collection report
 */
export function generateFeeReport(
  schoolName: string,
  students: any[],
  payments: any[]
): FeeReport {
  const studentPaymentDetails = students.map((student) => {
    const studentPayments = payments.filter((p) => p.studentId === student.id);
    const totalPaid = studentPayments.reduce((sum, p) => sum + p.amount, 0);
    const totalFees = student.totalFees || 50000;
    const balance = Math.max(0, totalFees - totalPaid);
    const lastPayment = studentPayments.sort(
      (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
    )[0];

    return {
      studentName: student.name,
      class: student.class,
      paymentRef: student.paymentRef,
      totalFees,
      paidAmount: totalPaid,
      balance,
      lastPaymentDate: lastPayment?.date || "No payment",
      status: balance === 0 ? "Paid" : balance < totalFees / 2 ? "Partial" : "Outstanding",
    };
  });

  const totalExpected = students.reduce((sum, s) => sum + (s.totalFees || 50000), 0);
  const totalCollected = studentPaymentDetails.reduce((sum, s) => sum + s.paidAmount, 0);
  const totalOutstanding = studentPaymentDetails.reduce((sum, s) => sum + s.balance, 0);

  return {
    schoolName,
    generatedDate: new Date().toISOString().split("T")[0],
    totalExpectedFees: totalExpected,
    totalCollected,
    totalOutstanding,
    collectionRate: Math.round((totalCollected / totalExpected) * 100),
    studentPaymentDetails,
  };
}

/**
 * Generate performance analytics
 */
export function generatePerformanceAnalytics(
  schoolName: string,
  students: any[],
  marks: any[],
  term: string = "Term 1"
): PerformanceAnalytics {
  const subjectSet = new Set(marks.map((m) => m.subject));
  const subjects = Array.from(subjectSet);
  const classSet = new Set(students.map((s) => s.class));
  const classes = Array.from(classSet);

  const allScores = marks.map((m) =>
    calculateFinalScore(m.integrationMark, m.examMark)
  );
  const averageScore = allScores.reduce((a, b) => a + b, 0) / allScores.length;
  const passCount = allScores.filter((s) => s >= 40).length;

  const subjectAnalytics = subjects.map((subject) => {
    const subjectMarks = marks.filter((m) => m.subject === subject);
    const subjectScores = subjectMarks.map((m) =>
      calculateFinalScore(m.integrationMark, m.examMark)
    );
    const subjectPassCount = subjectScores.filter((s) => s >= 40).length;

    return {
      subject,
      averageScore:
        Math.round((subjectScores.reduce((a, b) => a + b, 0) / subjectScores.length) * 100) / 100,
      passRate: Math.round((subjectPassCount / subjectScores.length) * 100),
      failRate: Math.round(((subjectScores.length - subjectPassCount) / subjectScores.length) * 100),
      topScore: Math.max(...subjectScores),
      lowestScore: Math.min(...subjectScores),
    };
  });

  const classAnalytics = classes.map((className) => {
    const classStudents = students.filter((s) => s.class === className);
    const classMarks = marks.filter((m) =>
      classStudents.some((s) => s.id === m.studentId)
    );
    const classScores = classMarks.map((m) =>
      calculateFinalScore(m.integrationMark, m.examMark)
    );
    const classPassCount = classScores.filter((s) => s >= 40).length;

    return {
      className,
      averageScore:
        Math.round((classScores.reduce((a, b) => a + b, 0) / classScores.length) * 100) / 100,
      passRate: Math.round((classPassCount / classScores.length) * 100),
      totalStudents: classStudents.length,
    };
  });

  return {
    schoolName,
    term,
    generatedDate: new Date().toISOString().split("T")[0],
    totalStudents: students.length,
    averageScore: Math.round(averageScore * 100) / 100,
    highestScore: Math.max(...allScores),
    lowestScore: Math.min(...allScores),
    passPercentage: Math.round((passCount / allScores.length) * 100),
    failPercentage: Math.round(((allScores.length - passCount) / allScores.length) * 100),
    subjectAnalytics,
    classAnalytics,
  };
}

/**
 * Helper function to calculate final score
 */
function calculateFinalScore(integration: number, exam: number): number {
  if (!integration || !exam) return 0;
  return (integration * 0.2 + exam * 0.8) * 10; // Scale to 0-100
}

/**
 * Helper function to get grade
 */
function getGrade(score: number): string {
  if (score >= 80) return "A";
  if (score >= 70) return "B";
  if (score >= 60) return "C";
  if (score >= 50) return "D";
  return "F";
}

/**
 * Helper function to get remark for score
 */
function getRemarkForScore(score: number): string {
  if (score >= 80) return "Excellent";
  if (score >= 70) return "Very Good";
  if (score >= 60) return "Good";
  if (score >= 50) return "Satisfactory";
  if (score >= 40) return "Pass";
  return "Needs Improvement";
}

/**
 * Helper function to get student remarks
 */
function getStudentRemarks(
  average: number,
  position: number,
  totalStudents: number
): string {
  const percentile = Math.round((position / totalStudents) * 100);

  if (average >= 80) {
    return `Excellent performance! Ranked ${position} out of ${totalStudents}. Keep up the outstanding work.`;
  }
  if (average >= 70) {
    return `Very good performance. Ranked ${position} out of ${totalStudents}. Continue to maintain this standard.`;
  }
  if (average >= 60) {
    return `Good performance. Ranked ${position} out of ${totalStudents}. Aim for higher marks next term.`;
  }
  if (average >= 50) {
    return `Satisfactory performance. Ranked ${position} out of ${totalStudents}. Increase effort in weak areas.`;
  }
  return `Needs improvement. Ranked ${position} out of ${totalStudents}. Seek additional support in weak subjects.`;
}

/**
 * Export report to PDF (placeholder - would use a PDF library in production)
 */
export function exportReportToPDF(report: StudentReport | TermReport | FeeReport): void {
  const reportData = JSON.stringify(report, null, 2);
  const element = document.createElement("a");
  element.setAttribute(
    "href",
    "data:text/plain;charset=utf-8," + encodeURIComponent(reportData)
  );
  element.setAttribute("download", `report-${Date.now()}.txt`);
  element.style.display = "none";
  document.body.appendChild(element);
  element.click();
  document.body.removeChild(element);
}

/**
 * Export report to CSV
 */
export function exportReportToCSV(data: any[], filename: string): void {
  const headers = Object.keys(data[0] || {});
  const csv = [
    headers.join(","),
    ...data.map((row) =>
      headers
        .map((header) => {
          const value = row[header];
          return typeof value === "string" && value.includes(",")
            ? `"${value}"`
            : value;
        })
        .join(",")
    ),
  ].join("\n");

  const element = document.createElement("a");
  element.setAttribute("href", "data:text/csv;charset=utf-8," + encodeURIComponent(csv));
  element.setAttribute("download", `${filename}-${Date.now()}.csv`);
  element.style.display = "none";
  document.body.appendChild(element);
  element.click();
  document.body.removeChild(element);
}
