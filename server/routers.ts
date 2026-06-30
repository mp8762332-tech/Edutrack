import { getSessionCookieOptions } from "./_core/cookies";
import { COOKIE_NAME } from "../shared/const";
import { systemRouter } from "./_core/systemRouter";
import { publicProcedure, router } from "./_core/trpc";
import { schoolsRouter } from "./routers/schools";
import { studentsRouter } from "./routers/students";
import { classesRouter } from "./routers/classes";
import { subjectsRouter } from "./routers/subjects";
import { examTypesRouter } from "./routers/examTypes";
import { marksRouter } from "./routers/marks";
import { reportCardsRouter } from "./routers/reportCards";
import { attendanceRouter } from "./routers/attendance";
import { timetablesRouter } from "./routers/timetables";
import { examsRouter } from "./routers/exams";

export const appRouter = router({
    // if you need to use socket.io, read and register route in server/_core/index.ts, all api should start with '/api/' so that the gateway can route correctly
  system: systemRouter,
  auth: router({
    me: publicProcedure.query(opts => opts.ctx.user),
    logout: publicProcedure.mutation(({ ctx }) => {
      const cookieOptions = getSessionCookieOptions(ctx.req);
      ctx.res.clearCookie(COOKIE_NAME, { ...cookieOptions, maxAge: -1 });
      return {
        success: true,
      } as const;
    }),
  }),

  schools: schoolsRouter,
  students: studentsRouter,
  classes: classesRouter,
  subjects: subjectsRouter,
  examTypes: examTypesRouter,
  marks: marksRouter,
  reportCards: reportCardsRouter,
  attendance: attendanceRouter,
  timetables: timetablesRouter,
  exams: examsRouter,
});

export type AppRouter = typeof appRouter;
