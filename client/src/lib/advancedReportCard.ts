// Advanced Report Card Generator with Class-Based Generation and Teacher Comments

export interface ReportCardData {
  studentId: string;
  studentName: string;
  studentGender: string;
  studentPhoto?: string;
  classLevel: string;
  classStream: string;
  admissionNumber: string;
  term: number;
  year: number;
  schoolName: string;
  schoolLogo?: string;
  schoolMotto: string;
  schoolVision: string;
  subjects: SubjectResult[];
  overallAverage: number;
  classPosition: number;
  totalInClass: number;
  attendancePercentage: number;
  teacherComments: string;
  principalComments: string;
  healthStatus: string;
  dateGenerated: string;
}

export interface SubjectResult {
  subjectName: string;
  paper1Mark?: number;
  paper2Mark?: number;
  averageScore: number;
  grade: string;
  remarks: string;
  teacherName: string;
}

// Generate report card HTML for printing/downloading
export function generateReportCardHTML(data: ReportCardData): string {
  const headerHTML = `
    <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 20px; border-bottom: 2px solid #333; padding-bottom: 15px;">
      <div style="text-align: center; flex: 1;">
        ${data.schoolLogo ? `<img src="${data.schoolLogo}" style="height: 60px; margin-bottom: 10px;" />` : ''}
      </div>
      <div style="text-align: center; flex: 2;">
        <h1 style="margin: 0; font-size: 24px; font-weight: bold;">${data.schoolName}</h1>
        <p style="margin: 5px 0; font-size: 14px; font-style: italic;">"${data.schoolMotto}"</p>
        <p style="margin: 5px 0; font-size: 12px; color: #666;">Vision: ${data.schoolVision}</p>
      </div>
      <div style="text-align: center; flex: 1;">
        ${data.studentPhoto ? `<img src="${data.studentPhoto}" style="height: 80px; width: 80px; border-radius: 8px; object-fit: cover; border: 2px solid #333;" />` : '<div style="height: 80px; width: 80px; background: #eee; border-radius: 8px; display: flex; align-items: center; justify-content: center;">No Photo</div>'}
      </div>
    </div>
  `;

  const studentInfoHTML = `
    <div style="margin-bottom: 20px; background: #f9f9f9; padding: 15px; border-radius: 8px;">
      <div style="display: grid; grid-template-columns: 1fr 1fr 1fr 1fr; gap: 15px; font-size: 13px;">
        <div><strong>Student Name:</strong> ${data.studentName}</div>
        <div><strong>Gender:</strong> ${data.studentGender}</div>
        <div><strong>Class:</strong> ${data.classLevel} ${data.classStream}</div>
        <div><strong>Admission No:</strong> ${data.admissionNumber}</div>
        <div><strong>Term:</strong> ${data.term}</div>
        <div><strong>Year:</strong> ${data.year}</div>
        <div><strong>Health Status:</strong> ${data.healthStatus}</div>
        <div><strong>Attendance:</strong> ${data.attendancePercentage}%</div>
      </div>
    </div>
  `;

  const marksTableHTML = `
    <table style="width: 100%; border-collapse: collapse; margin-bottom: 20px; font-size: 12px;">
      <thead>
        <tr style="background: #333; color: white;">
          <th style="border: 1px solid #ddd; padding: 8px; text-align: left;">Subject</th>
          <th style="border: 1px solid #ddd; padding: 8px; text-align: center;">Paper 1</th>
          <th style="border: 1px solid #ddd; padding: 8px; text-align: center;">Paper 2</th>
          <th style="border: 1px solid #ddd; padding: 8px; text-align: center;">Average Score</th>
          <th style="border: 1px solid #ddd; padding: 8px; text-align: center;">Grade</th>
          <th style="border: 1px solid #ddd; padding: 8px; text-align: center;">Remarks</th>
          <th style="border: 1px solid #ddd; padding: 8px; text-align: left;">Teacher</th>
        </tr>
      </thead>
      <tbody>
        ${data.subjects.map((subject, idx) => `
          <tr style="background: ${idx % 2 === 0 ? '#fff' : '#f9f9f9'};">
            <td style="border: 1px solid #ddd; padding: 8px;">${subject.subjectName}</td>
            <td style="border: 1px solid #ddd; padding: 8px; text-align: center;">${subject.paper1Mark || '-'}</td>
            <td style="border: 1px solid #ddd; padding: 8px; text-align: center;">${subject.paper2Mark || '-'}</td>
            <td style="border: 1px solid #ddd; padding: 8px; text-align: center; font-weight: bold;">${subject.averageScore}</td>
            <td style="border: 1px solid #ddd; padding: 8px; text-align: center; font-weight: bold; background: ${getGradeColor(subject.grade)};">${subject.grade}</td>
            <td style="border: 1px solid #ddd; padding: 8px; text-align: center;">${subject.remarks}</td>
            <td style="border: 1px solid #ddd; padding: 8px;">${subject.teacherName}</td>
          </tr>
        `).join('')}
      </tbody>
    </table>
  `;

  const summaryHTML = `
    <div style="display: grid; grid-template-columns: 1fr 1fr 1fr; gap: 15px; margin-bottom: 20px; font-size: 13px;">
      <div style="background: #e3f2fd; padding: 12px; border-radius: 8px; border-left: 4px solid #2196F3;">
        <strong>Overall Average Score:</strong><br/>
        <span style="font-size: 20px; font-weight: bold; color: #2196F3;">${data.overallAverage.toFixed(1)}</span>
      </div>
      <div style="background: #f3e5f5; padding: 12px; border-radius: 8px; border-left: 4px solid #9C27B0;">
        <strong>Class Position:</strong><br/>
        <span style="font-size: 20px; font-weight: bold; color: #9C27B0;">${data.classPosition}/${data.totalInClass}</span>
      </div>
      <div style="background: #e8f5e9; padding: 12px; border-radius: 8px; border-left: 4px solid #4CAF50;">
        <strong>Date Generated:</strong><br/>
        <span style="font-size: 14px;">${data.dateGenerated}</span>
      </div>
    </div>
  `;

  const commentsHTML = `
    <div style="margin-bottom: 20px;">
      <div style="margin-bottom: 15px;">
        <strong style="font-size: 14px; display: block; margin-bottom: 8px;">Teacher's Comments:</strong>
        <div style="background: #fff9e6; padding: 12px; border-radius: 8px; border-left: 4px solid #FFC107; min-height: 60px; font-size: 13px;">
          ${data.teacherComments || 'No comments provided'}
        </div>
      </div>
      <div>
        <strong style="font-size: 14px; display: block; margin-bottom: 8px;">Principal's Comments:</strong>
        <div style="background: #f0f0f0; padding: 12px; border-radius: 8px; border-left: 4px solid #666; min-height: 60px; font-size: 13px;">
          ${data.principalComments || 'No comments provided'}
        </div>
      </div>
    </div>
  `;

  const footerHTML = `
    <div style="margin-top: 30px; border-top: 2px solid #333; padding-top: 15px; display: flex; justify-content: space-between; font-size: 12px;">
      <div style="text-align: center;">
        <p style="margin: 0 0 30px 0;">_____________________</p>
        <p style="margin: 0;">Class Teacher</p>
      </div>
      <div style="text-align: center;">
        <p style="margin: 0 0 30px 0;">_____________________</p>
        <p style="margin: 0;">Principal</p>
      </div>
      <div style="text-align: center;">
        <p style="margin: 0 0 30px 0;">_____________________</p>
        <p style="margin: 0;">Date</p>
      </div>
    </div>
  `;

  return `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="UTF-8">
      <title>Report Card - ${data.studentName}</title>
      <style>
        body { font-family: Arial, sans-serif; margin: 20px; background: white; }
        @media print { body { margin: 0; } }
        .page-break { page-break-after: always; }
      </style>
    </head>
    <body>
      <div style="max-width: 900px; margin: 0 auto; background: white; padding: 20px;">
        ${headerHTML}
        ${studentInfoHTML}
        ${marksTableHTML}
        ${summaryHTML}
        ${commentsHTML}
        ${footerHTML}
      </div>
    </body>
    </html>
  `;
}

