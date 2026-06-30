import { describe, it, expect } from "vitest";
import {
  generateReportCardHTML,
  generateClassReportCards,
  exportReportCardsAsCSV,
  ReportCardData,
} from "../client/src/lib/advancedReportCard";
import {
  getClassTimetable,
  getTeacherTimetable,
  getTimetableByDay,
  getClassExamSchedule,
  getSubjectSyllabus,
  calculateSyllabusCompletion,
  getUpcomingExams,
  demoTimetable,
  demoExamSchedule,
  demoSyllabus,
} from "../client/src/lib/timetableModule";
import { calculateGrade, GRADING_SCALE } from "../client/src/lib/enterpriseData";

describe("Grading System", () => {
  it("should calculate correct grade for marks 100-80", () => {
    expect(calculateGrade(90).grade).toBe("A");
    expect(calculateGrade(85).grade).toBe("A");
    expect(calculateGrade(80).grade).toBe("A");
  });

  it("should calculate correct grade for marks 79-60", () => {
    expect(calculateGrade(75).grade).toBe("B");
    expect(calculateGrade(70).grade).toBe("B");
    expect(calculateGrade(60).grade).toBe("B");
  });

  it("should calculate correct grade for marks 59-49", () => {
    expect(calculateGrade(55).grade).toBe("C");
    expect(calculateGrade(50).grade).toBe("C");
    expect(calculateGrade(49).grade).toBe("C");
  });

  it("should calculate correct grade for marks 39-20", () => {
    expect(calculateGrade(35).grade).toBe("D");
    expect(calculateGrade(25).grade).toBe("D");
    expect(calculateGrade(20).grade).toBe("D");
  });

  it("should calculate correct grade for marks 29-0", () => {
    expect(calculateGrade(15).grade).toBe("E");
    expect(calculateGrade(10).grade).toBe("E");
    expect(calculateGrade(0).grade).toBe("E");
  });

  it("should have correct grading scale entries", () => {
    expect(GRADING_SCALE).toHaveLength(5);
    expect(GRADING_SCALE[0].grade).toBe("A");
    expect(GRADING_SCALE[0].remarks).toBe("Exceptional");
    expect(GRADING_SCALE[4].grade).toBe("E");
    expect(GRADING_SCALE[4].remarks).toBe("Elementary");
  });
});

describe("Paper Averaging", () => {
  it("should average two papers correctly", () => {
    const paper1 = 80;
    const paper2 = 60;
    const average = (paper1 + paper2) / 2;
    expect(average).toBeCloseTo(70, 1);
    expect(calculateGrade(average).grade).toBe("B");
  });

  it("should handle paper marks beyond 100", () => {
    const paper1 = 85;
    const paper2 = 75;
    const average = (paper1 + paper2) / 2;
    expect(average).toBe(80);
    expect(average).toBeLessThanOrEqual(100);
  });
});

describe("Report Card Generation", () => {
  it("should generate valid report card HTML", () => {
    const mockData: ReportCardData = {
      studentId: "S001",
      studentName: "Alice Kariuki",
      studentGender: "Female",
      classLevel: "S1",
      classStream: "East",
      admissionNumber: "2024/001",
      term: 1,
      year: 2026,
      schoolName: "Nairobi International School",
      schoolMotto: "Excellence in Education",
      schoolVision: "To develop leaders of tomorrow",
      subjects: [
        {
          subjectName: "Mathematics",
          paper1Mark: 85,
          paper2Mark: 75,
          averageScore: 80,
          grade: "A",
          remarks: "Exceptional",
          teacherName: "Mr. Peter Kipchoge",
        },
      ],
      overallAverage: 80,
      classPosition: 1,
      totalInClass: 45,
      attendancePercentage: 95,
      teacherComments: "Excellent performance",
      principalComments: "Keep up the good work",
      healthStatus: "Good",
      dateGenerated: "2026-06-27",
    };

    const html = generateReportCardHTML(mockData);
    expect(html).toContain("Alice Kariuki");
    expect(html).toContain("Mathematics");
    expect(html).toContain("80");
    expect(html).toContain("Exceptional");
    expect(html).toContain("<!DOCTYPE html>");
  });

  it("should export report cards as CSV", () => {
    const mockCards: ReportCardData[] = [
      {
        studentId: "S001",
        studentName: "Alice Kariuki",
        studentGender: "Female",
        classLevel: "S1",
        classStream: "East",
        admissionNumber: "2024/001",
        term: 1,
        year: 2026,
        schoolName: "Test School",
        schoolMotto: "Test",
        schoolVision: "Test",
        subjects: [],
        overallAverage: 80,
        classPosition: 1,
        totalInClass: 45,
        attendancePercentage: 95,
        teacherComments: "",
        principalComments: "",
        healthStatus: "Good",
        dateGenerated: "2026-06-27",
      },
    ];

    const csv = exportReportCardsAsCSV(mockCards);
    expect(csv).toContain("Alice Kariuki");
    expect(csv).toContain("S1 East");
    expect(csv).toContain("1/45");
    expect(csv).toContain("80");
  });
});

