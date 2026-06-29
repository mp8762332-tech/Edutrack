/**
 * Students Router - Student management, enrollment, and records
 */

import { router, protectedProcedure } from "../_core/trpc";
import { z } from "zod";
import { getDb } from "../db";
import { students, users, classes } from "../../drizzle/schema";
import { eq, and } from "drizzle-orm";

export const studentsRouter = router({
  /**
   * Get all students in school
   */
  list: protectedProcedure
    .input(z.object({ classId: z.number().optional() }))
    .query(async ({ input, ctx }) => {
      if (!ctx.user.schoolId) throw new Error("User not associated with school");

      const db = await getDb();
      if (!db) throw new Error("Database not available");

      let conditions = [eq(students.schoolId, ctx.user.schoolId)];

      if (input.classId) {
        conditions.push(eq(students.classId, input.classId));
      }

      const studentList = await db
        .select()
        .from(students)
        .where(and(...conditions))
        .execute();
      return studentList;
    }),

  /**
   * Get student by ID
   */
  getById: protectedProcedure
    .input(z.object({ id: z.number() }))
    .query(async ({ input, ctx }) => {
      const db = await getDb();
      if (!db) throw new Error("Database not available");

      const student = await db
        .select()
        .from(students)
        .where(eq(students.id, input.id))
        .execute();

      if (!student[0]) throw new Error("Student not found");

      // Check authorization
      if (ctx.user.schoolId !== student[0].schoolId) {
        throw new Error("Unauthorized");
      }

      return student[0];
    }),

  /**
   * Create new student
   */
  create: protectedProcedure
    .input(
      z.object({
        classId: z.number(),
        admissionNumber: z.string(),
        dateOfBirth: z.string().optional(),
        gender: z.enum(["male", "female"]).optional(),
        parentName: z.string().optional(),
        parentPhone: z.string().optional(),
        healthStatus: z.string().optional(),
      })
    )
    .mutation(async ({ input, ctx }) => {
      if (!ctx.user.schoolId) throw new Error("User not associated with school");

      const db = await getDb();
      if (!db) throw new Error("Database not available");

      // Create user account for student
      const newUser = await db
        .insert(users)
        .values({
          openId: `student_${input.admissionNumber}_${Date.now()}`,
          role: "student",
          schoolId: ctx.user.schoolId,
          isActive: true,
        })
        .execute();

      // Create student record
      await db
        .insert(students)
        .values({
          schoolId: ctx.user.schoolId,
          userId: (newUser as any).insertId || 1,
          classId: input.classId,
          admissionNumber: input.admissionNumber,
          dateOfBirth: input.dateOfBirth,
          gender: input.gender,
          parentName: input.parentName,
          parentPhone: input.parentPhone,
          healthStatus: input.healthStatus,
        })
        .execute();

      return { success: true };
    }),

  /**
   * Update student
   */
  update: protectedProcedure
    .input(
      z.object({
        id: z.number(),
        classId: z.number().optional(),
        dateOfBirth: z.string().optional(),
        gender: z.enum(["male", "female"]).optional(),
        parentName: z.string().optional(),
        parentPhone: z.string().optional(),
        healthStatus: z.string().optional(),
      })
    )
    .mutation(async ({ input, ctx }) => {
      const db = await getDb();
      if (!db) throw new Error("Database not available");

      // Verify student belongs to user's school
      const student = await db
        .select()
        .from(students)
        .where(eq(students.id, input.id))
        .execute();

      if (!student[0] || student[0].schoolId !== ctx.user.schoolId) {
        throw new Error("Unauthorized");
      }

      await db
        .update(students)
        .set({
          classId: input.classId,
          dateOfBirth: input.dateOfBirth,
          gender: input.gender,
          parentName: input.parentName,
          parentPhone: input.parentPhone,
          healthStatus: input.healthStatus,
        })
        .where(eq(students.id, input.id))
        .execute();

      return { success: true };
    }),

  /**
   * Delete student
   */
  delete: protectedProcedure
    .input(z.object({ id: z.number() }))
    .mutation(async ({ input, ctx }) => {
      const db = await getDb();
      if (!db) throw new Error("Database not available");

      // Verify student belongs to user's school
      const student = await db
        .select()
        .from(students)
        .where(eq(students.id, input.id))
        .execute();

      if (!student[0] || student[0].schoolId !== ctx.user.schoolId) {
        throw new Error("Unauthorized");
      }

      // Delete student and associated user
      await db.delete(students).where(eq(students.id, input.id)).execute();

      if (student[0].userId) {
        await db.delete(users).where(eq(users.id, student[0].userId)).execute();
      }

      return { success: true };
    }),

  /**
   * Bulk import students from CSV
   */
  bulkImport: protectedProcedure
    .input(
      z.object({
        classId: z.number(),
        students: z.array(
          z.object({
            admissionNumber: z.string(),
            name: z.string().optional(),
            dateOfBirth: z.string().optional(),
            gender: z.enum(["male", "female"]).optional(),
            parentName: z.string().optional(),
            parentPhone: z.string().optional(),
          })
        ),
      })
    )
    .mutation(async ({ input, ctx }) => {
      if (!ctx.user.schoolId) throw new Error("User not associated with school");

      const db = await getDb();
      if (!db) throw new Error("Database not available");

      let imported = 0;
      let failed = 0;

      for (const student of input.students) {
        try {
          // Create user
          const newUser = await db
            .insert(users)
            .values({
              openId: `student_${student.admissionNumber}_${Date.now()}`,
              name: student.name,
              role: "student",
              schoolId: ctx.user.schoolId,
              isActive: true,
            })
            .execute();

          // Create student
          await db
            .insert(students)
            .values({
              schoolId: ctx.user.schoolId,
              userId: (newUser as any).insertId || 1,
              classId: input.classId,
              admissionNumber: student.admissionNumber,
              dateOfBirth: student.dateOfBirth,
              gender: student.gender,
              parentName: student.parentName,
              parentPhone: student.parentPhone,
            })
            .execute();

          imported++;
        } catch (error) {
          failed++;
          console.error(`Failed to import student ${student.admissionNumber}:`, error);
        }
      }

      return { imported, failed, total: input.students.length };
    }),

  /**
   * Get student by admission number
   */
  getByAdmissionNumber: protectedProcedure
    .input(z.object({ admissionNumber: z.string() }))
    .query(async ({ input, ctx }) => {
      if (!ctx.user.schoolId) throw new Error("User not associated with school");

      const db = await getDb();
      if (!db) throw new Error("Database not available");

      const student = await db
        .select()
        .from(students)
        .where(and(eq(students.admissionNumber, input.admissionNumber), eq(students.schoolId, ctx.user.schoolId)))
        .execute();

      return student[0] || null;
    }),
});
