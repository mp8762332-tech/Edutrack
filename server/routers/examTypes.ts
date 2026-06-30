/**
 * Exam Types Router - Exam type management and retrieval
 */

import { router, protectedProcedure } from "../_core/trpc";
import { z } from "zod";
import { getDb } from "../db";
import { examTypes } from "../../drizzle/schema";
import { eq } from "drizzle-orm";

export const examTypesRouter = router({
  /**
   * Get all exam types in school
   */
  list: protectedProcedure.query(async ({ ctx }) => {
    if (!ctx.user.schoolId) throw new Error("User not associated with school");

    const db = await getDb();
    if (!db) throw new Error("Database not available");

    const examTypeList = await db
      .select()
      .from(examTypes)
      .where(eq(examTypes.schoolId, ctx.user.schoolId))
      .execute();

    return examTypeList;
  }),

  /**
   * Get active exam types only
   */
  listActive: protectedProcedure.query(async ({ ctx }) => {
    if (!ctx.user.schoolId) throw new Error("User not associated with school");

    const db = await getDb();
    if (!db) throw new Error("Database not available");

    const activeExams = await db
      .select()
      .from(examTypes)
      .where(eq(examTypes.schoolId, ctx.user.schoolId))
      .execute()
      .then((exams) => exams.filter((e) => e.isActive));

    return activeExams;
  }),

  /**
   * Get exam type by ID
   */
  getById: protectedProcedure
    .input(z.object({ id: z.number() }))
    .query(async ({ input, ctx }) => {
      const db = await getDb();
      if (!db) throw new Error("Database not available");

      const examType = await db
        .select()
        .from(examTypes)
        .where(eq(examTypes.id, input.id))
        .execute();

      if (!examType[0]) throw new Error("Exam type not found");

      // Check authorization
      if (ctx.user.schoolId !== examType[0].schoolId) {
        throw new Error("Unauthorized");
      }

      return examType[0];
    }),

  /**
   * Create new exam type
   */
  create: protectedProcedure
    .input(
      z.object({
        name: z.string(),
        type: z.enum(["mid_term", "end_of_term", "formative", "summative"]),
        term: z.number().optional(),
        year: z.number().optional(),
        startDate: z.string().optional(),
        endDate: z.string().optional(),
        isOptional: z.boolean().optional(),
        isMandatory: z.boolean().optional(),
      })
    )
    .mutation(async ({ input, ctx }) => {
      if (!ctx.user.schoolId) throw new Error("User not associated with school");

      const db = await getDb();
      if (!db) throw new Error("Database not available");

      // End-of-term is always mandatory
      const isMandatory = input.type === "end_of_term" ? true : input.isMandatory !== false;
      const isOptional = input.type === "mid_term" ? input.isOptional === true : false;

      await db
        .insert(examTypes)
        .values({
          schoolId: ctx.user.schoolId,
          name: input.name,
          type: input.type,
          term: input.term,
          year: input.year,
          startDate: input.startDate,
          endDate: input.endDate,
          isOptional,
          isMandatory,
          isActive: false,
        })
        .execute();

      return { success: true, name: input.name, type: input.type };
    }),

  /**
   * Activate exam type
   */
  activate: protectedProcedure
    .input(z.object({ id: z.number() }))
    .mutation(async ({ input, ctx }) => {
      const db = await getDb();
      if (!db) throw new Error("Database not available");

      const examType = await db
        .select()
        .from(examTypes)
        .where(eq(examTypes.id, input.id))
        .execute();

      if (!examType[0]) throw new Error("Exam type not found");

      if (ctx.user.schoolId !== examType[0].schoolId) {
        throw new Error("Unauthorized");
      }

      await db
        .update(examTypes)
        .set({ isActive: true })
        .where(eq(examTypes.id, input.id))
        .execute();

      return { success: true };
    }),
});
