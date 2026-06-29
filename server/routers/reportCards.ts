/**
 * Report Cards Router - Generate, retrieve, and manage report cards
 */

import { router, protectedProcedure } from "../_core/trpc";
import { z } from "zod";
import { getDb } from "../db";
import { reportCards, marks, students, subjects, examTypes, classes } from "../../drizzle/schema";
import { eq, and } from "drizzle-orm";

export const reportCardsRouter = router({
  /**
   * Get report card for a student
   */
  getByStudent: protectedProcedure
    .input(z.object({ studentId: z.number(), examTypeId: z.number() }))
    .query(async ({ input, ctx }) => {
      const db = await getDb();
      if (!db) throw new Error("Database not available");

      const reportCard = await db
        .select()
        .from(reportCards)
        .where(and(eq(reportCards.studentId, input.studentId), eq(reportCards.examTypeId, input.examTypeId)))
        .execute();

      if (!reportCard[0]) {
        // Generate report card if not exists
        return await generateReportCard(input.studentId, input.examTypeId, ctx.user.schoolId || 0);
      }

      return reportCard[0];
    }),

  /**
   * Get all report cards for a class
   */
  getByClass: protectedProcedure
    .input(z.object({ classId: z.number(), examTypeId: z.number() }))
    .query(async ({ input, ctx }) => {
      const db = await getDb();
      if (!db) throw new Error("Database not available");

      const cards = await db
        .select()
        .from(reportCards)
        .where(and(eq(reportCards.classId, input.classId), eq(reportCards.examTypeId, input.examTypeId)))
        .execute();

      return cards;
    }),

  /**
   * Generate report card for a student
   */
  generate: protectedProcedure
    .input(z.object({ studentId: z.number(), examTypeId: z.number() }))
    .mutation(async ({ input, ctx }) => {
      if (!ctx.user.schoolId) throw new Error("User not associated with school");

      return await generateReportCard(input.studentId, input.examTypeId, ctx.user.schoolId);
    }),

  /**
   * Generate report cards for entire class
   */
  generateClass: protectedProcedure
    .input(z.object({ classId: z.number(), examTypeId: z.number() }))
    .mutation(async ({ input, ctx }) => {
      if (!ctx.user.schoolId) throw new Error("User not associated with school");

      const db = await getDb();
      if (!db) throw new Error("Database not available");

      // Get all students in class
      const classStudents = await db
        .select()
        .from(students)
        .where(and(eq(students.classId, input.classId), eq(students.schoolId, ctx.user.schoolId)))
        .execute();

      let generated = 0;
      let failed = 0;

      for (const student of classStudents) {
        try {
          await generateReportCard(student.id, input.examTypeId, ctx.user.schoolId);
          generated++;
        } catch (error) {
          failed++;
          console.error(`Failed to generate report card for student ${student.id}:`, error);
        }
      }

      return { generated, failed, total: classStudents.length };
    }),

  /**
   * Update report card with principal comments
   */
  updateComments: protectedProcedure
    .input(z.object({ id: z.number(), principalComment: z.string() }))
    .mutation(async ({ input, ctx }) => {
      const db = await getDb();
      if (!db) throw new Error("Database not available");

      // Verify authorization
      const card = await db.select().from(reportCards).where(eq(reportCards.id, input.id)).execute();

      if (!card[0] || card[0].schoolId !== ctx.user.schoolId) {
        throw new Error("Unauthorized");
      }

      await db
        .update(reportCards)
        .set({ principalComment: input.principalComment })
        .where(eq(reportCards.id, input.id))
        .execute();

      return { success: true };
    }),

  /**
   * Delete report card
   */
  delete: protectedProcedure
    .input(z.object({ id: z.number() }))
    .mutation(async ({ input, ctx }) => {
      const db = await getDb();
      if (!db) throw new Error("Database not available");

      // Verify authorization
      const card = await db.select().from(reportCards).where(eq(reportCards.id, input.id)).execute();

      if (!card[0] || card[0].schoolId !== ctx.user.schoolId) {
        throw new Error("Unauthorized");
      }

      await db.delete(reportCards).where(eq(reportCards.id, input.id)).execute();

      return { success: true };
    }),
});

