import { NextFunction, Response } from "express";
import { AccessTokenPayload, AuthRequest } from "../types/auth.types";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";
import { ApiError } from "../utils/ApiError";
import { asyncHandler } from "../utils/asyncHandler";

dotenv.config();

const JWT_SECRET = process.env.JWT_SECRET as string;

if (!JWT_SECRET) {
  throw new Error("JWT Secret is not defined in environment variables.");
}

export const authenticate = asyncHandler(
  async (req: AuthRequest, res: Response, next: NextFunction) => {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      throw new ApiError(401, "Authorization token missing or invalid format");
    }

    const token = authHeader.substring(7);

    if (!token) {
      throw new ApiError(401, "Token is empty");
    }

    try {
      const payload = jwt.verify(token, JWT_SECRET) as AccessTokenPayload;
      req.user = payload;
      next();
    } catch (err) {
      if (err instanceof jwt.TokenExpiredError) {
        throw new ApiError(401, "Token has expired");
      }

      if (err instanceof jwt.JsonWebTokenError) {
        throw new ApiError(401, "Invalid token");
      }

      throw new ApiError(500, "Authentication failed");
    }
  }
);
