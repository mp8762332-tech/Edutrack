import { int, mysqlEnum, mysqlTable, text, timestamp, varchar, decimal, boolean, json } from "drizzle-orm/mysql-core";

/**
 * Production Database Schema for School Management System
 * Supports Multi-Term exams, timetables, and complete academic management
 */

// Users Table - All system users
export const users = mysqlTable("users", {
  id: int("id").autoincrement().primaryKey(),
  openId: varchar("openId", { length: 64 }).notNull().unique(),
  name: text("name"),
  email: varchar("email", { length: 320 }),
  phone: varchar("phone", { length: 20 }),
  role: mysqlEnum("role", ["author", "admin", "school_admin", "teacher", "student", "parent"]).default("student").notNull(),
  schoolId: int("schoolId").references(() => schools.id),
  isActive: boolean("isActive").default(true),
  lastSignedIn: timestamp("lastSignedIn").defaultNow().notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

// Schools Table
export const schools = mysqlTable("schools", {
  id: int("id").autoincrement().primaryKey(),
  name: varchar("name", { length: 255 }).notNull(),
  code: varchar("code", { length: 6 }).notNull().unique(),
  type: mysqlEnum("type", ["primary", "secondary"]).notNull(),
  motto: text("motto"),
  vision: text("vision"),
  logoUrl: varchar("logoUrl", { length: 500 }),
  principalName: varchar("principalName", { length: 255 }),
  principalPhone: varchar("principalPhone", { length: 20 }),
  district: varchar("district", { length: 100 }),
  ownership: mysqlEnum("ownership", ["government", "private", "religious", "ngo"]),
  subscriptionPlan: mysqlEnum("subscriptionPlan", ["free", "basic", "professional", "enterprise"]),
  isActive: boolean("isActive").default(true),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

// Classes Table
export const classes = mysqlTable("classes", {
  id: int("id").autoincrement().primaryKey(),
  schoolId: int("schoolId").notNull().references(() => schools.id),
  name: varchar("name", { length: 50 }).notNull(), // e.g., "S1", "P3", "S5A"
  level: mysqlEnum("level", ["kindergarten", "lower_primary", "upper_primary", "o_level", "a_level"]).notNull(),
  stream: varchar("stream", { length: 10 }), // e.g., "A", "B", "Science", "Arts"
  classTeacherId: int("classTeacherId").references(() => users.id),
  totalStudents: int("totalStudents").default(0),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

// Students Table
export const students = mysqlTable("students", {
  id: int("id").autoincrement().primaryKey(),
  schoolId: int("schoolId").notNull().references(() => schools.id),
  userId: int("userId").notNull().references(() => users.id),
  classId: int("classId").notNull().references(() => classes.id),
  admissionNumber: varchar("admissionNumber", { length: 50 }).notNull(),
  dateOfBirth: varchar("dateOfBirth", { length: 10 }), // YYYY-MM-DD
  gender: mysqlEnum("gender", ["male", "female"]),
  photoUrl: varchar("photoUrl", { length: 500 }),
  healthStatus: text("healthStatus"),
  parentName: varchar("parentName", { length: 255 }),
  parentPhone: varchar("parentPhone", { length: 20 }),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

// Teachers Table
export const teachers = mysqlTable("teachers", {
  id: int("id").autoincrement().primaryKey(),
  schoolId: int("schoolId").notNull().references(() => schools.id),
  userId: int("userId").notNull().references(() => users.id),
  employeeId: varchar("employeeId", { length: 50 }).notNull(),
  qualification: text("qualification"),
  position: mysqlEnum("position", ["class_teacher", "dos", "regular_teacher", "head_teacher"]),
  assignedClasses: json("assignedClasses"), // JSON array of class IDs
  assignedSubjects: json("assignedSubjects"), // JSON array of subject IDs
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

// Subjects Table
export const subjects = mysqlTable("subjects", {
  id: int("id").autoincrement().primaryKey(),
  schoolId: int("schoolId").notNull().references(() => schools.id),
  name: varchar("name", { length: 100 }).notNull(),
  code: varchar("code", { length: 10 }).notNull(),
  level: mysqlEnum("level", ["kindergarten", "lower_primary", "upper_primary", "o_level", "a_level"]).notNull(),
  isCore: boolean("isCore").default(true),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});

// Exam Types Table
export const examTypes = mysqlTable("examTypes", {
  id: int("id").autoincrement().primaryKey(),
  schoolId: int("schoolId").notNull().references(() => schools.id),
  name: varchar("name", { length: 100 }).notNull(),
  type: mysqlEnum("type", ["mid_term", "end_of_term", "formative", "summative"]).notNull(),
  term: int("term"), // 1, 2, 3
  year: int("year"),
  startDate: varchar("startDate", { length: 10 }), // YYYY-MM-DD
  endDate: varchar("endDate", { length: 10 }),
  isOptional: boolean("isOptional").default(false), // Mid-term can be optional
  isMandatory: boolean("isMandatory").default(true), // End-of-term is always mandatory
  isActive: boolean("isActive").default(false),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});

// Marks Table - Stores all exam marks
export const marks = mysqlTable("marks", {
  id: int("id").autoincrement().primaryKey(),
  schoolId: int("schoolId").notNull().references(() => schools.id),
  studentId: int("studentId").notNull().references(() => students.id),
  subjectId: int("subjectId").notNull().references(() => subjects.id),
  examTypeId: int("examTypeId").notNull().references(() => examTypes.id),
  classId: int("classId").notNull().references(() => classes.id),
  teacherId: int("teacherId").notNull().references(() => teachers.id),
  
  // Paper-based marks
  paper1Mark: decimal("paper1Mark", { precision: 5, scale: 2 }), // 0-100
  paper2Mark: decimal("paper2Mark", { precision: 5, scale: 2 }), // 0-100
  averageScore: decimal("averageScore", { precision: 5, scale: 2 }), // (paper1 + paper2) / 2
  
  // Grading
  grade: mysqlEnum("grade", ["A", "B", "C", "D", "E"]),
  remark: varchar("remark", { length: 100 }), // Exceptional, Outstanding, etc.
  
  // Teacher comments
  teacherComment: text("teacherComment"),
  
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

// Timetable Table - Supports multiple timetable types
export const timetables = mysqlTable("timetables", {
  id: int("id").autoincrement().primaryKey(),
  schoolId: int("schoolId").notNull().references(() => schools.id),
  classId: int("classId").notNull().references(() => classes.id),
  type: mysqlEnum("type", ["academic", "mid_term_exam", "end_of_term_exam"]).notNull(),
  
  // Day and time
  dayOfWeek: mysqlEnum("dayOfWeek", ["monday", "tuesday", "wednesday", "thursday", "friday", "saturday"]),
  startTime: varchar("startTime", { length: 5 }), // HH:MM
  endTime: varchar("endTime", { length: 5 }), // HH:MM
  
  // Subject and teacher
  subjectId: int("subjectId").references(() => subjects.id),
  teacherId: int("teacherId").references(() => teachers.id),
  room: varchar("room", { length: 50 }),
  
  // For exam timetables
  examTypeId: int("examTypeId").references(() => examTypes.id),
  invigilators: json("invigilators"), // JSON array of teacher IDs
  
  isActive: boolean("isActive").default(true),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

// Attendance Table
export const attendance = mysqlTable("attendance", {
  id: int("id").autoincrement().primaryKey(),
  schoolId: int("schoolId").notNull().references(() => schools.id),
  studentId: int("studentId").notNull().references(() => students.id),
  classId: int("classId").notNull().references(() => classes.id),
  date: varchar("date", { length: 10 }).notNull(), // YYYY-MM-DD
  status: mysqlEnum("status", ["present", "absent", "late", "excused"]).default("present"),
  recordedBy: int("recordedBy").references(() => teachers.id),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});

// Syllabus Table
export const syllabus = mysqlTable("syllabus", {
  id: int("id").autoincrement().primaryKey(),
  schoolId: int("schoolId").notNull().references(() => schools.id),
  subjectId: int("subjectId").notNull().references(() => subjects.id),
  classId: int("classId").notNull().references(() => classes.id),
  topics: json("topics"), // JSON array of topics with subtopics
  completionPercentage: decimal("completionPercentage", { precision: 5, scale: 2 }).default("0"),
  lastUpdated: timestamp("lastUpdated").defaultNow().onUpdateNow(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});

// Report Cards Table - Stores generated report cards
export const reportCards = mysqlTable("reportCards", {
  id: int("id").autoincrement().primaryKey(),
  schoolId: int("schoolId").notNull().references(() => schools.id),
  studentId: int("studentId").notNull().references(() => students.id),
  examTypeId: int("examTypeId").notNull().references(() => examTypes.id),
  classId: int("classId").notNull().references(() => classes.id),
  
  // Report card data
  htmlContent: text("htmlContent"), // Stores HTML of report card
  pdfUrl: varchar("pdfUrl", { length: 500 }), // URL to stored PDF
  
  // Summary
  averageScore: decimal("averageScore", { precision: 5, scale: 2 }),
  position: int("position"), // Class position/rank
  totalSubjects: int("totalSubjects"),
  
  // Principal/Admin comments
  principalComment: text("principalComment"),
  
  generatedAt: timestamp("generatedAt").defaultNow().notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});

// Types for TypeScript
export type User = typeof users.$inferSelect;
export type InsertUser = typeof users.$inferInsert;

export type School = typeof schools.$inferSelect;
export type InsertSchool = typeof schools.$inferInsert;

export type Student = typeof students.$inferSelect;
export type InsertStudent = typeof students.$inferInsert;

export type Teacher = typeof teachers.$inferSelect;
export type InsertTeacher = typeof teachers.$inferInsert;

export type Mark = typeof marks.$inferSelect;
export type InsertMark = typeof marks.$inferInsert;

export type Timetable = typeof timetables.$inferSelect;
export type InsertTimetable = typeof timetables.$inferInsert;

export type ExamType = typeof examTypes.$inferSelect;
export type InsertExamType = typeof examTypes.$inferInsert;

export type ReportCard = typeof reportCards.$inferSelect;
export type InsertReportCard = typeof reportCards.$inferInsert;
