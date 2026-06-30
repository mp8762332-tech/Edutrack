/**
 * Subjects Router - Subject management and retrieval
 */

import { router, protectedProcedure } from "../_core/trpc";
import { z } from "zod";
import { getDb } from "../db";
import { subjects } from "../../drizzle/schema";
import { eq, and } from "drizzle-orm";

export const subjectsRouter = router({
  /**
   * Get all subjects in school
   */
  list: protectedProcedure
    .input(z.object({ level: z.string().optional() }))
    .query(async ({ input, ctx }) => {
      if (!ctx.user.schoolId) throw new Error("User not associated with school");

      const db = await getDb();
      if (!db) throw new Error("Database not available");

      let conditions = [eq(subjects.schoolId, ctx.user.schoolId)];

      if (input.level) {
        conditions.push(eq(subjects.level, input.level as any));
      }

      const subjectList = await db
        .select()
        .from(subjects)
        .where(and(...conditions))
        .execute();

      return subjectList;
    }),

  /**
   * Get subject by ID
   */
  getById: protectedProcedure
    .input(z.object({ id: z.number() }))
    .query(async ({ input, ctx }) => {
      const db = await getDb();
      if (!db) throw new Error("Database not available");

      const subject = await db
        .select()
        .from(subjects)
        .where(eq(subjects.id, input.id))
        .execute();

      if (!subject[0]) throw new Error("Subject not found");

      // Check authorization
      if (ctx.user.schoolId !== subject[0].schoolId) {
        throw new Error("Unauthorized");
      }

      return subject[0];
    }),

  /**
   * Create new subject
   */
  create: protectedProcedure
    .input(
      z.object({
        name: z.string(),
        code: z.string(),
        level: z.enum(["kindergarten", "lower_primary", "upper_primary", "o_level", "a_level"]),
        isCore: z.boolean().optional(),
      })
    )
    .mutation(async ({ input, ctx }) => {
      if (!ctx.user.schoolId) throw new Error("User not associated with school");

      const db = await getDb();
      if (!db) throw new Error("Database not available");

      await db
        .insert(subjects)
        .values({
          schoolId: ctx.user.schoolId,
          name: input.name,
          code: input.code,
          level: input.level,
          isCore: input.isCore !== false,
        })
        .execute();

      return { success: true, name: input.name, code: input.code };
    }),
});
