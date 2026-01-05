import { z } from "zod";

export const enrollInCourseSchema = z.object({
  body: z.object({
    courseId: z
      .string({ error: "Course ID is required" })
      .regex(/^[0-9a-fA-F]{24}$/, "Invalid course ID"),
  }),
});

export const getEnrollmentSchema = z.object({
  params: z.object({
    enrollmentId: z
      .string({ error: "Enrollment ID is required" })
      .regex(/^[0-9a-fA-F]{24}$/, "Invalid enrollment ID"),
  }),
});

export const getEnrollmentByCourseSchema = z.object({
  params: z.object({
    courseId: z
      .string({ error: "Course ID is required" })
      .regex(/^[0-9a-fA-F]{24}$/, "Invalid course ID"),
  }),
});

export const updateEnrollmentSchema = z.object({
  params: z.object({
    enrollmentId: z.string().regex(/^[0-9a-fA-F]{24}$/),
  }),
  body: z.object({
    currentModuleId: z
      .string()
      .regex(/^[0-9a-fA-F]{24}$/)
      .optional(),
    currentLessonId: z
      .string()
      .regex(/^[0-9a-fA-F]{24}$/)
      .optional(),
    timeSpent: z.number().min(0).optional(),
  }),
});

export type EnrollInCourseInput = z.infer<typeof enrollInCourseSchema>["body"];
export type GetEnrollmentParams = z.infer<typeof getEnrollmentSchema>["params"];
export type GetEnrollmentByCourseParams = z.infer<
  typeof getEnrollmentByCourseSchema
>["params"];
export type updateEnrollmentInput = z.infer<
  typeof updateEnrollmentSchema
>["body"];
