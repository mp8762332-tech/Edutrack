import React, { useRef } from "react";
import { Button } from "@/components/ui/button";
import { Download, Printer } from "lucide-react";
import { toast } from "sonner";
import type { StudentMidTermResult } from "@/lib/midTermSystem";

interface MidTermReportCardProps {
  result: StudentMidTermResult;
  schoolName: string;
  schoolLogo?: string;
  studentPhoto?: string;
  schoolMotto: string;
  schoolVision: string;
  term: number;
  year: number;
}

export default function MidTermReportCard({
  result,
  schoolName,
  schoolLogo,
  studentPhoto,
  schoolMotto,
  schoolVision,
  term,
  year,
}: MidTermReportCardProps) {
  const reportRef = useRef<HTMLDivElement>(null);

  const handlePrint = () => {
    if (reportRef.current) {
      const printWindow = window.open("", "", "width=210mm,height=297mm");
      if (printWindow) {
        printWindow.document.write(reportRef.current.innerHTML);
        printWindow.document.close();
        setTimeout(() => {
          printWindow.print();
          printWindow.close();
        }, 250);
      }
    }
  };

  const handleDownloadPDF = () => {
    if (reportRef.current) {
      const element = reportRef.current;
      const opt = {
        margin: 0,
        filename: `${result.studentName}_MidTerm_T${term}_${year}.pdf`,
        image: { type: "jpeg", quality: 0.98 },
        html2canvas: { scale: 2 },
        jsPDF: { unit: "mm", format: "a4", orientation: "portrait" },
      };
      // Note: This requires html2pdf library to be installed
      toast.success("PDF download feature requires html2pdf library");
    }
  };

  const handleShareWhatsApp = () => {
    const message = `📋 Mid-Term Report Card\n\n${result.studentName}\nClass: ${result.className}\nPosition: ${result.position}\nAverage Score: ${result.averageScore}\n\nPlease download the attached report card for details.`;
    const whatsappUrl = `https://wa.me/?text=${encodeURIComponent(message)}`;
    window.open(whatsappUrl, "_blank");
    toast.success("WhatsApp link opened");
  };

  return (
    <div className="space-y-4">
      {/* Action Buttons */}
      <div className="flex gap-2 flex-wrap">
        <Button onClick={handlePrint} className="gap-2" variant="outline">
          <Printer size={18} />
          Print
        </Button>
        <Button onClick={handleDownloadPDF} className="gap-2" variant="outline">
          <Download size={18} />
          Download PDF
        </Button>
        <Button onClick={handleShareWhatsApp} className="gap-2 bg-green-600 hover:bg-green-700">
          Share via WhatsApp
        </Button>
      </div>

      {/* Report Card - A4 Optimized */}
      <div
        ref={reportRef}
        className="bg-white p-5"
        style={{
          width: "210mm",
          minHeight: "297mm",
          margin: "0 auto",
          fontFamily: "Arial, sans-serif",
          fontSize: "11px",
          lineHeight: "1.4",
        }}
      >
        {/* Header */}
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            marginBottom: "15px",
            paddingBottom: "10px",
            borderBottom: "2px solid #333",
          }}
        >
          {/* Logo */}
          <div
            style={{
              width: "70px",
              height: "70px",
              borderRadius: "50%",
              background: "#f0f0f0",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontWeight: "bold",
              fontSize: "12px",
              border: "2px solid #333",
            }}
          >
            {schoolLogo ? <img src={schoolLogo} alt="Logo" style={{ maxWidth: "100%", maxHeight: "100%" }} /> : "LOGO"}
          </div>

          {/* School Info */}
          <div style={{ textAlign: "center", flex: 1, margin: "0 15px" }}>
            <h1 style={{ margin: "0", fontSize: "18px", fontWeight: "bold" }}>{schoolName}</h1>
            <p style={{ margin: "2px 0", fontSize: "10px", color: "#666" }}>
              <strong>Motto:</strong> {schoolMotto}
            </p>
            <p style={{ margin: "2px 0", fontSize: "10px", color: "#666" }}>
              <strong>Vision:</strong> {schoolVision}
            </p>
            <p style={{ margin: "3px 0", fontSize: "11px", fontWeight: "bold" }}>
              MID-TERM REPORT CARD - TERM {term}, {year}
            </p>
          </div>

          {/* Student Photo */}
          <div
            style={{
              width: "70px",
              height: "70px",
              borderRadius: "50%",
              background: "#f0f0f0",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: "10px",
              color: "#999",
              border: "2px solid #333",
            }}
          >
            {studentPhoto ? <img src={studentPhoto} alt="Student" style={{ maxWidth: "100%", maxHeight: "100%", borderRadius: "50%" }} /> : "PHOTO"}
          </div>
        </div>

        {/* Student Information */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "1fr 1fr",
            gap: "10px",
            marginBottom: "12px",
            fontSize: "11px",
          }}
        >
          <div style={{ display: "flex", justifyContent: "space-between" }}>
            <span style={{ fontWeight: "bold", width: "40%" }}>Name:</span>
            <span style={{ width: "60%", borderBottom: "1px solid #333" }}>{result.studentName}</span>
          </div>
          <div style={{ display: "flex", justifyContent: "space-between" }}>
            <span style={{ fontWeight: "bold", width: "40%" }}>Admission No:</span>
            <span style={{ width: "60%", borderBottom: "1px solid #333" }}>{result.admissionNumber}</span>
          </div>
          <div style={{ display: "flex", justifyContent: "space-between" }}>
            <span style={{ fontWeight: "bold", width: "40%" }}>Class:</span>
            <span style={{ width: "60%", borderBottom: "1px solid #333" }}>{result.className}</span>
          </div>
          <div style={{ display: "flex", justifyContent: "space-between" }}>
            <span style={{ fontWeight: "bold", width: "40%" }}>Position:</span>
            <span style={{ width: "60%", borderBottom: "1px solid #333" }}>{result.position}</span>
          </div>
        </div>

        {/* Marks Table */}
        <table
          style={{
            width: "100%",
            borderCollapse: "collapse",
            marginBottom: "12px",
            fontSize: "10px",
          }}
        >
          <thead>
            <tr style={{ background: "#333", color: "white" }}>
              <th style={{ padding: "6px", border: "1px solid #333", textAlign: "center", fontWeight: "bold" }}>Subject</th>
              <th style={{ padding: "6px", border: "1px solid #333", textAlign: "center", fontWeight: "bold" }}>Paper 1</th>
              <th style={{ padding: "6px", border: "1px solid #333", textAlign: "center", fontWeight: "bold" }}>Paper 2</th>
              <th style={{ padding: "6px", border: "1px solid #333", textAlign: "center", fontWeight: "bold" }}>Avg Score</th>
              <th style={{ padding: "6px", border: "1px solid #333", textAlign: "center", fontWeight: "bold" }}>Grade</th>
              <th style={{ padding: "6px", border: "1px solid #333", textAlign: "center", fontWeight: "bold" }}>Remark</th>
            </tr>
          </thead>
          <tbody>
            {result.marks.map((mark, idx) => (
              <tr key={idx}>
                <td style={{ padding: "6px", border: "1px solid #333", textAlign: "left" }}>Subject {mark.subjectId}</td>
                <td style={{ padding: "6px", border: "1px solid #333", textAlign: "center" }}>{mark.paper1Mark}</td>
                <td style={{ padding: "6px", border: "1px solid #333", textAlign: "center" }}>{mark.paper2Mark ?? "N/A"}</td>
                <td style={{ padding: "6px", border: "1px solid #333", textAlign: "center", fontWeight: "bold" }}>{mark.averageScore}</td>
                <td style={{ padding: "6px", border: "1px solid #333", textAlign: "center", fontWeight: "bold" }}>{mark.grade}</td>
                <td style={{ padding: "6px", border: "1px solid #333", textAlign: "left" }}>{mark.remark}</td>
              </tr>
            ))}
          </tbody>
        </table>

        {/* Summary */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "1fr 1fr 1fr 1fr",
            gap: "8px",
            marginBottom: "12px",
            fontSize: "10px",
          }}
        >
          <div style={{ border: "1px solid #333", padding: "8px", textAlign: "center" }}>
            <div style={{ fontWeight: "bold", color: "#666", fontSize: "9px" }}>Subjects</div>
            <div style={{ fontSize: "14px", fontWeight: "bold" }}>{result.totalSubjects}</div>
          </div>
          <div style={{ border: "1px solid #333", padding: "8px", textAlign: "center" }}>
            <div style={{ fontWeight: "bold", color: "#666", fontSize: "9px" }}>Average Score</div>
            <div style={{ fontSize: "14px", fontWeight: "bold" }}>{result.averageScore}</div>
          </div>
          <div style={{ border: "1px solid #333", padding: "8px", textAlign: "center" }}>
            <div style={{ fontWeight: "bold", color: "#666", fontSize: "9px" }}>Position</div>
            <div style={{ fontSize: "14px", fontWeight: "bold" }}>{result.position}</div>
          </div>
          <div style={{ border: "1px solid #333", padding: "8px", textAlign: "center" }}>
            <div style={{ fontWeight: "bold", color: "#666", fontSize: "9px" }}>Term</div>
            <div style={{ fontSize: "14px", fontWeight: "bold" }}>
              {term}/{year}
            </div>
          </div>
        </div>

        {/* Teacher Comments */}
        <div style={{ marginBottom: "12px" }}>
          <div style={{ fontWeight: "bold", marginBottom: "4px", fontSize: "10px" }}>Teacher Comments:</div>
          <div
            style={{
              border: "1px solid #333",
              padding: "8px",
              minHeight: "35px",
              background: "#fafafa",
              fontSize: "10px",
            }}
          >
            &nbsp;
          </div>
        </div>

        {/* Signatures */}
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            marginTop: "15px",
            fontSize: "10px",
          }}
        >
          <div style={{ width: "30%", textAlign: "center" }}>
            <div style={{ borderTop: "1px solid #333", height: "35px", marginBottom: "4px" }}>&nbsp;</div>
            <div>Class Teacher</div>
          </div>
          <div style={{ width: "30%", textAlign: "center" }}>
            <div style={{ borderTop: "1px solid #333", height: "35px", marginBottom: "4px" }}>&nbsp;</div>
            <div>Head Teacher</div>
          </div>
          <div style={{ width: "30%", textAlign: "center" }}>
            <div style={{ borderTop: "1px solid #333", height: "35px", marginBottom: "4px" }}>&nbsp;</div>
            <div>Principal</div>
          </div>
        </div>

        {/* Footer */}
        <div
          style={{
            textAlign: "center",
            fontSize: "9px",
            color: "#999",
            marginTop: "10px",
            paddingTop: "8px",
            borderTop: "1px solid #ddd",
          }}
        >
          Generated on {new Date().toLocaleDateString()} | This is an official school document
        </div>
      </div>

      {/* Print Styles */}
      <style>{`
        @media print {
          body {
            margin: 0;
            padding: 0;
            background: white;
          }
          .no-print {
            display: none !important;
          }
          div[style*="width: 210mm"] {
            box-shadow: none;
            border: none;
            margin: 0;
            padding: 0;
          }
        }
      `}</style>
    </div>
  );
}