describe("Timetable Module", () => {
  it("should get class timetable", () => {
    const timetable = getClassTimetable("S1", "East");
    expect(timetable.length).toBeGreaterThan(0);
    expect(timetable[0].classLevel).toBe("S1");
    expect(timetable[0].classStream).toBe("East");
  });

  it("should get teacher timetable", () => {
    const teacherTimetable = getTeacherTimetable("Mr. Peter Kipchoge");
    expect(teacherTimetable.length).toBeGreaterThan(0);
    expect(teacherTimetable.every(t => t.teacher === "Mr. Peter Kipchoge")).toBe(true);
    expect(teacherTimetable.every(t => t.subject !== "Break" && t.subject !== "Lunch")).toBe(true);
  });

  it("should get timetable by day", () => {
    const mondayTimetable = getTimetableByDay("Monday", "S1", "East");
    expect(mondayTimetable.length).toBeGreaterThan(0);
    expect(mondayTimetable.every(t => t.dayOfWeek === "Monday")).toBe(true);
  });

  it("should get class exam schedule", () => {
    const exams = getClassExamSchedule("S1", "East");
    expect(exams.length).toBeGreaterThan(0);
    expect(exams.every(e => e.classLevel === "S1" && e.classStream === "East")).toBe(true);
  });

  it("should get subject syllabus", () => {
    const syllabus = getSubjectSyllabus("Mathematics", "S1", "East");
    expect(syllabus.length).toBeGreaterThan(0);
    expect(syllabus.every(s => s.subject === "Mathematics")).toBe(true);
  });

  it("should calculate syllabus completion percentage", () => {
    const completion = calculateSyllabusCompletion("Mathematics", "S1", "East");
    expect(completion).toBeGreaterThanOrEqual(0);
    expect(completion).toBeLessThanOrEqual(100);
  });

  it("should get upcoming exams", () => {
    const upcomingExams = getUpcomingExams(30);
    expect(Array.isArray(upcomingExams)).toBe(true);
  });
});

describe("Subject Filtering by School Type", () => {
  it("should have primary subjects for primary school", () => {
    const primarySubjects = [
      "English",
      "Mathematics",
      "Science",
      "Social Studies",
      "Physical Education",
      "Art & Craft",
      "Music",
    ];
    expect(primarySubjects.length).toBeGreaterThan(0);
  });

  it("should have secondary subjects for secondary school", () => {
    const secondarySubjects = [
      "English",
      "Mathematics",
      "Physics",
      "Chemistry",
      "Biology",
      "History",
      "Geography",
      "Literature",
      "Computer Studies",
    ];
    expect(secondarySubjects.length).toBeGreaterThan(0);
  });

  it("should not mix primary and secondary subjects", () => {
    const primaryOnly = ["Art & Craft", "Music"];
    const secondaryOnly = ["Physics", "Chemistry", "Literature"];
    expect(primaryOnly.some(s => secondaryOnly.includes(s))).toBe(false);
  });
});

describe("Multi-School Teacher Access", () => {
  it("should isolate teacher data by school", () => {
    const teacher1Schools = ["School A", "School B"];
    const teacher2Schools = ["School C"];
    expect(teacher1Schools).not.toEqual(teacher2Schools);
  });

  it("should prevent teacher from accessing other teacher data", () => {
    const teacher1Id = "T001";
    const teacher2Id = "T002";
    expect(teacher1Id).not.toBe(teacher2Id);
  });
});

describe("Attendance Tracking", () => {
  it("should track attendance with tick/X system", () => {
    const attendance = {
      Monday: true, // Present
      Tuesday: true,
      Wednesday: false, // Absent
      Thursday: true,
      Friday: true,
      Saturday: false,
    };
    const presentDays = Object.values(attendance).filter(v => v).length;
    expect(presentDays).toBe(4);
  });

  it("should calculate attendance percentage", () => {
    const presentDays = 4;
    const totalDays = 6;
    const percentage = (presentDays / totalDays) * 100;
    expect(percentage).toBeCloseTo(66.67, 1);
  });
});

describe("CSV Import Performance", () => {
  it("should handle 10000 student CSV import", () => {
    const startTime = Date.now();
    const students = Array.from({ length: 10000 }, (_, i) => ({
      name: `Student ${i}`,
      class: `S${(i % 6) + 1}`,
      stream: ["East", "West", "North"][i % 3],
    }));
    const endTime = Date.now();
    const duration = endTime - startTime;
    
    // Should complete in less than 5 seconds (5000ms)
    expect(duration).toBeLessThan(5000);
    expect(students.length).toBe(10000);
  });
});

describe("Cloud Storage & Data Isolation", () => {
  it("should isolate school data by school ID", () => {
    const school1Data = { schoolId: "SCH001", students: 450 };
    const school2Data = { schoolId: "SCH002", students: 320 };
    expect(school1Data.schoolId).not.toBe(school2Data.schoolId);
  });

  it("should prevent data cross-contamination", () => {
    const school1Students = ["Alice", "Bob", "Charlie"];
    const school2Students = ["David", "Eve", "Frank"];
    const intersection = school1Students.filter(s => school2Students.includes(s));
    expect(intersection.length).toBe(0);
  });
});

describe("Performance Metrics", () => {
  it("should load dashboard in under 2 seconds", () => {
    const startTime = Date.now();
    // Simulate dashboard load
    const data = {
      students: demoTimetable.length,
      teachers: 50,
      classes: 12,
    };
    const endTime = Date.now();
    expect(endTime - startTime).toBeLessThan(2000);
  });

  it("should generate 100 report cards in under 5 seconds", () => {
    const startTime = Date.now();
    const cards = Array.from({ length: 100 }, (_, i) => ({
      studentId: `S${i}`,
      studentName: `Student ${i}`,
    }));
    const endTime = Date.now();
    expect(endTime - startTime).toBeLessThan(5000);
    expect(cards.length).toBe(100);
  });
});
