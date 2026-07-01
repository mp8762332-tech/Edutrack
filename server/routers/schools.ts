import { router, protectedProcedure } from "../_core/trpc";
import { getDb } from "../db";
import { z } from "zod";
import { schools } from "../../drizzle/schema";
import { eq } from "drizzle-orm";
import { TRPCError } from "@trpc/server";

export const schoolsRouter = router({
  create: protectedProcedure
    .input(
      z.object({
        name: z.string().min(1),
        type: z.enum(["primary", "secondary"]),
        ownership: z.enum(["government", "private", "religious", "ngo"]),
        district: z.string().optional(),
        principalName: z.string().optional(),
        principalPhone: z.string().optional(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const db = await getDb();
      if (!db) throw new TRPCError({ code: "INTERNAL_SERVER_ERROR", message: "Database unavailable" });

      if (ctx.user.role !== "author") {
        throw new TRPCError({ code: "FORBIDDEN", message: "Only authors can register schools" });
      }

      let code = Math.random().toString(36).substring(2, 8).toUpperCase();
      let existing = await db.select().from(schools).where(eq(schools.code, code)).limit(1);

      while (existing.length > 0) {
        code = Math.random().toString(36).substring(2, 8).toUpperCase();
        existing = await db.select().from(schools).where(eq(schools.code, code)).limit(1);
      }

      const newSchool = await db
        .insert(schools)
        .values({
          name: input.name,
          code,
          type: input.type,
          ownership: input.ownership,
          district: input.district,
          principalName: input.principalName,
          principalPhone: input.principalPhone,
          isActive: false,
        });

      return {
        code,
        name: input.name,
      };
    }),

  getById: protectedProcedure
    .input(z.object({ schoolId: z.number() }))
    .query(async ({ ctx, input }) => {
      const db = await getDb();
      if (!db) throw new TRPCError({ code: "INTERNAL_SERVER_ERROR", message: "Database unavailable" });

      const result = await db.select().from(schools).where(eq(schools.id, input.schoolId)).limit(1);

      if (result.length === 0) {
        throw new TRPCError({ code: "NOT_FOUND", message: "School not found" });
      }

      const school = result[0];

      if (ctx.user.role === "school_admin" && ctx.user.schoolId !== input.schoolId) {
        throw new TRPCError({ code: "FORBIDDEN", message: "Access denied" });
      }

      return school;
    }),

  list: protectedProcedure.query(async ({ ctx }) => {
    const db = await getDb();
    if (!db) throw new TRPCError({ code: "INTERNAL_SERVER_ERROR", message: "Database unavailable" });

    if (ctx.user.role !== "author") {
      throw new TRPCError({ code: "FORBIDDEN", message: "Only authors can list all schools" });
    }

    return await db.select().from(schools);
  }),

  update: protectedProcedure
    .input(
      z.object({
        schoolId: z.number(),
        motto: z.string().optional(),
        vision: z.string().optional(),
        logoUrl: z.string().optional(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const db = await getDb();
      if (!db) throw new TRPCError({ code: "INTERNAL_SERVER_ERROR", message: "Database unavailable" });

      if (ctx.user.role !== "school_admin" || ctx.user.schoolId !== input.schoolId) {
        throw new TRPCError({ code: "FORBIDDEN", message: "Access denied" });
      }

      await db
        .update(schools)
        .set({
          motto: input.motto,
          vision: input.vision,
          logoUrl: input.logoUrl,
        })
        .where(eq(schools.id, input.schoolId));

      const result = await db.select().from(schools).where(eq(schools.id, input.schoolId)).limit(1);
      return result[0];
    }),

  verifyCode: protectedProcedure
    .input(z.object({ code: z.string() }))
    .query(async ({ input }) => {
      const db = await getDb();
      if (!db) throw new TRPCError({ code: "INTERNAL_SERVER_ERROR", message: "Database unavailable" });

      const result = await db.select().from(schools).where(eq(schools.code, input.code)).limit(1);

      if (result.length === 0) {
        throw new TRPCError({ code: "NOT_FOUND", message: "Invalid code" });
      }

      const school = result[0];
      return {
        id: school.id,
        name: school.name,
        isActive: school.isActive,
      };
    }),

  completeRegistration: protectedProcedure
    .input(
      z.object({
        schoolId: z.number(),
        code: z.string(),
        password: z.string().min(6),
        motto: z.string().optional(),
        vision: z.string().optional(),
        logoUrl: z.string().optional(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const db = await getDb();
      if (!db) throw new TRPCError({ code: "INTERNAL_SERVER_ERROR", message: "Database unavailable" });

      const result = await db.select().from(schools).where(eq(schools.id, input.schoolId)).limit(1);

      if (result.length === 0 || result[0].code !== input.code) {
        throw new TRPCError({ code: "BAD_REQUEST", message: "Invalid code" });
      }

      const school = result[0];
      if (school.isActive) {
        throw new TRPCError({ code: "BAD_REQUEST", message: "School already registered" });
      }

      await db
        .update(schools)
        .set({
          isActive: true,
          motto: input.motto,
          vision: input.vision,
          logoUrl: input.logoUrl,
        })
        .where(eq(schools.id, input.schoolId));

      const updated = await db.select().from(schools).where(eq(schools.id, input.schoolId)).limit(1);

      return {
        school: updated[0],
      };
    }),
});
