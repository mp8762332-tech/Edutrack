/**
 * Mid-Term Exam System
 * Handles marks entry, calculation, grading, and report card generation
 * Uses centralized grading scale from shared/gradingScale.ts
 */

import { calculateGrade as getGradeFromScore, calculatePaperAverage as calcPaperAvg, calculateAverageScore as calcAvgScore } from "@shared/gradingScale";

export interface MidTermMark {
  id: number;
  studentId: number;
  subjectId: number;
  paper1Mark: number; // 0-100
  paper2Mark?: number; // 0-100 (optional)
  averageScore: number; // (paper1 + paper2) / 2
  grade: "A" | "B" | "C" | "D" | "E";
  remark: string;
  teacherComment?: string;
  recordedAt: Date;
}

export interface StudentMidTermResult {
  studentId: number;
  studentName: string;
  admissionNumber: string;
  classId: number;
  className: string;
  totalSubjects: number;
  marks: MidTermMark[];
  averageScore: number;
  position: number;
}

// Use centralized grading scale from shared/gradingScale.ts

/**
 * Calculate grade and remark from average score
 */
export function calculateGrade(averageScore: number): { grade: "A" | "B" | "C" | "D" | "E"; remark: string } {
  const grade = getGradeFromScore(averageScore);
  const remarks: Record<string, string> = {
    A: "Exceptional",
    B: "Outstanding",
    C: "Satisfactory",
    D: "Basic",
    E: "Elementary",
  };
  return { grade, remark: remarks[grade] };
}

/**
 * Calculate average score from paper marks
 * If only paper1 exists, use paper1 as average
 * If both papers exist, average = (paper1 + paper2) / 2
 */
export function calculateAverageScore(paper1: number, paper2?: number): number {
  return calcPaperAvg(paper1, paper2);
}

/**
 * Create a mid-term mark record
 */
export function createMidTermMark(
  studentId: number,
  subjectId: number,
  paper1Mark: number,
  paper2Mark?: number,
  teacherComment?: string
): MidTermMark {
  const averageScore = calculateAverageScore(paper1Mark, paper2Mark);
  const { grade, remark } = calculateGrade(averageScore);

  return {
    id: Math.random(),
    studentId,
    subjectId,
    paper1Mark,
    paper2Mark,
    averageScore,
    grade,
    remark,
    teacherComment,
    recordedAt: new Date(),
  };
}

/**
 * Calculate student's overall mid-term result
 */
export function calculateStudentMidTermResult(
  studentId: number,
  studentName: string,
  admissionNumber: string,
  classId: number,
  className: string,
  marks: MidTermMark[]
): StudentMidTermResult {
  const scores = marks.map((m) => m.averageScore);
  const averageScore = calcAvgScore(scores);

  return {
    studentId,
    studentName,
    admissionNumber,
    classId,
    className,
    totalSubjects: marks.length,
    marks,
    averageScore,
    position: 0, // Will be calculated after all students
  };
}

/**
 * Calculate class positions based on average scores
 */
export function calculateClassPositions(results: StudentMidTermResult[]): StudentMidTermResult[] {
  const sorted = [...results].sort((a, b) => b.averageScore - a.averageScore);
  return sorted.map((result, index) => ({
    ...result,
    position: index + 1,
  }));
}

/**
 * Generate HTML for Mid-Term Report Card (A4 optimized)
 */
