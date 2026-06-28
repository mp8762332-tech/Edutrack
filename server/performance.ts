/**
 * Performance Optimization Module
 * Handles database indexing, lazy loading, and caching strategies
 * Target: <100MB mobile, <500MB desktop
 */

import { getDb } from "./db";
import { sql } from "drizzle-orm";

/**
 * Database Indexes for Performance
 * These should be created during migration
 */
export const RECOMMENDED_INDEXES = [
  // Schools
  "CREATE INDEX IF NOT EXISTS idx_schools_code ON schools(code)",
  "CREATE INDEX IF NOT EXISTS idx_schools_owner_id ON schools(owner_id)",

  // Users
  "CREATE INDEX IF NOT EXISTS idx_users_school_id ON users(school_id)",
  "CREATE INDEX IF NOT EXISTS idx_users_role ON users(role)",
  "CREATE INDEX IF NOT EXISTS idx_users_email ON users(email)",

  // Classes
  "CREATE INDEX IF NOT EXISTS idx_classes_school_id ON classes(school_id)",
  "CREATE INDEX IF NOT EXISTS idx_classes_level ON classes(level)",

  // Students
  "CREATE INDEX IF NOT EXISTS idx_students_class_id ON students(class_id)",
  "CREATE INDEX IF NOT EXISTS idx_students_school_id ON students(school_id)",
  "CREATE INDEX IF NOT EXISTS idx_students_admission_number ON students(admission_number)",

  // Teachers
  "CREATE INDEX IF NOT EXISTS idx_teachers_school_id ON teachers(school_id)",
  "CREATE INDEX IF NOT EXISTS idx_teachers_user_id ON teachers(user_id)",

  // Marks
  "CREATE INDEX IF NOT EXISTS idx_marks_student_id ON marks(student_id)",
  "CREATE INDEX IF NOT EXISTS idx_marks_subject_id ON marks(subject_id)",
  "CREATE INDEX IF NOT EXISTS idx_marks_exam_type ON marks(exam_type)",
  "CREATE INDEX IF NOT EXISTS idx_marks_created_at ON marks(created_at)",

  // Report Cards
  "CREATE INDEX IF NOT EXISTS idx_report_cards_student_id ON report_cards(student_id)",
  "CREATE INDEX IF NOT EXISTS idx_report_cards_class_id ON report_cards(class_id)",
  "CREATE INDEX IF NOT EXISTS idx_report_cards_term ON report_cards(term)",

  // Attendance
  "CREATE INDEX IF NOT EXISTS idx_attendance_student_id ON attendance(student_id)",
  "CREATE INDEX IF NOT EXISTS idx_attendance_class_id ON attendance(class_id)",
  "CREATE INDEX IF NOT EXISTS idx_attendance_date ON attendance(date)",

  // Timetables
  "CREATE INDEX IF NOT EXISTS idx_timetables_class_id ON timetables(class_id)",
  "CREATE INDEX IF NOT EXISTS idx_timetables_type ON timetables(type)",
];

/**
 * Apply all recommended indexes
 */
export async function applyPerformanceIndexes(): Promise<void> {
  try {
    const db = await getDb();
    if (!db) {
      console.warn("[Performance] Database not available");
      return;
    }
    for (const indexSQL of RECOMMENDED_INDEXES) {
      await db.execute(sql.raw(indexSQL));
    }
    console.log("✅ Performance indexes applied successfully");
  } catch (error) {
    console.error("❌ Error applying performance indexes:", error);
  }
}

/**
 * Pagination helper for lazy loading
 */
export interface PaginationParams {
  page: number;
  limit: number;
}

export function getPaginationOffset(params: PaginationParams): { offset: number; limit: number } {
  const limit = Math.min(params.limit, 100); // Max 100 per page
  const offset = (params.page - 1) * limit;
  return { offset, limit };
}

/**
 * Cache key generator
 */
export function generateCacheKey(...parts: (string | number)[]): string {
  return parts.join(":");
}

/**
 * Cache TTL constants (in seconds)
 */
