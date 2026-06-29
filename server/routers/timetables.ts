import { router, protectedProcedure } from "../_core/trpc";
import { z } from "zod";
import { getDb } from "../db";
import { timetables, classes } from "../../drizzle/schema";
import { eq, and } from "drizzle-orm";

export const timetablesRouter = router({
  getByClass: protectedProcedure
    .input(
      z.object({
        classId: z.number(),
        type: z.enum(["academic", "mid_term_exam", "end_of_term_exam"]).optional(),
      })
    )
    .query(async ({ input, ctx }) => {
      const db = await getDb();
      if (!db) throw new Error("Database not available");

      let conditions = [eq(timetables.classId, input.classId)];

      if (input.type) {
        conditions.push(eq(timetables.type, input.type));
      }

      const timetableData = await db
        .select()
        .from(timetables)
        .where(and(...conditions))
        .execute();

      return timetableData;
    }),

  create: protectedProcedure
    .input(
      z.object({
        classId: z.number(),
        type: z.enum(["academic", "mid_term_exam", "end_of_term_exam"]),
        dayOfWeek: z.enum(["monday", "tuesday", "wednesday", "thursday", "friday", "saturday"]),
        startTime: z.string(),
        endTime: z.string(),
        subjectId: z.number(),
        teacherId: z.number().optional(),
        room: z.string().optional(),
        examTypeId: z.number().optional(),
        invigilators: z.array(z.number()).optional(),
      })
    )
    .mutation(async ({ input, ctx }) => {
      if (!ctx.user.schoolId) throw new Error("User not associated with school");

      const db = await getDb();
      if (!db) throw new Error("Database not available");

      const conflicts = await db
        .select()
        .from(timetables)
        .where(
          and(
            eq(timetables.classId, input.classId),
            eq(timetables.type, input.type),
            eq(timetables.dayOfWeek, input.dayOfWeek)
          )
        )
        .execute();

      const hasConflict = conflicts.some((t) => {
        const existingStart = t.startTime || "";
        const existingEnd = t.endTime || "";
        return (
          (input.startTime >= existingStart && input.startTime < existingEnd) ||
          (input.endTime > existingStart && input.endTime <= existingEnd) ||
          (input.startTime <= existingStart && input.endTime >= existingEnd)
        );
      });

      if (hasConflict) {
        throw new Error("Timetable conflict detected");
      }

      await db
        .insert(timetables)
        .values({
          schoolId: ctx.user.schoolId,
          classId: input.classId,
          type: input.type,
          dayOfWeek: input.dayOfWeek,
          startTime: input.startTime,
          endTime: input.endTime,
          subjectId: input.subjectId,
          teacherId: input.teacherId,
          room: input.room,
          examTypeId: input.examTypeId,
          invigilators: input.invigilators ? JSON.stringify(input.invigilators) : null,
          isActive: true,
        })
        .execute();

      return { success: true };
    }),

  update: protectedProcedure
    .input(
      z.object({
        id: z.number(),
        dayOfWeek: z.enum(["monday", "tuesday", "wednesday", "thursday", "friday", "saturday"]).optional(),
        startTime: z.string().optional(),
        endTime: z.string().optional(),
        subjectId: z.number().optional(),
        teacherId: z.number().optional(),
        room: z.string().optional(),
      })
    )
    .mutation(async ({ input, ctx }) => {
      const db = await getDb();
      if (!db) throw new Error("Database not available");

      const entry = await db.select().from(timetables).where(eq(timetables.id, input.id)).execute();

      if (!entry[0] || entry[0].schoolId !== ctx.user.schoolId) {
        throw new Error("Unauthorized");
      }

      await db
        .update(timetables)
        .set({
          dayOfWeek: input.dayOfWeek,
          startTime: input.startTime,
          endTime: input.endTime,
          subjectId: input.subjectId,
          teacherId: input.teacherId,
          room: input.room,
        })
        .where(eq(timetables.id, input.id))
        .execute();

      return { success: true };
    }),

  delete: protectedProcedure
    .input(z.object({ id: z.number() }))
    .mutation(async ({ input, ctx }) => {
      const db = await getDb();
      if (!db) throw new Error("Database not available");

      const entry = await db.select().from(timetables).where(eq(timetables.id, input.id)).execute();

      if (!entry[0] || entry[0].schoolId !== ctx.user.schoolId) {
        throw new Error("Unauthorized");
      }

      await db.delete(timetables).where(eq(timetables.id, input.id)).execute();

      return { success: true };
    }),

  getTeacherTimetable: protectedProcedure
    .input(z.object({ teacherId: z.number(), type: z.enum(["academic", "mid_term_exam", "end_of_term_exam"]).optional() }))
    .query(async ({ input, ctx }) => {
      const db = await getDb();
      if (!db) throw new Error("Database not available");

      let conditions = [eq(timetables.teacherId, input.teacherId)];

      if (input.type) {
        conditions.push(eq(timetables.type, input.type));
      }

      const teacherTimetable = await db
        .select()
        .from(timetables)
        .where(and(...conditions))
        .execute();

      return teacherTimetable;
    }),

  bulkCreate: protectedProcedure
    .input(
      z.object({
        classId: z.number(),
        type: z.enum(["academic", "mid_term_exam", "end_of_term_exam"]),
        entries: z.array(
          z.object({
            dayOfWeek: z.enum(["monday", "tuesday", "wednesday", "thursday", "friday", "saturday"]),
            startTime: z.string(),
            endTime: z.string(),
            subjectId: z.number(),
            teacherId: z.number().optional(),
            room: z.string().optional(),
          })
        ),
      })
    )
    .mutation(async ({ input, ctx }) => {
      if (!ctx.user.schoolId) throw new Error("User not associated with school");

      const db = await getDb();
      if (!db) throw new Error("Database not available");

      let created = 0;
      let failed = 0;

      for (const entry of input.entries) {
        try {
          await db
            .insert(timetables)
            .values({
              schoolId: ctx.user.schoolId,
              classId: input.classId,
              type: input.type,
              dayOfWeek: entry.dayOfWeek,
              startTime: entry.startTime,
              endTime: entry.endTime,
              subjectId: entry.subjectId,
              teacherId: entry.teacherId,
              room: entry.room,
              isActive: true,
            })
            .execute();

          created++;
        } catch (error) {
          failed++;
          console.error("Failed to create timetable entry:", error);
        }
      }

      return { created, failed, total: input.entries.length };
    }),
});
