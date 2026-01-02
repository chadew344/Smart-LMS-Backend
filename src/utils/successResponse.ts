import { Response } from "express";

export const successResponse = <T>(
  res: Response,
  message: string,
  data: T | null = null,
  statusCode: number = 200
): Response => {
  return res.status(statusCode).json({
    success: true,
    message,
    data,
  });
};