export const CACHE_TTL = {
  SHORT: 5 * 60, // 5 minutes
  MEDIUM: 30 * 60, // 30 minutes
  LONG: 60 * 60, // 1 hour
  VERY_LONG: 24 * 60 * 60, // 24 hours
};

/**
 * Query result size estimation
 */
export interface QueryMetrics {
  queryName: string;
  rowCount: number;
  estimatedSizeKB: number;
  executionTimeMs: number;
}

/**
 * Lazy load students for a class
 */
export async function lazyLoadClassStudents(
  classId: number,
  page: number = 1,
  limit: number = 50
): Promise<{ students: any[]; total: number; hasMore: boolean }> {
  const { offset } = getPaginationOffset({ page, limit });
  const db = await getDb();
  if (!db) throw new Error("Database not available");

  // Get total count
  const totalResult = await db.execute(sql`SELECT COUNT(*) as count FROM students WHERE class_id = ${classId}`);
  const total = (totalResult[0] as any)?.count || 0;

  // Get paginated results
  const students = await db.execute(
    sql`
      SELECT id, name, admission_number, class_id, created_at
      FROM students
      WHERE class_id = ${classId}
      ORDER BY name ASC
      LIMIT ${limit} OFFSET ${offset}
    `
  );

  return {
    students,
    total,
    hasMore: offset + limit < total,
  };
}

/**
 * Lazy load marks for a student
 */
export async function lazyLoadStudentMarks(
  studentId: number,
  examType?: string,
  page: number = 1,
  limit: number = 50
): Promise<{ marks: any[]; total: number; hasMore: boolean }> {
  const { offset } = getPaginationOffset({ page, limit });
  const db = await getDb();
  if (!db) throw new Error("Database not available");

  // Build query
  let countQuery = sql`SELECT COUNT(*) as count FROM marks WHERE student_id = ${studentId}`;
  let dataQuery = sql`
    SELECT id, student_id, subject_id, paper1_mark, paper2_mark, average_score, grade, exam_type, created_at
    FROM marks
    WHERE student_id = ${studentId}
  `;

  if (examType) {
    countQuery = sql`SELECT COUNT(*) as count FROM marks WHERE student_id = ${studentId} AND exam_type = ${examType}`;
    dataQuery = sql`
      SELECT id, student_id, subject_id, paper1_mark, paper2_mark, average_score, grade, exam_type, created_at
      FROM marks
      WHERE student_id = ${studentId} AND exam_type = ${examType}
    `;
  }

  // Get total count
  const totalResult = await db.execute(countQuery);
  const total = (totalResult[0] as any)?.count || 0;

  // Get paginated results
  const marks = await db.execute(sql`${dataQuery} ORDER BY created_at DESC LIMIT ${limit} OFFSET ${offset}`);

  return {
    marks,
    total,
    hasMore: offset + limit < total,
  };
}

/**
 * Lazy load attendance records
 */
export async function lazyLoadAttendance(
  classId: number,
  startDate?: string,
  page: number = 1,
  limit: number = 50
): Promise<{ records: any[]; total: number; hasMore: boolean }> {
  const { offset } = getPaginationOffset({ page, limit });
  const db = await getDb();
  if (!db) throw new Error("Database not available");

  // Build query
  let countQuery = sql`SELECT COUNT(*) as count FROM attendance WHERE class_id = ${classId}`;
  let dataQuery = sql`
    SELECT id, student_id, class_id, date, status, created_at
    FROM attendance
    WHERE class_id = ${classId}
  `;

  if (startDate) {
    countQuery = sql`SELECT COUNT(*) as count FROM attendance WHERE class_id = ${classId} AND date >= ${startDate}`;
    dataQuery = sql`
      SELECT id, student_id, class_id, date, status, created_at
      FROM attendance
      WHERE class_id = ${classId} AND date >= ${startDate}
    `;
  }

  // Get total count
  const totalResult = await db.execute(countQuery);
  const total = (totalResult[0] as any)?.count || 0;

  // Get paginated results
  const records = await db.execute(sql`${dataQuery} ORDER BY date DESC LIMIT ${limit} OFFSET ${offset}`);

  return {
    records,
    total,
    hasMore: offset + limit < total,
  };
}

