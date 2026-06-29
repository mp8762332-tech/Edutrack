/**
 * Exams Router - Exam type management with optional/mandatory logic
 */

import { router, protectedProcedure, adminProcedure } from "../_core/trpc";
import { z } from "zod";
import { getDb } from "../db";
import { examTypes } from "../../drizzle/schema";
import { eq } from "drizzle-orm";

export const examsRouter = router({
  /**
   * Get all exam types for a school
   */
  list: protectedProcedure
    .input(z.object({ schoolId: z.number().optional() }))
    .query(async ({ input, ctx }) => {
      const db = await getDb();
      if (!db) throw new Error("Database not available");

      const schoolId = input.schoolId || ctx.user.schoolId;
      if (!schoolId) throw new Error("School ID required");

      const exams = await db
        .select()
        .from(examTypes)
        .where(eq(examTypes.schoolId, schoolId))
        .execute();

      return exams;
    }),

  /**
   * Get exam type by ID
   */
  getById: protectedProcedure
    .input(z.object({ id: z.number() }))
    .query(async ({ input, ctx }) => {
      const db = await getDb();
      if (!db) throw new Error("Database not available");

      const exam = await db
        .select()
        .from(examTypes)
        .where(eq(examTypes.id, input.id))
        .execute();

      if (!exam[0]) throw new Error("Exam type not found");

      // Check authorization
      if (ctx.user.role === "school_admin" && ctx.user.schoolId !== exam[0].schoolId) {
        throw new Error("Unauthorized");
      }

      return exam[0];
    }),

  /**
   * Create exam type
   */
  create: protectedProcedure
    .input(
      z.object({
        name: z.string().min(1),
        type: z.enum(["mid_term", "end_of_term", "formative", "summative"]),
        isOptional: z.boolean().default(false),
        startDate: z.string().optional(), // YYYY-MM-DD
        endDate: z.string().optional(), // YYYY-MM-DD
        term: z.number().optional(),
        year: z.number().optional(),
      })
    )
    .mutation(async ({ input, ctx }) => {
      if (!ctx.user.schoolId) throw new Error("User not associated with school");

      const db = await getDb();
      if (!db) throw new Error("Database not available");

      // Validate: End-of-term exams cannot be optional
      if (input.type === "end_of_term" && input.isOptional) {
        throw new Error("End-of-term exams must be mandatory");
      }

      await db
        .insert(examTypes)
        .values({
          name: input.name,
          type: input.type,
          isOptional: input.isOptional,
          isMandatory: !input.isOptional,
          startDate: input.startDate,
          endDate: input.endDate,
          term: input.term,
          year: input.year,
          schoolId: ctx.user.schoolId,
        })
        .execute();

      return {
        success: true,
        name: input.name,
        type: input.type,
        isOptional: input.isOptional,
      };
    }),

  /**
   * Update exam type
   */
  update: protectedProcedure
    .input(
      z.object({
        id: z.number(),
        name: z.string().optional(),
        isOptional: z.boolean().optional(),
        startDate: z.string().optional(),
        endDate: z.string().optional(),
      })
    )
    .mutation(async ({ input, ctx }) => {
      const db = await getDb();
      if (!db) throw new Error("Database not available");

      // Get current exam
      const current = await db
        .select()
        .from(examTypes)
        .where(eq(examTypes.id, input.id))
        .execute();

      if (!current[0]) throw new Error("Exam type not found");

      // Check authorization
      if (ctx.user.role === "school_admin" && ctx.user.schoolId !== current[0].schoolId) {
        throw new Error("Unauthorized");
      }

      // Validate: End-of-term exams cannot be optional
      if (current[0].type === "end_of_term" && input.isOptional === true) {
        throw new Error("End-of-term exams must be mandatory");
      }

      await db
        .update(examTypes)
        .set({
          name: input.name,
          isOptional: input.isOptional,
          isMandatory: input.isOptional === false,
          startDate: input.startDate,
          endDate: input.endDate,
        })
        .where(eq(examTypes.id, input.id))
        .execute();

      return { success: true };
    }),

  /**
   * Delete exam type
   */
  delete: protectedProcedure
    .input(z.object({ id: z.number() }))
    .mutation(async ({ input, ctx }) => {
      const db = await getDb();
      if (!db) throw new Error("Database not available");

      // Get exam to check authorization
      const exam = await db
        .select()
        .from(examTypes)
        .where(eq(examTypes.id, input.id))
        .execute();

      if (!exam[0]) throw new Error("Exam type not found");

      if (ctx.user.role === "school_admin" && ctx.user.schoolId !== exam[0].schoolId) {
        throw new Error("Unauthorized");
      }

      // Prevent deletion of mandatory exams
      if (!exam[0].isOptional) {
        throw new Error("Cannot delete mandatory exam types");
      }

      await db.delete(examTypes).where(eq(examTypes.id, input.id)).execute();

      return { success: true };
    }),

  /**
   * Get mandatory exams for a school
   */
  getMandatory: protectedProcedure
    .input(z.object({ schoolId: z.number().optional() }))
    .query(async ({ input, ctx }) => {
      const db = await getDb();
      if (!db) throw new Error("Database not available");

      const schoolId = input.schoolId || ctx.user.schoolId;
      if (!schoolId) throw new Error("School ID required");

      // Mandatory exams: END_OF_TERM_EXAM and non-optional exams
      const mandatory = await db
        .select()
        .from(examTypes)
        .where(
          eq(examTypes.schoolId, schoolId)
          // Filter for mandatory exams (isOptional = false)
        )
        .execute();

      return mandatory.filter((e) => !e.isOptional || e.type === "end_of_term");
    }),

  /**
   * Get optional exams for a school
   */
  getOptional: protectedProcedure
    .input(z.object({ schoolId: z.number().optional() }))
    .query(async ({ input, ctx }) => {
      const db = await getDb();
      if (!db) throw new Error("Database not available");

      const schoolId = input.schoolId || ctx.user.schoolId;
      if (!schoolId) throw new Error("School ID required");

      const optional = await db
        .select()
        .from(examTypes)
        .where(eq(examTypes.schoolId, schoolId))
        .execute();

      return optional.filter((e) => e.isOptional && e.type !== "end_of_term");
    }),
});
