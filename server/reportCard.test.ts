import { describe, it, expect } from "vitest";
import { generateReportCardHTML, type ReportCardData } from "../client/src/lib/reportCardGenerator";

describe("Report Card Generation System", () => {
  const mockReportCardData: ReportCardData = {
    schoolName: "Nairobi International School",
    schoolMotto: "Learn and Shine",
    schoolVision: "Excellence in Education for Global Leadership",
    schoolLogoUrl: "data:image/svg+xml,%3Csvg%3E%3C/svg%3E",
    studentName: "Alice Kariuki",
    studentPhotoUrl: "data:image/svg+xml,%3Csvg%3E%3C/svg%3E",
    admissionNumber: "SMS001",
    class: "S3 East",
    term: "Term 1",
    year: 2026,
    marks: [
      {
        subject: "Mathematics",
        integrationMark: 28,
        examMark: 29,
        totalMark: 285,
        grade: "A",
        remark: "Excellent",
      },
      {
        subject: "Physics",
        integrationMark: 26,
        examMark: 27,
        totalMark: 265,
        grade: "A",
        remark: "Excellent",
      },
      {
        subject: "Chemistry",
        integrationMark: 25,
        examMark: 26,
        totalMark: 255,
        grade: "B",
        remark: "Very Good",
      },
    ],
    overallAverage: 80,
    position: 1,
    totalStudents: 30,
    attendance: 95,
    teacherComments: "Excellent performance. Keep up the good work.",
    principalComments: "Outstanding achievement. Role model student.",
    nextTermDate: "April 15, 2026",
  };

  describe("Report Card HTML Generation", () => {
    it("should generate valid HTML structure", () => {
      const html = generateReportCardHTML(mockReportCardData);

      expect(html).toBeDefined();
      expect(html).toContain("<!DOCTYPE html>");
      expect(html).toContain("</html>");
      expect(html).toContain("<title>");
    });

    it("should include school information in header", () => {
      const html = generateReportCardHTML(mockReportCardData);

      expect(html).toContain(mockReportCardData.schoolName);
      expect(html).toContain(mockReportCardData.schoolMotto);
      expect(html).toContain(mockReportCardData.schoolVision);
    });

    it("should include student information", () => {
      const html = generateReportCardHTML(mockReportCardData);

      expect(html).toContain(mockReportCardData.studentName);
      expect(html).toContain(mockReportCardData.admissionNumber);
      expect(html).toContain(mockReportCardData.class);
    });

    it("should include all subject marks", () => {
      const html = generateReportCardHTML(mockReportCardData);

      mockReportCardData.marks.forEach((mark) => {
        expect(html).toContain(mark.subject);
        expect(html).toContain(mark.grade);
        expect(html).toContain(mark.remark);
      });
    });

    it("should include summary statistics", () => {
      const html = generateReportCardHTML(mockReportCardData);

      expect(html).toContain("AVERAGE MARK");
      expect(html).toContain("POSITION");
      expect(html).toContain("ATTENDANCE");
      expect(html).toContain("OVERALL GRADE");
    });

    it("should include teacher and principal comments", () => {
      const html = generateReportCardHTML(mockReportCardData);

      expect(html).toContain("TEACHER'S COMMENTS");
      expect(html).toContain(mockReportCardData.teacherComments);
      expect(html).toContain("PRINCIPAL'S COMMENTS");
      expect(html).toContain(mockReportCardData.principalComments);
    });

    it("should include next term date", () => {
      const html = generateReportCardHTML(mockReportCardData);

      expect(html).toContain(mockReportCardData.nextTermDate);
    });

    it("should include print styles", () => {
      const html = generateReportCardHTML(mockReportCardData);

      expect(html).toContain("@media print");
      expect(html).toContain(".print-button");
    });

    it("should include signature lines for teachers and principal", () => {
      const html = generateReportCardHTML(mockReportCardData);

      expect(html).toContain("Class Teacher");
      expect(html).toContain("Principal");
    });

    it("should include school logo and student photo", () => {
      const html = generateReportCardHTML(mockReportCardData);

      expect(html).toContain("School Logo");
      expect(html).toContain("Student Photo");
    });

    it("should have responsive styling", () => {
      const html = generateReportCardHTML(mockReportCardData);

      expect(html).toContain("210mm");
      expect(html).toContain("297mm");
    });
  });

  describe("Report Card Data Validation", () => {
    it("should handle missing school logo gracefully", () => {
      const dataWithoutLogo = { ...mockReportCardData, schoolLogoUrl: undefined };
      const html = generateReportCardHTML(dataWithoutLogo);

      expect(html).toBeDefined();
      expect(html).toContain("data:image/svg+xml");
    });

    it("should handle missing student photo gracefully", () => {
      const dataWithoutPhoto = { ...mockReportCardData, studentPhotoUrl: undefined };
      const html = generateReportCardHTML(dataWithoutPhoto);

      expect(html).toBeDefined();
      expect(html).toContain("data:image/svg+xml");
    });

    it("should display all marks in table format", () => {
      const html = generateReportCardHTML(mockReportCardData);

      expect(html).toContain("<table");
      expect(html).toContain("Integration");
      expect(html).toContain("Exam");
      expect(html).toContain("Total");
      expect(html).toContain("Grade");
      expect(html).toContain("Remark");
    });

    it("should calculate position correctly", () => {
      const html = generateReportCardHTML(mockReportCardData);

      expect(html).toContain(`${mockReportCardData.position}/${mockReportCardData.totalStudents}`);
    });
  });

  describe("Report Card Styling", () => {
    it("should include professional color scheme", () => {
      const html = generateReportCardHTML(mockReportCardData);

      expect(html).toContain("#4F46E5"); // Primary blue
      expect(html).toContain("#1F2937"); // Dark gray
      expect(html).toContain("#F3F4F6"); // Light gray
    });

    it("should include border styling for sections", () => {
      const html = generateReportCardHTML(mockReportCardData);

      expect(html).toContain("border");
      expect(html).toContain("border-radius");
    });

    it("should include shadow effects", () => {
      const html = generateReportCardHTML(mockReportCardData);

      expect(html).toContain("box-shadow");
    });

    it("should have proper spacing and padding", () => {
      const html = generateReportCardHTML(mockReportCardData);

      expect(html).toContain("padding");
      expect(html).toContain("margin");
    });
  });

  describe("Report Card Content Structure", () => {
    it("should have header section with school branding", () => {
      const html = generateReportCardHTML(mockReportCardData);

      expect(html).toContain("class=\"header\"");
      expect(html).toContain("class=\"logo\"");
      expect(html).toContain("class=\"school-info\"");
      expect(html).toContain("class=\"student-photo\"");
    });

    it("should have student info section", () => {
      const html = generateReportCardHTML(mockReportCardData);

      expect(html).toContain("class=\"student-info\"");
      expect(html).toContain("Student Name");
      expect(html).toContain("Admission No");
      expect(html).toContain("Class");
      expect(html).toContain("Term");
    });

    it("should have marks section with table", () => {
      const html = generateReportCardHTML(mockReportCardData);

      expect(html).toContain("ACADEMIC PERFORMANCE");
      expect(html).toContain("class=\"marks-table\"");
    });

    it("should have summary statistics section", () => {
      const html = generateReportCardHTML(mockReportCardData);

      expect(html).toContain("class=\"summary\"");
      expect(html).toContain("class=\"summary-box\"");
    });

    it("should have comments section", () => {
      const html = generateReportCardHTML(mockReportCardData);

      expect(html).toContain("class=\"comments-section\"");
      expect(html).toContain("class=\"comment-box\"");
    });

    it("should have footer with signature lines", () => {
      const html = generateReportCardHTML(mockReportCardData);

      expect(html).toContain("class=\"footer\"");
      expect(html).toContain("class=\"signature-line\"");
    });
  });

  describe("Report Card Printability", () => {
    it("should be optimized for printing", () => {
      const html = generateReportCardHTML(mockReportCardData);

      expect(html).toContain("@media print");
      expect(html).toContain("print");
    });

    it("should include print button", () => {
      const html = generateReportCardHTML(mockReportCardData);

      expect(html).toContain("onclick=\"window.print()\"");
      expect(html).toContain("Print Report Card");
    });

    it("should use A4 dimensions", () => {
      const html = generateReportCardHTML(mockReportCardData);

      expect(html).toContain("210mm");
      expect(html).toContain("297mm");
    });
  });
});
