/**
 * Marks Router - Marks entry, grading, and result management
 */

import { router, protectedProcedure } from "../_core/trpc";
import { z } from "zod";
import { getDb } from "../db";
import { marks, students, subjects, examTypes } from "../../drizzle/schema";
import { eq, and } from "drizzle-orm";
import { calculateGrade } from "../../shared/gradingScale";

export const marksRouter = router({
  /**
   * Get marks for a student
   */
  getByStudent: protectedProcedure
    .input(z.object({ studentId: z.number(), examTypeId: z.number().optional() }))
    .query(async ({ input, ctx }) => {
      const db = await getDb();
      if (!db) throw new Error("Database not available");

      let conditions = [eq(marks.studentId, input.studentId)];

      if (input.examTypeId) {
        conditions.push(eq(marks.examTypeId, input.examTypeId));
      }

      const studentMarks = await db
        .select()
        .from(marks)
        .where(and(...conditions))
        .execute();

      return studentMarks;
    }),

  /**
   * Get marks for a class
   */
  getByClass: protectedProcedure
    .input(z.object({ classId: z.number(), examTypeId: z.number(), subjectId: z.number().optional() }))
    .query(async ({ input, ctx }) => {
      const db = await getDb();
      if (!db) throw new Error("Database not available");

      let conditions = [and(eq(marks.classId, input.classId), eq(marks.examTypeId, input.examTypeId))];

      if (input.subjectId) {
        conditions.push(eq(marks.subjectId, input.subjectId));
      }

      const classMarks = await db
        .select()
        .from(marks)
        .where(and(...conditions))
        .execute();

      return classMarks;
    }),

  /**
   * Enter marks for a student
   */
  enter: protectedProcedure
    .input(
      z.object({
        studentId: z.number(),
        subjectId: z.number(),
        examTypeId: z.number(),
        classId: z.number(),
        paper1Mark: z.number().min(0).max(100),
        paper2Mark: z.number().min(0).max(100),
        teacherComment: z.string().optional(),
      })
    )
    .mutation(async ({ input, ctx }) => {
      if (!ctx.user.schoolId) throw new Error("User not associated with school");

      const db = await getDb();
      if (!db) throw new Error("Database not available");

      // Check if teacher is authorized for this subject
      if (ctx.user.role === "teacher") {
        // Verify teacher teaches this subject
        // This would require checking teacher's assignedSubjects
      }

      // Calculate average score
      const averageScore = (input.paper1Mark + input.paper2Mark) / 2;

      // Calculate grade
      const grade = calculateGrade(averageScore);

      // Check if marks already exist
      const existing = await db
        .select()
        .from(marks)
        .where(
          and(
            eq(marks.studentId, input.studentId),
            eq(marks.subjectId, input.subjectId),
            eq(marks.examTypeId, input.examTypeId)
          )
        )
        .execute();

      if (existing.length > 0) {
        // Update existing marks
        await db
          .update(marks)
          .set({
            paper1Mark: input.paper1Mark.toString(),
            paper2Mark: input.paper2Mark.toString(),
            averageScore: averageScore.toString(),
            grade: grade,
            teacherComment: input.teacherComment,
          })
          .where(eq(marks.id, existing[0].id))
          .execute();
      } else {
        // Insert new marks
        await db
          .insert(marks)
          .values({
            schoolId: ctx.user.schoolId,
            studentId: input.studentId,
            subjectId: input.subjectId,
            examTypeId: input.examTypeId,
            classId: input.classId,
            teacherId: ctx.user.id || 0,
            paper1Mark: input.paper1Mark.toString(),
            paper2Mark: input.paper2Mark.toString(),
            averageScore: averageScore.toString(),
            grade: grade,
            teacherComment: input.teacherComment,
          })
          .execute();
      }

      return { success: true, averageScore, grade };
    }),

  /**
   * Bulk enter marks
   */
  bulkEnter: protectedProcedure
    .input(
      z.object({
        examTypeId: z.number(),
        subjectId: z.number(),
        classId: z.number(),
        marks: z.array(
          z.object({
            studentId: z.number(),
            paper1Mark: z.number().min(0).max(100),
            paper2Mark: z.number().min(0).max(100),
            teacherComment: z.string().optional(),
          })
        ),
      })
    )
    .mutation(async ({ input, ctx }) => {
      if (!ctx.user.schoolId) throw new Error("User not associated with school");

      const db = await getDb();
      if (!db) throw new Error("Database not available");

      let entered = 0;
      let failed = 0;

      for (const mark of input.marks) {
        try {
          const averageScore = (mark.paper1Mark + mark.paper2Mark) / 2;
          const grade = calculateGrade(averageScore);

          // Check if marks exist
          const existing = await db
            .select()
            .from(marks)
            .where(
              and(
                eq(marks.studentId, mark.studentId),
                eq(marks.subjectId, input.subjectId),
                eq(marks.examTypeId, input.examTypeId)
              )
            )
            .execute();

          if (existing.length > 0) {
            await db
              .update(marks)
              .set({
                paper1Mark: mark.paper1Mark.toString(),
                paper2Mark: mark.paper2Mark.toString(),
                averageScore: averageScore.toString(),
                grade: grade,
                teacherComment: mark.teacherComment,
              })
              .where(eq(marks.id, existing[0].id))
              .execute();
          } else {
            await db
              .insert(marks)
              .values({
                schoolId: ctx.user.schoolId,
                studentId: mark.studentId,
                subjectId: input.subjectId,
                examTypeId: input.examTypeId,
                classId: input.classId,
                teacherId: ctx.user.id || 0,
                paper1Mark: mark.paper1Mark.toString(),
                paper2Mark: mark.paper2Mark.toString(),
                averageScore: averageScore.toString(),
                grade: grade,
                teacherComment: mark.teacherComment,
              })
              .execute();
          }

          entered++;
        } catch (error) {
          failed++;
          console.error(`Failed to enter marks for student ${mark.studentId}:`, error);
        }
      }

      return { entered, failed, total: input.marks.length };
    }),

  /**
   * Get marks statistics for a class
   */
  getClassStats: protectedProcedure
    .input(z.object({ classId: z.number(), examTypeId: z.number() }))
    .query(async ({ input, ctx }) => {
      const db = await getDb();
      if (!db) throw new Error("Database not available");

      const classMarks = await db
        .select()
        .from(marks)
        .where(and(eq(marks.classId, input.classId), eq(marks.examTypeId, input.examTypeId)))
        .execute();

      if (classMarks.length === 0) {
        return { average: 0, highest: 0, lowest: 0, gradeDistribution: {} };
      }

      const averages = classMarks.map((m) => parseFloat(m.averageScore as any) || 0);
      const average = averages.reduce((a, b) => a + b, 0) / averages.length;
      const highest = Math.max(...averages);
      const lowest = Math.min(...averages);

      // Grade distribution
      const gradeDistribution: Record<string, number> = { A: 0, B: 0, C: 0, D: 0, E: 0 };
      classMarks.forEach((m) => {
        if (m.grade) gradeDistribution[m.grade]++;
      });

      return { average, highest, lowest, gradeDistribution, totalMarked: classMarks.length };
    }),

  /**
   * Delete mark entry
   */
  delete: protectedProcedure
    .input(z.object({ id: z.number() }))
    .mutation(async ({ input, ctx }) => {
      const db = await getDb();
      if (!db) throw new Error("Database not available");

      // Verify authorization
      const mark = await db.select().from(marks).where(eq(marks.id, input.id)).execute();

      if (!mark[0] || mark[0].schoolId !== ctx.user.schoolId) {
        throw new Error("Unauthorized");
      }

      await db.delete(marks).where(eq(marks.id, input.id)).execute();

      return { success: true };
    }),
});
