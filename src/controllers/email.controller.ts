import { Request, Response } from "express";
import { asyncHandler } from "../utils/asyncHandler";
import { successResponse } from "../utils/successResponse";
import { sendEmail } from "../config/email.config";
import { EmailSchema } from "../validate/email.schema";

export const sendNotification = asyncHandler(
  async (req: Request, res: Response) => {
    const { to, subject, text } = req.body as EmailSchema;

    await sendEmail({ to, subject, text });

    successResponse(res, "Email sent successfully", null);
  }
);
