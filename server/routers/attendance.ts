/**
 * Attendance Router - Daily attendance tracking and reports\n */

import { router, protectedProcedure } from "../_core/trpc";
import { z } from "zod";
import { getDb } from "../db";
import { attendance, students } from "../../drizzle/schema";
import { eq, and, gte, lte } from "drizzle-orm";

export const attendanceRouter = router({
  /**
   * Record attendance for a class
   */
  record: protectedProcedure
    .input(
      z.object({
        classId: z.number(),
        date: z.string(), // YYYY-MM-DD
        records: z.array(
          z.object({
            studentId: z.number(),
            status: z.enum(["present", "absent", "late", "excused"]),
          })
        ),
      })
    )
    .mutation(async ({ input, ctx }) => {
      if (!ctx.user.schoolId) throw new Error("User not associated with school");

      const db = await getDb();
      if (!db) throw new Error("Database not available");

      let recorded = 0;
      let failed = 0;

      for (const record of input.records) {
        try {
          // Check if attendance already recorded
          const existing = await db
            .select()
            .from(attendance)
            .where(
              and(
                eq(attendance.studentId, record.studentId),
                eq(attendance.classId, input.classId),
                eq(attendance.date, input.date)
              )
            )
            .execute();

          if (existing.length > 0) {
            // Update
            await db
              .update(attendance)
              .set({ status: record.status })
              .where(eq(attendance.id, existing[0].id))
              .execute();
          } else {
            // Insert
            await db
              .insert(attendance)
              .values({
                schoolId: ctx.user.schoolId,
                studentId: record.studentId,
                classId: input.classId,
                date: input.date,
                status: record.status,
                recordedBy: ctx.user.id || 0,
              })
              .execute();
          }

          recorded++;
        } catch (error) {
          failed++;
          console.error(`Failed to record attendance for student ${record.studentId}:`, error);
        }
      }

      return { recorded, failed, total: input.records.length };
    }),

  /**
   * Get attendance for a class on a specific date
   */
  getByClassDate: protectedProcedure
    .input(z.object({ classId: z.number(), date: z.string() }))
    .query(async ({ input, ctx }) => {
      const db = await getDb();
      if (!db) throw new Error("Database not available");

      const records = await db
        .select()
        .from(attendance)
        .where(and(eq(attendance.classId, input.classId), eq(attendance.date, input.date)))
        .execute();

      return records;
    }),

  /**
   * Get attendance for a student
   */
  getByStudent: protectedProcedure
    .input(z.object({ studentId: z.number(), startDate: z.string().optional(), endDate: z.string().optional() }))
    .query(async ({ input, ctx }) => {
      const db = await getDb();
      if (!db) throw new Error("Database not available");

      let conditions = [eq(attendance.studentId, input.studentId)];

      if (input.startDate) {
        conditions.push(gte(attendance.date, input.startDate));
      }

      if (input.endDate) {
        conditions.push(lte(attendance.date, input.endDate));
      }

      const records = await db
        .select()
        .from(attendance)
        .where(and(...conditions))
        .execute();

      return records;
    }),

  /**
   * Get attendance report for a class
   */
  getClassReport: protectedProcedure
    .input(z.object({ classId: z.number(), startDate: z.string(), endDate: z.string() }))
    .query(async ({ input, ctx }) => {
      const db = await getDb();
      if (!db) throw new Error("Database not available");

      const records = await db
        .select()
        .from(attendance)
        .where(
          and(
            eq(attendance.classId, input.classId),
            gte(attendance.date, input.startDate),
            lte(attendance.date, input.endDate)
          )
        )
        .execute();

      // Calculate statistics per student
      const stats: Record<
        number,
        {
          present: number;
          absent: number;
          late: number;
          excused: number;
          total: number;
          percentage: number;
        }
      > = {};

      records.forEach((record) => {
        if (!stats[record.studentId]) {
          stats[record.studentId] = { present: 0, absent: 0, late: 0, excused: 0, total: 0, percentage: 0 };
        }

        const status = record.status as keyof typeof stats[number];
        stats[record.studentId][status]++;
        if (stats[record.studentId]) stats[record.studentId].total++;
      });

      // Calculate percentages
      Object.keys(stats).forEach((studentId) => {
        const id = parseInt(studentId);
        if (stats[id]) {
          stats[id].percentage = (stats[id].present / stats[id].total) * 100;
        }
      });

      return { records, stats };
    }),

  /**
   * Get attendance summary for a student
   */
  getSummary: protectedProcedure
    .input(z.object({ studentId: z.number(), startDate: z.string(), endDate: z.string() }))
    .query(async ({ input, ctx }) => {
      const db = await getDb();
      if (!db) throw new Error("Database not available");

      const records = await db
        .select()
        .from(attendance)
        .where(
          and(
            eq(attendance.studentId, input.studentId),
            gte(attendance.date, input.startDate),
            lte(attendance.date, input.endDate)
          )
        )
        .execute();

      const summary = {
        present: records.filter((r) => r.status === "present").length,
        absent: records.filter((r) => r.status === "absent").length,
        late: records.filter((r) => r.status === "late").length,
        excused: records.filter((r) => r.status === "excused").length,
        total: records.length,
        percentage: 0,
      };

      summary.percentage = (summary.present / summary.total) * 100 || 0;

      return summary;
    }),

  /**
   * Delete attendance record
   */
  delete: protectedProcedure
    .input(z.object({ id: z.number() }))
    .mutation(async ({ input, ctx }) => {
      const db = await getDb();
      if (!db) throw new Error("Database not available");

      // Verify authorization
      const record = await db.select().from(attendance).where(eq(attendance.id, input.id)).execute();

      if (!record[0] || record[0].schoolId !== ctx.user.schoolId) {
        throw new Error("Unauthorized");
      }

      await db.delete(attendance).where(eq(attendance.id, input.id)).execute();

      return { success: true };
    }),
});
