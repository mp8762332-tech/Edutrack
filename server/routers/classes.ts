/**
 * Classes Router - Class management and retrieval
 */

import { router, protectedProcedure } from "../_core/trpc";
import { z } from "zod";
import { getDb } from "../db";
import { classes } from "../../drizzle/schema";
import { eq } from "drizzle-orm";

export const classesRouter = router({
  /**
   * Get all classes in school
   */
  list: protectedProcedure.query(async ({ ctx }) => {
    if (!ctx.user.schoolId) throw new Error("User not associated with school");

    const db = await getDb();
    if (!db) throw new Error("Database not available");

    const classList = await db
      .select()
      .from(classes)
      .where(eq(classes.schoolId, ctx.user.schoolId))
      .execute();

    return classList;
  }),

  /**
   * Get class by ID
   */
  getById: protectedProcedure
    .input(z.object({ id: z.number() }))
    .query(async ({ input, ctx }) => {
      const db = await getDb();
      if (!db) throw new Error("Database not available");

      const classData = await db
        .select()
        .from(classes)
        .where(eq(classes.id, input.id))
        .execute();

      if (!classData[0]) throw new Error("Class not found");

      // Check authorization
      if (ctx.user.schoolId !== classData[0].schoolId) {
        throw new Error("Unauthorized");
      }

      return classData[0];
    }),

  /**
   * Create new class
   */
  create: protectedProcedure
    .input(
      z.object({
        name: z.string(),
        level: z.enum(["kindergarten", "lower_primary", "upper_primary", "o_level", "a_level"]),
        stream: z.string().optional(),
      })
    )
    .mutation(async ({ input, ctx }) => {
      if (!ctx.user.schoolId) throw new Error("User not associated with school");

      const db = await getDb();
      if (!db) throw new Error("Database not available");

      await db
        .insert(classes)
        .values({
          schoolId: ctx.user.schoolId,
          name: input.name,
          level: input.level,
          stream: input.stream,
        })
        .execute();

      return { success: true, name: input.name, level: input.level };
    }),
});