/**
 * Batch load data to reduce N+1 queries
 */
export async function batchLoadStudentMarks(studentIds: number[]): Promise<Map<number, any[]>> {
  if (studentIds.length === 0) return new Map();
  const db = await getDb();
  if (!db) throw new Error("Database not available");

  const marks = await db.execute(
    sql`
      SELECT id, student_id, subject_id, paper1_mark, paper2_mark, average_score, grade, exam_type
      FROM marks
      WHERE student_id IN (${studentIds.join(",")})
      ORDER BY student_id, created_at DESC
    `
  );

  const result = new Map<number, any[]>();
  marks.forEach((mark: any) => {
    if (!result.has(mark.student_id)) {
      result.set(mark.student_id, []);
    }
    result.get(mark.student_id)!.push(mark);
  });

  return result;
}

/**
 * Batch load report cards
 */
export async function batchLoadReportCards(studentIds: number[]): Promise<Map<number, any>> {
  if (studentIds.length === 0) return new Map();
  const db = await getDb();
  if (!db) throw new Error("Database not available");

  const cards = await db.execute(
    sql`
      SELECT id, student_id, class_id, term, year, average_score, position, generated_at
      FROM report_cards
      WHERE student_id IN (${studentIds.join(",")})
      ORDER BY student_id, term DESC
    `
  );

  const result = new Map<number, any>();
  cards.forEach((card: any) => {
    if (!result.has(card.student_id)) {
      result.set(card.student_id, card);
    }
  });

  return result;
}

/**
 * Optimize query by selecting only needed columns
 */
export function selectOptimizedColumns(entity: string): string[] {
  const columnMaps: Record<string, string[]> = {
    student: ["id", "name", "admission_number", "class_id", "created_at"],
    teacher: ["id", "name", "subject_id", "school_id", "user_id"],
    mark: ["id", "student_id", "subject_id", "paper1_mark", "paper2_mark", "average_score", "grade"],
    attendance: ["id", "student_id", "class_id", "date", "status"],
    reportCard: ["id", "student_id", "class_id", "term", "year", "average_score", "position"],
  };

  return columnMaps[entity] || [];
}

/**
 * Database query profiling
 */
export class QueryProfiler {
  private static queries: QueryMetrics[] = [];

  static recordQuery(metrics: QueryMetrics): void {
    this.queries.push(metrics);
    if (this.queries.length > 1000) {
      this.queries = this.queries.slice(-500); // Keep last 500
    }
  }

  static getMetrics(): QueryMetrics[] {
    return this.queries;
  }

  static getSlowQueries(thresholdMs: number = 100): QueryMetrics[] {
    return this.queries.filter((q) => q.executionTimeMs > thresholdMs);
  }

  static getSummary(): {
    totalQueries: number;
    averageTimeMs: number;
    slowestQueryMs: number;
    totalTimeMs: number;
  } {
    if (this.queries.length === 0) {
      return { totalQueries: 0, averageTimeMs: 0, slowestQueryMs: 0, totalTimeMs: 0 };
    }

    const totalTimeMs = this.queries.reduce((sum, q) => sum + q.executionTimeMs, 0);
    const slowestQueryMs = Math.max(...this.queries.map((q) => q.executionTimeMs));

    return {
      totalQueries: this.queries.length,
      averageTimeMs: Math.round(totalTimeMs / this.queries.length),
      slowestQueryMs,
      totalTimeMs,
    };
  }

  static clear(): void {
    this.queries = [];
  }
}

/**
 * Memory usage estimation
 */
export function estimateMemoryUsage(rowCount: number, avgRowSizeBytes: number = 500): string {
  const totalBytes = rowCount * avgRowSizeBytes;
  const mb = totalBytes / (1024 * 1024);
  const gb = mb / 1024;

  if (gb >= 1) return `${gb.toFixed(2)} GB`;
  if (mb >= 1) return `${mb.toFixed(2)} MB`;
  return `${(totalBytes / 1024).toFixed(2)} KB`;
}
