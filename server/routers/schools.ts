/**
 * Schools Router - School management, registration, and admin functions
 */

import { router, publicProcedure, protectedProcedure, adminProcedure } from "../_core/trpc";
import { z } from "zod";
import { getDb } from "../db";
import { schools, users, classes, students, teachers } from "../../drizzle/schema";
import { eq, and } from "drizzle-orm";

export const schoolsRouter = router({
  /**
   * Get all schools (Author only)
   */
  list: adminProcedure.query(async ({ ctx }) => {
    const db = await getDb();
    if (!db) throw new Error("Database not available");

    const allSchools = await db.select().from(schools).execute();
    return allSchools;
  }),

  /**
   * Get school by ID
   */
  getById: protectedProcedure
    .input(z.object({ id: z.number() }))
    .query(async ({ input, ctx }) => {
      const db = await getDb();
      if (!db) throw new Error("Database not available");

      const school = await db
        .select()
        .from(schools)
        .where(eq(schools.id, input.id))
        .execute();

      if (!school[0]) throw new Error("School not found");

      // Check authorization
      if (ctx.user.role === "school_admin" && ctx.user.schoolId !== input.id) {
        throw new Error("Unauthorized");
      }

      return school[0];
    }),

  /**
   * Get current user's school
   */
  getCurrent: protectedProcedure.query(async ({ ctx }) => {
    if (!ctx.user.schoolId) throw new Error("User not associated with school");

    const db = await getDb();
    if (!db) throw new Error("Database not available");

    const school = await db
      .select()
      .from(schools)
      .where(eq(schools.id, ctx.user.schoolId))
      .execute();

    return school[0] || null;
  }),

  /**
   * Register new school
   */
  register: publicProcedure
    .input(
      z.object({
        name: z.string().min(3),
        code: z.string().length(6),
        type: z.enum(["primary", "secondary"]),
        motto: z.string().optional(),
        vision: z.string().optional(),
        district: z.string().optional(),
        principalName: z.string().optional(),
        principalPhone: z.string().optional(),
      })
    )
    .mutation(async ({ input }) => {
      const db = await getDb();
      if (!db) throw new Error("Database not available");

      // Check if code already exists
      const existing = await db
        .select()
        .from(schools)
        .where(eq(schools.code, input.code))
        .execute();

      if (existing.length > 0) throw new Error("School code already exists");

      await db
        .insert(schools)
        .values({
          name: input.name,
          code: input.code,
          type: input.type,
          motto: input.motto,
          vision: input.vision,
          district: input.district,
          principalName: input.principalName,
          principalPhone: input.principalPhone,
          subscriptionPlan: "free",
          isActive: true,
        })
        .execute();

      return { success: true, code: input.code };
    }),

  /**
   * Update school details
   */
  update: protectedProcedure
    .input(
      z.object({
        id: z.number(),
        name: z.string().optional(),
        motto: z.string().optional(),
        vision: z.string().optional(),
        logoUrl: z.string().optional(),
        principalName: z.string().optional(),
        principalPhone: z.string().optional(),
      })
    )
    .mutation(async ({ input, ctx }) => {
      const db = await getDb();
      if (!db) throw new Error("Database not available");

      // Check authorization
      if (ctx.user.role === "school_admin" && ctx.user.schoolId !== input.id) {
        throw new Error("Unauthorized");
      }

      await db
        .update(schools)
        .set({
          name: input.name,
          motto: input.motto,
          vision: input.vision,
          logoUrl: input.logoUrl,
          principalName: input.principalName,
          principalPhone: input.principalPhone,
        })
        .where(eq(schools.id, input.id))
        .execute();

      return { success: true };
    }),

  /**
   * Get school statistics
   */
  getStats: protectedProcedure
    .input(z.object({ schoolId: z.number() }))
    .query(async ({ input, ctx }) => {
      const db = await getDb();
      if (!db) throw new Error("Database not available");

      // Check authorization
      if (ctx.user.role === "school_admin" && ctx.user.schoolId !== input.schoolId) {
        throw new Error("Unauthorized");
      }

      const schoolData = await db
        .select()
        .from(schools)
        .where(eq(schools.id, input.schoolId))
        .execute();

      const schoolUsers = await db
        .select()
        .from(users)
        .where(eq(users.schoolId, input.schoolId))
        .execute();

      const schoolClasses = await db
        .select()
        .from(classes)
        .where(eq(classes.schoolId, input.schoolId))
        .execute();

      const schoolStudents = await db
        .select()
        .from(students)
        .where(eq(students.schoolId, input.schoolId))
        .execute();

      const schoolTeachers = await db
        .select()
        .from(teachers)
        .where(eq(teachers.schoolId, input.schoolId))
        .execute();

      return {
        school: schoolData[0],
        stats: {
          totalUsers: schoolUsers.length,
          totalClasses: schoolClasses.length,
          totalStudents: schoolStudents.length,
          totalTeachers: schoolTeachers.length,
          admins: schoolUsers.filter((u) => u.role === "school_admin").length,
          teachers: schoolUsers.filter((u) => u.role === "teacher").length,
          students: schoolUsers.filter((u) => u.role === "student").length,
        },
      };
    }),

  /**
   * Get school dashboard data
   */
  getDashboard: protectedProcedure.query(async ({ ctx }) => {
    if (!ctx.user.schoolId) throw new Error("User not associated with school");

    const db = await getDb();
    if (!db) throw new Error("Database not available");

    const school = await db
      .select()
      .from(schools)
      .where(eq(schools.id, ctx.user.schoolId))
      .execute();

    const stats = await db
      .select()
      .from(users)
      .where(eq(users.schoolId, ctx.user.schoolId))
      .execute();

    const classCount = await db
      .select()
      .from(classes)
      .where(eq(classes.schoolId, ctx.user.schoolId))
      .execute();

    const studentCount = await db
      .select()
      .from(students)
      .where(eq(students.schoolId, ctx.user.schoolId))
      .execute();

    return {
      school: school[0],
      stats: {
        totalUsers: stats.length,
        totalClasses: classCount.length,
        totalStudents: studentCount.length,
        admins: stats.filter((u) => u.role === "school_admin").length,
        teachers: stats.filter((u) => u.role === "teacher").length,
      },
    };
  }),
});