// Helper function to get grade color
function getGradeColor(grade: string): string {
  const colors: { [key: string]: string } = {
    'A': '#c8e6c9',
    'B': '#fff9c4',
    'C': '#ffe0b2',
    'D': '#ffccbc',
    'E': '#ffcdd2',
  };
  return colors[grade] || '#f5f5f5';
}

// Generate report cards for entire class
export function generateClassReportCards(
  classLevel: string,
  classStream: string,
  students: any[],
  marks: any[],
  schoolData: any
): ReportCardData[] {
  return students
    .filter(s => s.classLevel === classLevel && s.classStream === classStream)
    .map((student, idx) => {
      const studentMarks = marks.filter(m => m.studentId === student.id);
      const averages = studentMarks.map(m => m.averageScore);
      const overallAverage = averages.length > 0 ? averages.reduce((a, b) => a + b, 0) / averages.length : 0;
      const classAverages = students
        .filter(s => s.classLevel === classLevel && s.classStream === classStream)
        .map(s => {
          const sMarks = marks.filter(m => m.studentId === s.id);
          return sMarks.length > 0 ? sMarks.reduce((a, b) => a + b.averageScore, 0) / sMarks.length : 0;
        });
      const position = classAverages.filter(a => a > overallAverage).length + 1;

      return {
        studentId: student.id,
        studentName: `${student.firstName} ${student.lastName}`,
        studentGender: student.gender,
        studentPhoto: student.photoUrl,
        classLevel,
        classStream,
        admissionNumber: student.admissionNumber,
        term: 1,
        year: 2026,
        schoolName: schoolData.name,
        schoolLogo: schoolData.logoUrl,
        schoolMotto: schoolData.motto,
        schoolVision: schoolData.vision,
        subjects: studentMarks.map(m => ({
          subjectName: m.subjectName,
          paper1Mark: m.paper1Mark,
          paper2Mark: m.paper2Mark,
          averageScore: m.averageScore,
          grade: m.grade,
          remarks: m.remarks,
          teacherName: m.teacherName,
        })),
        overallAverage,
        classPosition: position,
        totalInClass: students.filter(s => s.classLevel === classLevel && s.classStream === classStream).length,
        attendancePercentage: 92,
        teacherComments: '',
        principalComments: '',
        healthStatus: 'Good',
        dateGenerated: new Date().toLocaleDateString(),
      };
    });
}

// Export report cards as CSV
export function exportReportCardsAsCSV(reportCards: ReportCardData[]): string {
  let csv = 'Student Name,Class,Position,Overall Average,Subjects Count,Date Generated\n';
  reportCards.forEach(card => {
    csv += `"${card.studentName}","${card.classLevel} ${card.classStream}","${card.classPosition}/${card.totalInClass}",${card.overallAverage.toFixed(1)},${card.subjects.length},"${card.dateGenerated}"\n`;
  });
  return csv;
}

// Download report card as PDF (simulated - in real app would use jsPDF or similar)
export function downloadReportCardPDF(data: ReportCardData, filename: string): void {
  const html = generateReportCardHTML(data);
  const blob = new Blob([html], { type: 'text/html' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = filename;
  link.click();
  URL.revokeObjectURL(url);
}
