import { NextFunction, Response } from "express";
import { AccessTokenPayload, AuthRequest } from "../types/auth.types";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";

dotenv.config();

const JWT_SECRET = process.env.JWT_SECRET as string;

if (!JWT_SECRET) {
  throw new Error("JWT Secret is not defined in environment variables.");
}

export const authenticate = (
  req: AuthRequest,
  res: Response,
  next: NextFunction
) => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    res.status(401).json({
      message: "Authorization token missing or invalid format",
    });
    return;
  }

  const token = authHeader.substring(7);

  if (!token) {
    res.status(401).json({ message: "Token is empty" });
    return;
  }

  try {
    const payload = jwt.verify(token, JWT_SECRET) as AccessTokenPayload;
    req.user = payload;
    next();
  } catch (err) {
    if (err instanceof jwt.TokenExpiredError) {
      res.status(401).json({ message: "Token has expired" });
      return;
    }

    if (err instanceof jwt.JsonWebTokenError) {
      res.status(401).json({ message: "Invalid token" });
      return;
    }

    res.status(500).json({ message: "Authentication failed" });
  }
};
