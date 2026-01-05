import { z } from "zod";

export const submitQuizSchema = z.object({
  body: z.object({
    quizId: z.string().regex(/^[0-9a-fA-F]{24}$/),
    courseId: z.string().regex(/^[0-9a-fA-F]{24}$/),

    answers: z.array(z.any()).min(1),
  }),
});

export const submitAssignmentSchema = z.object({
  body: z.object({
    assignmentId: z.string().regex(/^[0-9a-fA-F]{24}$/),
    courseId: z.string().regex(/^[0-9a-fA-F]{24}$/),

    files: z.array(z.string().url()).min(1),
    notes: z.string().optional(),
  }),
});
