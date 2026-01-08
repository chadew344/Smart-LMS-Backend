import { z } from "zod";

export const emailSchema = z.object({
  body: z.object({
    to: z.email(),
    subject: z.string(),
    text: z.string(),
  }),
});

export type EmailSchema = z.infer<typeof emailSchema>["body"];