export function generateMidTermReportCardHTML(
  result: StudentMidTermResult,
  schoolName: string,
  schoolLogo: string,
  studentPhoto: string,
  schoolMotto: string,
  schoolVision: string,
  term: number,
  year: number
): string {
  const marksRows = result.marks
    .map(
      (mark) => `
    <tr>
      <td style="padding: 8px; border: 1px solid #333; text-align: left;">${mark.subjectId}</td>
      <td style="padding: 8px; border: 1px solid #333; text-align: center;">${mark.paper1Mark}</td>
      <td style="padding: 8px; border: 1px solid #333; text-align: center;">${mark.paper2Mark ?? "N/A"}</td>
      <td style="padding: 8px; border: 1px solid #333; text-align: center; font-weight: bold;">${mark.averageScore}</td>
      <td style="padding: 8px; border: 1px solid #333; text-align: center; font-weight: bold;">${mark.grade}</td>
      <td style="padding: 8px; border: 1px solid #333; text-align: left;">${mark.remark}</td>
    </tr>
  `
    )
    .join("");

  const html = `
<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <title>Mid-Term Report Card</title>
  <style>
    @media print {
      body { margin: 0; padding: 0; }
      .page-break { page-break-after: always; }
      * { box-sizing: border-box; }
    }
    
    body {
      font-family: Arial, sans-serif;
      margin: 0;
      padding: 20px;
      background: white;
    }
    
    .report-card {
      width: 210mm;
      height: 297mm;
      margin: 0 auto;
      padding: 20px;
      background: white;
      border: 1px solid #ddd;
      box-shadow: 0 0 10px rgba(0,0,0,0.1);
    }
    
    .header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 20px;
      border-bottom: 2px solid #333;
      padding-bottom: 15px;
    }
    
    .logo {
      width: 80px;
      height: 80px;
      border-radius: 50%;
      background: #f0f0f0;
      display: flex;
      align-items: center;
      justify-content: center;
      font-weight: bold;
      font-size: 12px;
    }
    
    .school-info {
      text-align: center;
      flex: 1;
      margin: 0 20px;
    }
    
    .school-info h1 {
      margin: 0;
      font-size: 20px;
      font-weight: bold;
    }
    
    .school-info p {
      margin: 3px 0;
      font-size: 11px;
      color: #666;
    }
    
    .student-photo {
      width: 80px;
      height: 80px;
      border-radius: 50%;
      background: #f0f0f0;
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 10px;
      color: #999;
    }
    
    .student-info {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 10px;
      margin-bottom: 15px;
      font-size: 12px;
    }
    
    .info-field {
      display: flex;
      justify-content: space-between;
    }
    
    .info-label {
      font-weight: bold;
      width: 40%;
    }
    
    .info-value {
      width: 60%;
      border-bottom: 1px solid #333;
    }
    
    .marks-table {
      width: 100%;
      border-collapse: collapse;
      margin-bottom: 15px;
      font-size: 11px;
    }
    
    .marks-table th {
      background: #333;
      color: white;
      padding: 8px;
      text-align: center;
      font-weight: bold;
      border: 1px solid #333;
    }
    
    .marks-table td {
      padding: 8px;
      border: 1px solid #333;
      text-align: center;
    }
    
    .summary {
      display: grid;
      grid-template-columns: 1fr 1fr 1fr 1fr;
      gap: 10px;
      margin-bottom: 15px;
      font-size: 11px;
    }
    
    .summary-box {
      border: 1px solid #333;
      padding: 10px;
      text-align: center;
    }
    
    .summary-label {
      font-weight: bold;
      font-size: 10px;
      color: #666;
    }
    
    .summary-value {
      font-size: 16px;
      font-weight: bold;
      color: #333;
    }
    
    .comments {
      margin-bottom: 15px;
      font-size: 11px;
    }
    
    .comments-label {
      font-weight: bold;
      margin-bottom: 5px;
    }
    
    .comments-box {
      border: 1px solid #333;
      padding: 10px;
      min-height: 40px;
      background: #fafafa;
    }
    
    .signatures {
      display: flex;
      justify-content: space-between;
      margin-top: 20px;
      font-size: 11px;
    }
    
    .signature-line {
      width: 30%;
      text-align: center;
    }
    
    .signature-space {
      border-top: 1px solid #333;
      height: 40px;
      margin-bottom: 5px;
    }
    
    .footer {
      text-align: center;
      font-size: 10px;
      color: #999;
      margin-top: 10px;
      border-top: 1px solid #ddd;
      padding-top: 10px;
    }
  </style>
</head>
<body>
  <div class="report-card">
    <!-- Header -->
    <div class="header">
      <div class="logo">LOGO</div>
      <div class="school-info">
        <h1>${schoolName}</h1>
        <p><strong>Motto:</strong> ${schoolMotto}</p>
        <p><strong>Vision:</strong> ${schoolVision}</p>
        <p>MID-TERM REPORT CARD - TERM ${term}, ${year}</p>
      </div>
      <div class="student-photo">PHOTO</div>
    </div>
    
    <!-- Student Information -->
    <div class="student-info">
      <div class="info-field">
        <span class="info-label">Name:</span>
        <span class="info-value">${result.studentName}</span>
      </div>
      <div class="info-field">
        <span class="info-label">Admission No:</span>
        <span class="info-value">${result.admissionNumber}</span>
      </div>
      <div class="info-field">
        <span class="info-label">Class:</span>
        <span class="info-value">${result.className}</span>
      </div>
      <div class="info-field">
        <span class="info-label">Position:</span>
        <span class="info-value">${result.position}</span>
      </div>
    </div>
    
    <!-- Marks Table -->
    <table class="marks-table">
      <thead>
        <tr>
          <th>Subject</th>
          <th>Paper 1</th>
          <th>Paper 2</th>
          <th>Average Score</th>
          <th>Grade</th>
          <th>Remark</th>
        </tr>
      </thead>
      <tbody>
        ${marksRows}
      </tbody>
    </table>
    
    <!-- Summary -->
    <div class="summary">
      <div class="summary-box">
        <div class="summary-label">Subjects</div>
        <div class="summary-value">${result.totalSubjects}</div>
      </div>
      <div class="summary-box">
        <div class="summary-label">Average Score</div>
        <div class="summary-value">${result.averageScore}</div>
      </div>
      <div class="summary-box">
        <div class="summary-label">Position</div>
        <div class="summary-value">${result.position}</div>
      </div>
      <div class="summary-box">
        <div class="summary-label">Term</div>
        <div class="summary-value">${term}/${year}</div>
      </div>
    </div>
    
    <!-- Teacher Comments -->
    <div class="comments">
      <div class="comments-label">Teacher Comments:</div>
      <div class="comments-box">
        &nbsp;
      </div>
    </div>
    
    <!-- Signatures -->
    <div class="signatures">
      <div class="signature-line">
        <div class="signature-space"></div>
        <div>Class Teacher</div>
      </div>
      <div class="signature-line">
        <div class="signature-space"></div>
        <div>Head Teacher</div>
      </div>
      <div class="signature-line">
        <div class="signature-space"></div>
        <div>Principal</div>
      </div>
    </div>
    
    <div class="footer">
      Generated on ${new Date().toLocaleDateString()} | This is an official school document
    </div>
  </div>
</body>
</html>
  `;

  return html;
}

/**
 * Export marks to CSV format
 */
export function exportMarksToCSV(results: StudentMidTermResult[], className: string): string {
  const headers = ["Student Name", "Admission No", "Subject", "Paper 1", "Paper 2", "Average Score", "Grade", "Remark"];
  const rows: string[] = [];

  results.forEach((result) => {
    result.marks.forEach((mark) => {
      rows.push([
        result.studentName,
        result.admissionNumber,
        mark.subjectId.toString(),
        mark.paper1Mark.toString(),
        mark.paper2Mark?.toString() ?? "N/A",
        mark.averageScore.toString(),
        mark.grade,
        mark.remark,
      ].join(","));
    });
  });

  return [headers.join(","), ...rows].join("\n");
}

// Re-export grading scale for convenience
export type { Grade } from "@shared/gradingScale";