/**
 * Helper function to generate report card
 */
async function generateReportCard(studentId: number, examTypeId: number, schoolId: number) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");

  // Get student info
  const student = await db.select().from(students).where(eq(students.id, studentId)).execute();

  if (!student[0]) throw new Error("Student not found");

  // Get student marks for this exam
  const studentMarks = await db
    .select()
    .from(marks)
    .where(and(eq(marks.studentId, studentId), eq(marks.examTypeId, examTypeId)))
    .execute();

  if (studentMarks.length === 0) throw new Error("No marks found for this student");

  // Calculate average and position
  const averages = studentMarks.map((m) => parseFloat(m.averageScore as any) || 0);
  const averageScore = averages.reduce((a, b) => a + b, 0) / averages.length;

  // Get class info for position calculation
  const classInfo = await db.select().from(classes).where(eq(classes.id, student[0].classId)).execute();

  // Get all students in class for position
  const classMarks = await db
    .select()
    .from(marks)
    .where(and(eq(marks.classId, student[0].classId), eq(marks.examTypeId, examTypeId)))
    .execute();

  // Calculate position
  const classAverages = classMarks.map((m) => ({
    studentId: m.studentId,
    average: parseFloat(m.averageScore as any) || 0,
  }));

  classAverages.sort((a, b) => b.average - a.average);
  const position = classAverages.findIndex((m) => m.studentId === studentId) + 1;

  // Generate HTML content (simplified)
  const htmlContent = `
    <html>
      <head>
        <title>Report Card</title>
        <style>
          body { font-family: Arial, sans-serif; padding: 20px; }
          .header { text-align: center; margin-bottom: 20px; }
          .student-info { margin-bottom: 20px; }
          .marks-table { width: 100%; border-collapse: collapse; margin-bottom: 20px; }
          .marks-table th, .marks-table td { border: 1px solid #000; padding: 8px; text-align: left; }
          .marks-table th { background-color: #f0f0f0; }
          .summary { margin-top: 20px; }
        </style>
      </head>
      <body>
        <div class="header">
          <h2>Report Card</h2>
          <p>Term: ${examTypeId}</p>
        </div>
        <div class="student-info">
          <p><strong>Student:</strong> ${student[0].admissionNumber}</p>
          <p><strong>Class:</strong> ${classInfo[0]?.name || 'N/A'}</p>
          <p><strong>Position:</strong> ${position}</p>
        </div>
        <table class="marks-table">
          <thead>
            <tr>
              <th>Subject</th>
              <th>Paper 1</th>
              <th>Paper 2</th>
              <th>Average</th>
              <th>Grade</th>
            </tr>
          </thead>
          <tbody>
            ${studentMarks
              .map(
                (m) => `
              <tr>
                <td>${m.subjectId}</td>
                <td>${m.paper1Mark}</td>
                <td>${m.paper2Mark}</td>
                <td>${m.averageScore}</td>
                <td>${m.grade}</td>
              </tr>
            `
              )
              .join("")}
          </tbody>
        </table>
        <div class="summary">
          <p><strong>Average Score:</strong> ${averageScore.toFixed(2)}</p>
          <p><strong>Total Subjects:</strong> ${studentMarks.length}</p>
        </div>
      </body>
    </html>
  `;

  // Check if report card exists
  const existing = await db
    .select()
    .from(reportCards)
    .where(and(eq(reportCards.studentId, studentId), eq(reportCards.examTypeId, examTypeId)))
    .execute();

  if (existing.length > 0) {
    // Update
    await db
      .update(reportCards)
      .set({
        htmlContent,
        averageScore: averageScore.toString(),
        position,
        totalSubjects: studentMarks.length,
      })
      .where(eq(reportCards.id, existing[0].id))
      .execute();

    return existing[0];
  } else {
    // Create
    await db
      .insert(reportCards)
      .values({
        schoolId,
        studentId,
        examTypeId,
        classId: student[0].classId,
        htmlContent,
        averageScore: averageScore.toString(),
        position,
        totalSubjects: studentMarks.length,
      })
      .execute();

    return { success: true, averageScore, position };
  }
}
