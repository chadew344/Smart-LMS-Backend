import { z } from "zod";
import { Category, LessonType, Level, MediaType } from "../types/course.type";
import mongoose from "mongoose";

const mediaSchema = z.object({
  url: z.url("Invalid URL"),
  publicId: z.string().min(1, "publicId is required"),
  format: z.string().optional(),
  size: z.number().positive().optional(),
  resourceType: z.enum(MediaType),
});

const lessonSchema = z.object({
  title: z
    .string({ error: "Lesson title is required" })
    .min(3, "Lesson title must be at least 3 characters")
    .max(200, "Lesson title must not exceed 200 characters")
    .trim(),
  description: z
    .string()
    .min(10, "Lesson description must be at least 10 characters")
    .trim()
    .optional(),
  type: z.enum(LessonType),
  duration: z.number().min(0, "Duration must be positive").optional(),
  order: z.number().int().min(0, "Order must be at least 0"),
  video: mediaSchema.optional(),
  readingContent: z.string().optional(),
  quizId: z
    .string()
    .regex(/^[0-9a-fA-F]{24}$/)
    .transform((val) => new mongoose.Types.ObjectId(val))
    .optional(),

  resources: z.array(z.url("Invalid resource URL")).optional(),
});

const moduleSchema = z.object({
  title: z
    .string({ error: "Module title is required" })
    .min(3, "Module title must be at least 3 characters")
    .max(200, "Module title must not exceed 200 characters")
    .trim(),
  description: z.string().trim().optional(),
  order: z.number().int().min(0, "Order must be at least 0"),
  lessons: z
    .array(lessonSchema)
    .min(1, "Module must have at least 1 lesson")
    .max(50, "Module cannot have more than 50 lessons"),
});

export const createCourseSchema = z.object({
  body: z.object({
    title: z
      .string({ error: "Course title is required" })
      .min(5, "Course title must be at least 5 characters")
      .max(100, "Course title must not exceed 100 characters")
      .trim(),
    description: z
      .string({ error: "Course description is required" })
      .min(20, "Course description must be at least 20 characters")
      .max(2000, "Course description must not exceed 2000 characters")
      .trim(),
    category: z.enum(Category),
    level: z.enum(Level),
    price: z
      .number({ error: "Price is required" })
      .min(0, "Price must be 0 or greater")
      .max(9999, "Price must not exceed $9999"),
    thumbnail: mediaSchema.optional(),
    modules: z
      .array(moduleSchema)
      .min(1, "Course must have at least 1 module")
      .max(20, "Course cannot have more than 20 modules"),
    requirements: z.array(z.string().trim()).optional(),
    learningOutcomes: z.array(z.string().trim()).optional(),
    enableSequentialLearning: z.boolean().optional().default(false),
  }),
});

export const updateCourseSchema = z.object({
  params: z.object({
    courseId: z
      .string({ error: "Course ID is required" })
      .regex(/^[0-9a-fA-F]{24}$/, "Invalid course ID"),
  }),
  body: z.object({
    title: z
      .string()
      .min(5, "Course title must be at least 5 characters")
      .max(100, "Course title must not exceed 100 characters")
      .trim()
      .optional(),
    description: z
      .string()
      .min(20, "Course description must be at least 20 characters")
      .max(2000, "Course description must not exceed 2000 characters")
      .trim()
      .optional(),
    category: z.enum(Category).optional(),
    level: z.enum(Level).optional(),
    price: z.number().min(0).max(9999).optional(),
    thumbnail: mediaSchema.optional(),
    modules: z.array(moduleSchema).min(1).max(20).optional(),
    requirements: z.array(z.string().trim()).optional(),
    learningOutcomes: z.array(z.string().trim()).optional(),
    enableSequentialLearning: z.boolean().optional(),
  }),
});

export const getCourseSchema = z.object({
  params: z.object({
    courseId: z
      .string({ error: "Course ID is required" })
      .regex(/^[0-9a-fA-F]{24}$/, "Invalid course ID"),
  }),
});

export const deleteCourseSchema = z.object({
  params: z.object({
    courseId: z
      .string({ error: "Course ID is required" })
      .regex(/^[0-9a-fA-F]{24}$/, "Invalid course ID"),
  }),
});

export const publishCourseSchema = z.object({
  params: z.object({
    courseId: z
      .string({ error: "Course ID is required" })
      .regex(/^[0-9a-fA-F]{24}$/, "Invalid course ID"),
  }),
});

export const getCoursesSchema = z.object({
  query: z.object({
    category: z.string().optional(),
    level: z.enum(Level).optional(),
    search: z.string().trim().optional(),
    page: z.string().regex(/^\d+$/).optional(),
    limit: z.string().regex(/^\d+$/).optional(),
  }),
});

export type CreateCourseInput = z.infer<typeof createCourseSchema>["body"];
export type UpdateCourseInput = z.infer<typeof updateCourseSchema>["body"];
export type UpdateCourseParams = z.infer<typeof updateCourseSchema>["params"];
export type GetCourseParams = z.infer<typeof getCourseSchema>["params"];
export type DeleteCourseParams = z.infer<typeof deleteCourseSchema>["params"];
export type PublishCourseParams = z.infer<typeof publishCourseSchema>["params"];
export type GetCoursesQuery = z.infer<typeof getCoursesSchema>["query"];
