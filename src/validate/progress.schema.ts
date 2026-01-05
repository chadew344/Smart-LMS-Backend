import { z } from "zod";
import { ProgressStatus } from "../types/course.type";

export const markLessonCompleteSchema = z.object({
  body: z.object({
    courseId: z
      .string({ error: "Course ID is required" })
      .regex(/^[0-9a-fA-F]{24}$/, "Invalid course ID"),
    moduleId: z
      .string({ error: "Module ID is required" })
      .regex(/^[0-9a-fA-F]{24}$/, "Invalid module ID"),
    lessonId: z
      .string({ error: "Lesson ID is required" })
      .regex(/^[0-9a-fA-F]{24}$/, "Invalid lesson ID"),
    status: z.enum(ProgressStatus),
    score: z.number().min(0).max(100).optional(),
    timeSpent: z.number().min(0).optional(),
  }),
});

export const getProgressByCourseSchema = z.object({
  params: z.object({
    courseId: z
      .string({ error: "Course ID is required" })
      .regex(/^[0-9a-fA-F]{24}$/, "Invalid course ID"),
  }),
});

export const updateProgressSchema = z.object({
  params: z.object({
    progressId: z
      .string({ error: "Progress ID is required" })
      .regex(/^[0-9a-fA-F]{24}$/, "Invalid progress ID"),
  }),
  body: z.object({
    status: z.enum(ProgressStatus).optional(),
    score: z.number().min(0).max(100).optional(),
    timeSpent: z.number().min(0).optional(),
  }),
});

export type MarkLessonCompleteInput = z.infer<
  typeof markLessonCompleteSchema
>["body"];
export type GetProgressByCourseParams = z.infer<
  typeof getProgressByCourseSchema
>["params"];
export type UpdateProgressInput = z.infer<typeof updateProgressSchema>["body"];
export type UpdateProgressParams = z.infer<
  typeof updateProgressSchema
>["params"];
