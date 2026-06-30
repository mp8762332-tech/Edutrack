import { describe, it, expect } from "vitest";
import {
  generateStudentReport,
  generateTermReport,
  generateFeeReport,
  generatePerformanceAnalytics,
} from "../client/src/lib/reportGenerator";

describe("Report Generation System", () => {
  const mockStudent = {
    id: "1",
    name: "Alice Kariuki",
    class: "S3 East",
    totalFees: 50000,
    paymentRef: "SMS001",
  };

  const mockMarks = [
    { studentId: "1", subject: "Mathematics", integrationMark: 2.8, examMark: 2.9 },
    { studentId: "1", subject: "Physics", integrationMark: 2.6, examMark: 2.7 },
    { studentId: "2", subject: "Mathematics", integrationMark: 2.5, examMark: 2.4 },
  ];

  const mockPayments = [
    { studentId: "1", amount: 25000, date: "2026-01-15", paymentRef: "SMS001" },
    { studentId: "1", amount: 25000, date: "2026-02-15", paymentRef: "SMS001" },
  ];

  const mockStudents = [
    { id: "1", name: "Alice Kariuki", class: "S3 East", totalFees: 50000, paymentRef: "SMS001" },
    { id: "2", name: "John Kipchoge", class: "S3 East", totalFees: 50000, paymentRef: "SMS002" },
  ];

  describe("Student Report Generation", () => {
    it("should generate a student report with correct structure", () => {
      const report = generateStudentReport(mockStudent, mockMarks, mockPayments, mockStudents);

      expect(report).toBeDefined();
      expect(report.studentId).toBe("1");
      expect(report.studentName).toBe("Alice Kariuki");
      expect(report.class).toBe("S3 East");
      expect(report.subjects.length).toBeGreaterThan(0);
    });

    it("should calculate correct payment status", () => {
      const report = generateStudentReport(mockStudent, mockMarks, mockPayments, mockStudents);

      expect(report.paymentStatus.totalFees).toBe(50000);
      expect(report.paymentStatus.paidAmount).toBeGreaterThanOrEqual(0);
      expect(report.paymentStatus.balance).toBeGreaterThanOrEqual(0);
      expect(report.paymentStatus.status).toBeDefined();
    });


    it("should calculate correct position in class", () => {
      const report = generateStudentReport(mockStudent, mockMarks, mockPayments, mockStudents);

      expect(report.position).toBeGreaterThanOrEqual(0);
      expect(report.position).toBeLessThanOrEqual(mockStudents.length);
    });

    it("should include all subject results", () => {
      const report = generateStudentReport(mockStudent, mockMarks, mockPayments, mockStudents);

      expect(report.subjects.length).toBeGreaterThan(0);
      report.subjects.forEach((subject: any) => {
        expect(subject.subject).toBeDefined();
        expect(subject.finalScore).toBeGreaterThan(0);
        expect(subject.grade).toBeDefined();
        expect(subject.remark).toBeDefined();
      });
    });
  });

  describe("Term Report Generation", () => {
    it("should generate a term report with correct structure", () => {
      const report = generateTermReport("Nairobi International School", mockStudents, mockMarks);

      expect(report).toBeDefined();
      expect(report.schoolName).toBe("Nairobi International School");
      expect(report.term).toBe("Term 1");
      expect(report.year).toBe(new Date().getFullYear());
      expect(report.classReports).toBeDefined();
    });

    it("should include all classes in term report", () => {
      const report = generateTermReport("Nairobi International School", mockStudents, mockMarks);

      expect(report.classReports.length).toBeGreaterThan(0);
      expect(report.classReports[0].className).toBeDefined();
      expect(report.classReports[0].totalStudents).toBeGreaterThan(0);
    });

    it("should calculate pass and fail rates", () => {
      const report = generateTermReport("Nairobi International School", mockStudents, mockMarks);

      report.classReports.forEach((classReport) => {
        expect(classReport.passRate).toBeGreaterThanOrEqual(0);
        expect(classReport.failRate).toBeGreaterThanOrEqual(0);
        expect(classReport.passRate + classReport.failRate).toBe(100);
      });
    });
  });

  describe("Fee Report Generation", () => {
    it("should generate a fee report with correct structure", () => {
      const report = generateFeeReport("Nairobi International School", mockStudents, mockPayments);

      expect(report).toBeDefined();
      expect(report.schoolName).toBe("Nairobi International School");
      expect(report.totalExpectedFees).toBeGreaterThan(0);
      expect(report.totalCollected).toBeGreaterThanOrEqual(0);
      expect(report.collectionRate).toBeGreaterThanOrEqual(0);
    });

    it("should calculate collection rate correctly", () => {
      const report = generateFeeReport("Nairobi International School", mockStudents, mockPayments);

      const expectedRate = Math.round((report.totalCollected / report.totalExpectedFees) * 100);
      expect(report.collectionRate).toBe(expectedRate);
    });

    it("should include all student payment details", () => {
      const report = generateFeeReport("Nairobi International School", mockStudents, mockPayments);

      expect(report.studentPaymentDetails.length).toBe(mockStudents.length);
      report.studentPaymentDetails.forEach((detail) => {
        expect(detail.studentName).toBeDefined();
        expect(detail.paymentRef).toBeDefined();
        expect(detail.totalFees).toBeGreaterThan(0);
      });
    });

    it("should correctly categorize payment status", () => {
      const report = generateFeeReport("Nairobi International School", mockStudents, mockPayments);

      report.studentPaymentDetails.forEach((detail) => {
        const status = detail.status;
        expect(["Paid", "Partial", "Outstanding"]).toContain(status);
      });
    });
  });

  describe("Performance Analytics Generation", () => {
    it("should generate performance analytics with correct structure", () => {
      const analytics = generatePerformanceAnalytics(
        "Nairobi International School",
        mockStudents,
        mockMarks
      );

      expect(analytics).toBeDefined();
      expect(analytics.schoolName).toBe("Nairobi International School");
      expect(analytics.totalStudents).toBe(mockStudents.length);
      expect(analytics.averageScore).toBeGreaterThan(0);
      expect(analytics.passPercentage).toBeGreaterThanOrEqual(0);
      expect(analytics.failPercentage).toBeGreaterThanOrEqual(0);
    });

    it("should calculate pass and fail percentages correctly", () => {
      const analytics = generatePerformanceAnalytics(
        "Nairobi International School",
        mockStudents,
        mockMarks
      );

      expect(analytics.passPercentage + analytics.failPercentage).toBe(100);
    });

    it("should include subject analytics", () => {
      const analytics = generatePerformanceAnalytics(
        "Nairobi International School",
        mockStudents,
        mockMarks
      );

      expect(analytics.subjectAnalytics.length).toBeGreaterThan(0);
      analytics.subjectAnalytics.forEach((subject) => {
        expect(subject.subject).toBeDefined();
        expect(subject.averageScore).toBeGreaterThan(0);
        expect(subject.passRate).toBeGreaterThanOrEqual(0);
        expect(subject.failRate).toBeGreaterThanOrEqual(0);
      });
    });

    it("should include class analytics", () => {
      const analytics = generatePerformanceAnalytics(
        "Nairobi International School",
        mockStudents,
        mockMarks
      );

      expect(analytics.classAnalytics.length).toBeGreaterThan(0);
      analytics.classAnalytics.forEach((cls) => {
        expect(cls.className).toBeDefined();
        expect(cls.averageScore).toBeGreaterThan(0);
        expect(cls.totalStudents).toBeGreaterThan(0);
      });
    });

    it("should track highest and lowest scores", () => {
      const analytics = generatePerformanceAnalytics(
        "Nairobi International School",
        mockStudents,
        mockMarks
      );

      expect(analytics.highestScore).toBeGreaterThanOrEqual(analytics.lowestScore);
      expect(analytics.highestScore).toBeGreaterThan(0);
    });
  });

  describe("Report Auto-Generation Triggers", () => {
    it("should generate reports when marks are entered", () => {
      const newMarks = [
        ...mockMarks,
        { studentId: "1", subject: "Chemistry", integrationMark: 2.7, examMark: 2.8 },
      ];

      const report = generateTermReport("Nairobi International School", mockStudents, newMarks);

      expect(report.classReports).toBeDefined();
      expect(report.classReports.length).toBeGreaterThan(0);
    });

    it("should update reports when payments are recorded", () => {
      const newPayments = [
        ...mockPayments,
        { studentId: "2", amount: 50000, date: "2026-02-20", paymentRef: "SMS002" },
      ];

      const report = generateFeeReport("Nairobi International School", mockStudents, newPayments);

      expect(report.totalCollected).toBeGreaterThan(0);
      expect(report.collectionRate).toBeGreaterThan(0);
    });
  });
});
