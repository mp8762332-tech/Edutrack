import React from "react";

interface ReportCardProps {
  studentName: string;
  admissionNumber: string;
  className: string;
  term: string;
  year: number;
  schoolName: string;
  schoolLogo?: string;
  marks: Array<{
    subject: string;
    paper1: number;
    paper2: number;
    average: number;
    grade: string;
    remark: string;
  }>;
  position: number;
  totalStudents: number;
  averageScore: number;
  teacherComment: string;
  principalComment: string;
  principalName: string;
  classTeacher: string;
}

export const ProductionReportCard = React.forwardRef<HTMLDivElement, ReportCardProps>(
  (
    {
      studentName,
      admissionNumber,
      className,
      term,
      year,
      schoolName,
      schoolLogo,
      marks,
      position,
      totalStudents,
      averageScore,
      teacherComment,
      principalComment,
      principalName,
      classTeacher,
    },
    ref
  ) => {
    return (
      <div
        ref={ref}
        className="w-full bg-white"
        style={{
          width: "210mm",
          height: "297mm",
          padding: "15mm",
          fontFamily: "Arial, sans-serif",
          fontSize: "11pt",
          lineHeight: "1.4",
          color: "#000",
          pageBreakAfter: "always",
        }}
      >
        {/* Header */}
        <div style={{ textAlign: "center", marginBottom: "10mm", borderBottom: "2px solid #000", paddingBottom: "5mm" }}>
          {schoolLogo && <img src={schoolLogo} alt="School Logo" style={{ height: "20mm", marginBottom: "3mm" }} />}
          <h1 style={{ margin: "0", fontSize: "16pt", fontWeight: "bold" }}>{schoolName}</h1>
          <p style={{ margin: "2mm 0 0 0", fontSize: "10pt" }}>ACADEMIC REPORT CARD</p>
        </div>

        {/* Student Information */}
        <div style={{ marginBottom: "8mm", display: "grid", gridTemplateColumns: "1fr 1fr", gap: "10mm" }}>
          <div>
            <table style={{ width: "100%", fontSize: "10pt" }}>
              <tbody>
                <tr>
                  <td style={{ fontWeight: "bold", width: "40%" }}>Student Name:</td>
                  <td style={{ borderBottom: "1px solid #000", paddingBottom: "2px" }}>{studentName}</td>
                </tr>
                <tr>
                  <td style={{ fontWeight: "bold" }}>Admission No:</td>
                  <td style={{ borderBottom: "1px solid #000", paddingBottom: "2px" }}>{admissionNumber}</td>
                </tr>
                <tr>
                  <td style={{ fontWeight: "bold" }}>Class:</td>
                  <td style={{ borderBottom: "1px solid #000", paddingBottom: "2px" }}>{className}</td>
                </tr>
              </tbody>
            </table>
          </div>
          <div>
            <table style={{ width: "100%", fontSize: "10pt" }}>
              <tbody>
                <tr>
                  <td style={{ fontWeight: "bold", width: "40%" }}>Term:</td>
                  <td style={{ borderBottom: "1px solid #000", paddingBottom: "2px" }}>{term}</td>
                </tr>
                <tr>
                  <td style={{ fontWeight: "bold" }}>Year:</td>
                  <td style={{ borderBottom: "1px solid #000", paddingBottom: "2px" }}>{year}</td>
                </tr>
                <tr>
                  <td style={{ fontWeight: "bold" }}>Position:</td>
                  <td style={{ borderBottom: "1px solid #000", paddingBottom: "2px" }}>
                    {position} of {totalStudents}
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        {/* Marks Table */}
        <div style={{ marginBottom: "8mm" }}>
          <table
            style={{
              width: "100%",
              borderCollapse: "collapse",
              fontSize: "10pt",
              border: "1px solid #000",
            }}
          >
            <thead>
              <tr style={{ backgroundColor: "#f0f0f0" }}>
                <th style={{ border: "1px solid #000", padding: "4mm", textAlign: "left", fontWeight: "bold" }}>
                  Subject
                </th>
                <th style={{ border: "1px solid #000", padding: "4mm", textAlign: "center", fontWeight: "bold" }}>
                  Paper 1
                </th>
                <th style={{ border: "1px solid #000", padding: "4mm", textAlign: "center", fontWeight: "bold" }}>
                  Paper 2
                </th>
                <th style={{ border: "1px solid #000", padding: "4mm", textAlign: "center", fontWeight: "bold" }}>
                  Average
                </th>
                <th style={{ border: "1px solid #000", padding: "4mm", textAlign: "center", fontWeight: "bold" }}>
                  Grade
                </th>
                <th style={{ border: "1px solid #000", padding: "4mm", textAlign: "left", fontWeight: "bold" }}>
                  Remark
                </th>
              </tr>
            </thead>
            <tbody>
              {marks.map((mark, idx) => (
                <tr key={idx}>
                  <td style={{ border: "1px solid #000", padding: "4mm" }}>{mark.subject}</td>
                  <td style={{ border: "1px solid #000", padding: "4mm", textAlign: "center" }}>{mark.paper1}</td>
                  <td style={{ border: "1px solid #000", padding: "4mm", textAlign: "center" }}>{mark.paper2}</td>
                  <td style={{ border: "1px solid #000", padding: "4mm", textAlign: "center", fontWeight: "bold" }}>
                    {mark.average.toFixed(1)}
                  </td>
                  <td style={{ border: "1px solid #000", padding: "4mm", textAlign: "center", fontWeight: "bold" }}>
                    {mark.grade}
                  </td>
                  <td style={{ border: "1px solid #000", padding: "4mm" }}>{mark.remark}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Summary */}
        <div style={{ marginBottom: "8mm", display: "grid", gridTemplateColumns: "1fr 1fr", gap: "10mm" }}>
          <div style={{ border: "1px solid #000", padding: "4mm" }}>
            <p style={{ margin: "0 0 2mm 0", fontWeight: "bold" }}>OVERALL AVERAGE:</p>
            <p style={{ margin: "0", fontSize: "14pt", fontWeight: "bold" }}>{averageScore.toFixed(1)}</p>
          </div>
          <div style={{ border: "1px solid #000", padding: "4mm" }}>
            <p style={{ margin: "0 0 2mm 0", fontWeight: "bold" }}>GRADE SCALE:</p>
            <p style={{ margin: "0", fontSize: "9pt" }}>A: 80-100 | B: 60-79 | C: 49-59 | D: 20-39 | E: 0-19</p>
          </div>
        </div>

        {/* Comments */}
        <div style={{ marginBottom: "8mm" }}>
          <div style={{ marginBottom: "5mm", border: "1px solid #000", padding: "4mm", minHeight: "20mm" }}>
            <p style={{ margin: "0 0 2mm 0", fontWeight: "bold" }}>CLASS TEACHER COMMENT:</p>
            <p style={{ margin: "0", fontSize: "10pt", whiteSpace: "pre-wrap" }}>{teacherComment || "_______________________________________________"}</p>
          </div>

          <div style={{ border: "1px solid #000", padding: "4mm", minHeight: "20mm" }}>
            <p style={{ margin: "0 0 2mm 0", fontWeight: "bold" }}>PRINCIPAL COMMENT:</p>
            <p style={{ margin: "0", fontSize: "10pt", whiteSpace: "pre-wrap" }}>{principalComment || "_______________________________________________"}</p>
          </div>
        </div>

        {/* Signatures */}
        <div style={{ marginTop: "8mm", display: "grid", gridTemplateColumns: "1fr 1fr", gap: "15mm" }}>
          <div style={{ textAlign: "center" }}>
            <p style={{ margin: "0 0 15mm 0", fontSize: "10pt", minHeight: "15mm", borderTop: "1px solid #000" }}>
              &nbsp;
            </p>
            <p style={{ margin: "0", fontWeight: "bold", fontSize: "10pt" }}>{classTeacher}</p>
            <p style={{ margin: "0", fontSize: "9pt" }}>Class Teacher</p>
          </div>
          <div style={{ textAlign: "center" }}>
            <p style={{ margin: "0 0 15mm 0", fontSize: "10pt", minHeight: "15mm", borderTop: "1px solid #000" }}>
              &nbsp;
            </p>
            <p style={{ margin: "0", fontWeight: "bold", fontSize: "10pt" }}>{principalName}</p>
            <p style={{ margin: "0", fontSize: "9pt" }}>Principal</p>
          </div>
        </div>

        {/* Footer */}
        <div style={{ marginTop: "8mm", textAlign: "center", fontSize: "8pt", color: "#666" }}>
          <p style={{ margin: "0" }}>Generated on {new Date().toLocaleDateString()}</p>
          <p style={{ margin: "0" }}>This is an official document of {schoolName}</p>
        </div>
      </div>
    );
  }
);

ProductionReportCard.displayName = "ProductionReportCard";
