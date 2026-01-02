import { IUser } from "../models/user.model";
import { AccessTokenPayload, RefreshTokenPayload } from "../types/auth.types";
import dotenv from "dotenv";
import jwt from "jsonwebtoken";
dotenv.config();

const JWT_SECRET = process.env.JWT_SECRET as string;
const JWT_REFRESH_SECRET = process.env.JWT_REFRESH_SECRET as string;

if (!JWT_SECRET || !JWT_REFRESH_SECRET) {
  throw new Error("JWT secrets are not defined in environment variables");
}

export const signAccessToken = (user: IUser): string => {
  if (!user._id) {
    throw new Error("User ID is required to generate access token");
  }

  const payload: AccessTokenPayload = {
    sub: user._id.toString(),
    roles: user.roles,
  };

  return jwt.sign(payload, JWT_SECRET, { expiresIn: "30m" });
};

export const signRefreshToken = (user: IUser): string => {
  const payload: RefreshTokenPayload = {
    sub: user._id.toString(),
  };

  return jwt.sign(payload, JWT_REFRESH_SECRET, { expiresIn: "7d" });
};
