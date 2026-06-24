/**
 * Professional Term Report Card Generator
 * Generates printable report cards with school branding, student photo, and detailed marks
 */

export interface ReportCardData {
  schoolName: string;
  schoolMotto: string;
  schoolVision: string;
  schoolLogoUrl?: string;
  studentName: string;
  studentPhotoUrl?: string;
  admissionNumber: string;
  class: string;
  term: string;
  year: number;
  marks: SubjectMark[];
  overallAverage: number;
  position: number;
  totalStudents: number;
  attendance: number;
  teacherComments: string;
  principalComments: string;
  nextTermDate: string;
}

export interface SubjectMark {
  subject: string;
  integrationMark: number;
  examMark: number;
  totalMark: number;
  grade: string;
  remark: string;
}

/**
 * Generate HTML for report card
 */
export function generateReportCardHTML(data: ReportCardData): string {
  const schoolLogoUrl = data.schoolLogoUrl || "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100'%3E%3Ccircle cx='50' cy='50' r='45' fill='%234F46E5'/%3E%3Ctext x='50' y='55' font-size='40' font-weight='bold' fill='white' text-anchor='middle'%3ES%3C/text%3E%3C/svg%3E";
  const studentPhotoUrl = data.studentPhotoUrl || "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100'%3E%3Crect width='100' height='100' fill='%23E5E7EB'/%3E%3Ccircle cx='50' cy='35' r='15' fill='%239CA3AF'/%3E%3Cpath d='M 30 70 Q 50 55 70 70 L 70 100 L 30 100 Z' fill='%239CA3AF'/%3E%3C/svg%3E";

  const totalMarks = data.marks.reduce((sum, m) => sum + m.totalMark, 0);
  const averageMark = Math.round(totalMarks / data.marks.length);

  const marksTableHTML = data.marks
    .map(
      (mark) => `
    <tr>
      <td style="padding: 8px; border-bottom: 1px solid #ddd; text-align: left;">${mark.subject}</td>
      <td style="padding: 8px; border-bottom: 1px solid #ddd; text-align: center;">${mark.integrationMark}</td>
      <td style="padding: 8px; border-bottom: 1px solid #ddd; text-align: center;">${mark.examMark}</td>
      <td style="padding: 8px; border-bottom: 1px solid #ddd; text-align: center; font-weight: bold;">${mark.totalMark}</td>
      <td style="padding: 8px; border-bottom: 1px solid #ddd; text-align: center; font-weight: bold; font-size: 14px; color: #1F2937;">${mark.grade}</td>
      <td style="padding: 8px; border-bottom: 1px solid #ddd; text-align: left;">${mark.remark}</td>
    </tr>
  `
    )
    .join("");

  return `
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Term Report Card - ${data.studentName}</title>
    <style>
        * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
        }
        
        body {
            font-family: 'Arial', sans-serif;
            background-color: #f5f5f5;
            padding: 20px;
        }
        
        .report-card {
            background-color: white;
            width: 210mm;
            height: 297mm;
            margin: 0 auto;
            padding: 30px;
            box-shadow: 0 0 10px rgba(0,0,0,0.1);
            position: relative;
        }
        
        /* Header Section */
        .header {
            display: flex;
            align-items: center;
            justify-content: space-between;
            margin-bottom: 30px;
            padding-bottom: 20px;
            border-bottom: 3px solid #4F46E5;
        }
        
        .logo {
            width: 80px;
            height: 80px;
            border-radius: 50%;
            overflow: hidden;
            flex-shrink: 0;
        }
        
        .logo img {
            width: 100%;
            height: 100%;
            object-fit: cover;
        }
        
        .school-info {
            flex: 1;
            text-align: center;
            margin: 0 20px;
        }
        
        .school-name {
            font-size: 24px;
            font-weight: bold;
            color: #1F2937;
            margin-bottom: 5px;
        }
        
        .school-motto {
            font-size: 12px;
            color: #4F46E5;
            font-weight: bold;
            margin-bottom: 3px;
        }
        
        .school-vision {
            font-size: 11px;
            color: #6B7280;
            font-style: italic;
        }
        
        .student-photo {
            width: 80px;
            height: 100px;
            border-radius: 5px;
            overflow: hidden;
            flex-shrink: 0;
            border: 2px solid #4F46E5;
        }
        
        .student-photo img {
            width: 100%;
            height: 100%;
            object-fit: cover;
        }
        
        /* Student Info Section */
        .student-info {
            display: grid;
            grid-template-columns: 1fr 1fr;
            gap: 15px;
            margin-bottom: 25px;
            padding: 15px;
            background-color: #F3F4F6;
            border-radius: 5px;
        }
        
        .info-item {
            display: flex;
            justify-content: space-between;
        }
        
        .info-label {
            font-weight: bold;
            color: #4F46E5;
            min-width: 100px;
        }
        
        .info-value {
            color: #1F2937;
        }
        
        /* Marks Table */
        .marks-section {
            margin-bottom: 25px;
        }
        
        .section-title {
            font-size: 14px;
            font-weight: bold;
            color: white;
            background-color: #4F46E5;
            padding: 10px 15px;
            margin-bottom: 10px;
            border-radius: 3px;
        }
        
        .marks-table {
            width: 100%;
            border-collapse: collapse;
            margin-bottom: 15px;
            font-size: 12px;
        }
        
        .marks-table thead {
            background-color: #E5E7EB;
        }
        
        .marks-table th {
            padding: 10px;
            text-align: center;
            font-weight: bold;
            color: #1F2937;
            border-bottom: 2px solid #4F46E5;
        }
        
        .marks-table td {
            padding: 8px;
            border-bottom: 1px solid #ddd;
        }
        
        /* Summary Section */
        .summary {
            display: grid;
            grid-template-columns: 1fr 1fr 1fr 1fr;
            gap: 10px;
            margin-bottom: 25px;
        }
        
        .summary-box {
            background-color: #F3F4F6;
            padding: 12px;
            border-radius: 5px;
            border-left: 4px solid #4F46E5;
        }
        
        .summary-label {
            font-size: 11px;
            color: #6B7280;
            font-weight: bold;
            margin-bottom: 5px;
        }
        
        .summary-value {
            font-size: 18px;
            font-weight: bold;
            color: #1F2937;
        }
        
        /* Comments Section */
        .comments-section {
            margin-bottom: 20px;
        }
        
        .comment-box {
            background-color: #FFFBEB;
            padding: 12px;
            border-left: 4px solid #F59E0B;
            margin-bottom: 12px;
            border-radius: 3px;
            font-size: 12px;
            color: #1F2937;
            min-height: 40px;
        }
        
        .comment-label {
            font-weight: bold;
            color: #F59E0B;
            margin-bottom: 5px;
            font-size: 11px;
        }
        
        /* Footer */
        .footer {
            display: flex;
            justify-content: space-between;
            margin-top: 30px;
            padding-top: 20px;
            border-top: 1px solid #ddd;
            font-size: 11px;
        }
        
        .signature-line {
            width: 120px;
            text-align: center;
            border-top: 1px solid #1F2937;
            margin-top: 30px;
        }
        
        .signature-label {
            font-size: 10px;
            color: #6B7280;
            margin-top: 3px;
        }
        
        /* Print Styles */
        @media print {
            body {
                background-color: white;
                padding: 0;
            }
            
            .report-card {
                box-shadow: none;
                width: 100%;
                height: 100%;
                margin: 0;
                padding: 20px;
            }
            
            .print-button {
                display: none;
            }
        }
        
        .print-button {
            position: fixed;
            bottom: 20px;
            right: 20px;
            padding: 12px 24px;
            background-color: #4F46E5;
            color: white;
            border: none;
            border-radius: 5px;
            cursor: pointer;
            font-weight: bold;
            z-index: 1000;
        }
        
        .print-button:hover {
            background-color: #4338CA;
        }
    </style>
</head>
<body>
    <div class="report-card">
        <!-- Header with Logo, School Info, and Student Photo -->
        <div class="header">
            <div class="logo">
                <img src="${schoolLogoUrl}" alt="School Logo">
            </div>
            <div class="school-info">
                <div class="school-name">${data.schoolName}</div>
                <div class="school-motto">${data.schoolMotto}</div>
                <div class="school-vision">${data.schoolVision}</div>
            </div>
            <div class="student-photo">
                <img src="${studentPhotoUrl}" alt="Student Photo">
            </div>
        </div>
        
        <!-- Student Information -->
        <div class="student-info">
            <div class="info-item">
                <span class="info-label">Student Name:</span>
                <span class="info-value">${data.studentName}</span>
            </div>
            <div class="info-item">
                <span class="info-label">Admission No:</span>
                <span class="info-value">${data.admissionNumber}</span>
            </div>
            <div class="info-item">
                <span class="info-label">Class:</span>
                <span class="info-value">${data.class}</span>
            </div>
            <div class="info-item">
                <span class="info-label">Term:</span>
                <span class="info-value">${data.term} ${data.year}</span>
            </div>
        </div>
        
        <!-- Marks Table -->
        <div class="marks-section">
            <div class="section-title">ACADEMIC PERFORMANCE</div>
            <table class="marks-table">
                <thead>
                    <tr>
                        <th>Subject</th>
                        <th>Integration (20%)</th>
                        <th>Exam (80%)</th>
                        <th>Total</th>
                        <th>Grade</th>
                        <th>Remark</th>
                    </tr>
                </thead>
                <tbody>
                    ${marksTableHTML}
                </tbody>
            </table>
        </div>
        
        <!-- Summary Statistics -->
        <div class="summary">
            <div class="summary-box">
                <div class="summary-label">AVERAGE MARK</div>
                <div class="summary-value">${averageMark}</div>
            </div>
            <div class="summary-box">
                <div class="summary-label">POSITION</div>
                <div class="summary-value">${data.position}/${data.totalStudents}</div>
            </div>
            <div class="summary-box">
                <div class="summary-label">ATTENDANCE</div>
                <div class="summary-value">${data.attendance}%</div>
            </div>
            <div class="summary-box">
                <div class="summary-label">OVERALL GRADE</div>
                <div class="summary-value">${getOverallGrade(averageMark)}</div>
            </div>
        </div>
        
        <!-- Comments Section -->
        <div class="comments-section">
            <div class="comment-box">
                <div class="comment-label">TEACHER'S COMMENTS:</div>
                ${data.teacherComments || 'Good performance. Keep up the effort.'}
            </div>
            <div class="comment-box">
                <div class="comment-label">PRINCIPAL'S COMMENTS:</div>
                ${data.principalComments || 'Excellent progress. Continue to work hard.'}
            </div>
        </div>
        
        <!-- Footer -->
        <div class="footer">
            <div>
                <div class="signature-line"></div>
                <div class="signature-label">Class Teacher</div>
            </div>
            <div>
                <div class="signature-line"></div>
                <div class="signature-label">Principal</div>
            </div>
            <div style="text-align: right;">
                <div>Next Term: ${data.nextTermDate}</div>
                <div style="font-size: 10px; color: #9CA3AF; margin-top: 10px;">
                    Generated: ${new Date().toLocaleDateString()}
                </div>
            </div>
        </div>
    </div>
    
    <button class="print-button" onclick="window.print()">🖨️ Print Report Card</button>
</body>
</html>
  `;
}

/**
 * Get overall grade based on average mark
 */
function getOverallGrade(average: number): string {
  if (average >= 80) return "A";
  if (average >= 70) return "B";
  if (average >= 60) return "C";
  if (average >= 50) return "D";
  return "F";
}

/**
 * Download report card as HTML file
 */
export function downloadReportCard(data: ReportCardData): void {
  const html = generateReportCardHTML(data);
  const element = document.createElement("a");
  element.setAttribute(
    "href",
    "data:text/html;charset=utf-8," + encodeURIComponent(html)
  );
  element.setAttribute("download", `report-card-${data.studentName.replace(/\s+/g, "-")}.html`);
  element.style.display = "none";
  document.body.appendChild(element);
  element.click();
  document.body.removeChild(element);
}

/**
 * Open report card in new window for printing
 */
export function printReportCard(data: ReportCardData): void {
  const html = generateReportCardHTML(data);
  const printWindow = window.open("", "", "width=900,height=1200");
  if (printWindow) {
    printWindow.document.write(html);
    printWindow.document.close();
    printWindow.focus();
    setTimeout(() => printWindow.print(), 250);
  }
}
