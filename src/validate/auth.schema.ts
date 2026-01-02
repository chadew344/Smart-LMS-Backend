import { z } from "zod";

export const registerSchema = z.object({
  body: z.object({
    firstName: z
      .string({ error: "First name is required" })
      .min(2, "First name must be at least 2 characters")
      .max(50, "First name must not exceed 50 characters")
      .trim(),
    lastName: z
      .string({ error: "Last name is required" })
      .min(2, "Last name must be at least 2 characters")
      .max(50, "Last name must not exceed 50 characters")
      .trim(),
    email: z
      .email("Invalid email format")
      .min(1, "Email is required")
      .trim()
      .toLowerCase(),
    password: z
      .string({ error: "Password is required" })
      .regex(
        /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{8,100}$/,
        "Password must be 8-100 characters and contain at least one uppercase letter, one lowercase letter, and one number"
      ),
  }),
});

export const loginSchema = z.object({
  body: z.object({
    email: z.email("Please enter a valid email").toLowerCase().trim(),
    password: z.string({ error: "Password is required" }),
  }),
});

export type RegisterSchema = z.infer<typeof registerSchema>["body"];
export type LoginSchema = z.infer<typeof loginSchema>["body"];
