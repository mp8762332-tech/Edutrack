import { router, protectedProcedure } from "../_core/trpc";
import { getDb } from "../db";
import { z } from "zod";
import { teachers, users, classes, subjects } from "../../drizzle/schema";
import { eq, and } from "drizzle-orm";
import { TRPCError } from "@trpc/server";

export const teachersRouter = router({
  // Create/Register a new teacher
  create: protectedProcedure
    .input(
      z.object({
        schoolId: z.number(),
        name: z.string().min(1),
        email: z.string().email(),
        phone: z.string().optional(),
        employeeId: z.string().min(1),
        qualification: z.string().optional(),
        position: z.enum(["class_teacher", "dos", "regular_teacher", "head_teacher"]).optional(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const db = await getDb();
      if (!db) throw new TRPCError({ code: "INTERNAL_SERVER_ERROR", message: "Database unavailable" });

      // Only school admins can create teachers
      if (ctx.user.role !== "school_admin" || ctx.user.schoolId !== input.schoolId) {
        throw new TRPCError({ code: "FORBIDDEN", message: "Access denied" });
      }

      // Check if teacher email already exists
      const existingUser = await db
        .select()
        .from(users)
        .where(eq(users.email, input.email))
        .limit(1);

      if (existingUser.length > 0) {
        throw new TRPCError({ code: "BAD_REQUEST", message: "Email already registered" });
      }

      // Create user account for teacher
      const newUser = await db.insert(users).values({
        name: input.name,
        email: input.email,
        phone: input.phone,
        role: "teacher",
        schoolId: input.schoolId,
        openId: `teacher_${Date.now()}_${Math.random().toString(36).substring(7)}`,
      });

      // Create teacher record
      await db.insert(teachers).values({
        schoolId: input.schoolId,
        userId: 1, // Will be updated after user creation
        employeeId: input.employeeId,
        qualification: input.qualification,
        position: input.position,
        assignedClasses: JSON.stringify([]),
        assignedSubjects: JSON.stringify([]),
      });

      return {
        name: input.name,
        email: input.email,
        employeeId: input.employeeId,
      };
    }),

  // Get all teachers in a school
  listBySchool: protectedProcedure
    .input(z.object({ schoolId: z.number() }))
    .query(async ({ ctx, input }) => {
      const db = await getDb();
      if (!db) throw new TRPCError({ code: "INTERNAL_SERVER_ERROR", message: "Database unavailable" });

      if (ctx.user.role !== "school_admin" || ctx.user.schoolId !== input.schoolId) {
        throw new TRPCError({ code: "FORBIDDEN", message: "Access denied" });
      }

      const result = await db
        .select({
          id: teachers.id,
          name: users.name,
          email: users.email,
          phone: users.phone,
          employeeId: teachers.employeeId,
          qualification: teachers.qualification,
          position: teachers.position,
          assignedClasses: teachers.assignedClasses,
          assignedSubjects: teachers.assignedSubjects,
        })
        .from(teachers)
        .innerJoin(users, eq(teachers.userId, users.id))
        .where(eq(teachers.schoolId, input.schoolId));

      return result.map((t) => ({
        ...t,
        assignedClasses: t.assignedClasses ? JSON.parse(t.assignedClasses as string) : [],
        assignedSubjects: t.assignedSubjects ? JSON.parse(t.assignedSubjects as string) : [],
      }));
    }),

  // Get teacher by ID
  getById: protectedProcedure
    .input(z.object({ teacherId: z.number() }))
    .query(async ({ ctx, input }) => {
      const db = await getDb();
      if (!db) throw new TRPCError({ code: "INTERNAL_SERVER_ERROR", message: "Database unavailable" });

      const result = await db
        .select({
          id: teachers.id,
          schoolId: teachers.schoolId,
          name: users.name,
          email: users.email,
          phone: users.phone,
          employeeId: teachers.employeeId,
          qualification: teachers.qualification,
          position: teachers.position,
          assignedClasses: teachers.assignedClasses,
          assignedSubjects: teachers.assignedSubjects,
        })
        .from(teachers)
        .innerJoin(users, eq(teachers.userId, users.id))
        .where(eq(teachers.id, input.teacherId))
        .limit(1);

      if (result.length === 0) {
        throw new TRPCError({ code: "NOT_FOUND", message: "Teacher not found" });
      }

      const teacher = result[0];

      if (ctx.user.role === "school_admin" && ctx.user.schoolId !== teacher.schoolId) {
        throw new TRPCError({ code: "FORBIDDEN", message: "Access denied" });
      }

      return {
        ...teacher,
        assignedClasses: teacher.assignedClasses ? JSON.parse(teacher.assignedClasses as string) : [],
        assignedSubjects: teacher.assignedSubjects ? JSON.parse(teacher.assignedSubjects as string) : [],
      };
    }),

  // Assign classes to teacher
  assignClasses: protectedProcedure
    .input(
      z.object({
        teacherId: z.number(),
        classIds: z.array(z.number()),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const db = await getDb();
      if (!db) throw new TRPCError({ code: "INTERNAL_SERVER_ERROR", message: "Database unavailable" });

      // Verify teacher exists and user has access
      const teacherResult = await db
        .select()
        .from(teachers)
        .where(eq(teachers.id, input.teacherId))
        .limit(1);

      if (teacherResult.length === 0) {
        throw new TRPCError({ code: "NOT_FOUND", message: "Teacher not found" });
      }

      const teacher = teacherResult[0];

      if (ctx.user.role !== "school_admin" || ctx.user.schoolId !== teacher.schoolId) {
        throw new TRPCError({ code: "FORBIDDEN", message: "Access denied" });
      }

      await db
        .update(teachers)
        .set({
          assignedClasses: JSON.stringify(input.classIds),
        })
        .where(eq(teachers.id, input.teacherId));

      return { success: true };
    }),

  // Assign subjects to teacher
  assignSubjects: protectedProcedure
    .input(
      z.object({
        teacherId: z.number(),
        subjectIds: z.array(z.number()),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const db = await getDb();
      if (!db) throw new TRPCError({ code: "INTERNAL_SERVER_ERROR", message: "Database unavailable" });

      // Verify teacher exists and user has access
      const teacherResult = await db
        .select()
        .from(teachers)
        .where(eq(teachers.id, input.teacherId))
        .limit(1);

      if (teacherResult.length === 0) {
        throw new TRPCError({ code: "NOT_FOUND", message: "Teacher not found" });
      }

      const teacher = teacherResult[0];

      if (ctx.user.role !== "school_admin" || ctx.user.schoolId !== teacher.schoolId) {
        throw new TRPCError({ code: "FORBIDDEN", message: "Access denied" });
      }

      await db
        .update(teachers)
        .set({
          assignedSubjects: JSON.stringify(input.subjectIds),
        })
        .where(eq(teachers.id, input.teacherId));

      return { success: true };
    }),

  // Update teacher info
  update: protectedProcedure
    .input(
      z.object({
        teacherId: z.number(),
        name: z.string().optional(),
        phone: z.string().optional(),
        qualification: z.string().optional(),
        position: z.enum(["class_teacher", "dos", "regular_teacher", "head_teacher"]).optional(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const db = await getDb();
      if (!db) throw new TRPCError({ code: "INTERNAL_SERVER_ERROR", message: "Database unavailable" });

      // Verify teacher exists
      const teacherResult = await db
        .select()
        .from(teachers)
        .where(eq(teachers.id, input.teacherId))
        .limit(1);

      if (teacherResult.length === 0) {
        throw new TRPCError({ code: "NOT_FOUND", message: "Teacher not found" });
      }

      const teacher = teacherResult[0];

      if (ctx.user.role !== "school_admin" || ctx.user.schoolId !== teacher.schoolId) {
        throw new TRPCError({ code: "FORBIDDEN", message: "Access denied" });
      }

      // Update user info
      if (input.name || input.phone) {
        await db
          .update(users)
          .set({
            name: input.name,
            phone: input.phone,
          })
          .where(eq(users.id, teacher.userId));
      }

      // Update teacher info
      if (input.qualification || input.position) {
        await db
          .update(teachers)
          .set({
            qualification: input.qualification,
            position: input.position,
          })
          .where(eq(teachers.id, input.teacherId));
      }

      return { success: true };
    }),

  // Delete teacher
  delete: protectedProcedure
    .input(z.object({ teacherId: z.number() }))
    .mutation(async ({ ctx, input }) => {
      const db = await getDb();
      if (!db) throw new TRPCError({ code: "INTERNAL_SERVER_ERROR", message: "Database unavailable" });

      // Verify teacher exists
      const teacherResult = await db
        .select()
        .from(teachers)
        .where(eq(teachers.id, input.teacherId))
        .limit(1);

      if (teacherResult.length === 0) {
        throw new TRPCError({ code: "NOT_FOUND", message: "Teacher not found" });
      }

      const teacher = teacherResult[0];

      if (ctx.user.role !== "school_admin" || ctx.user.schoolId !== teacher.schoolId) {
        throw new TRPCError({ code: "FORBIDDEN", message: "Access denied" });
      }

      // Delete teacher record
      await db.delete(teachers).where(eq(teachers.id, input.teacherId));

      // Optionally deactivate user
      await db
        .update(users)
        .set({ isActive: false })
        .where(eq(users.id, teacher.userId));

      return { success: true };
    }),
});
