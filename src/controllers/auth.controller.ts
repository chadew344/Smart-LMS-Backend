import { Request, Response } from "express";
import { Role, User } from "../models/user.model";
import bcrypt from "bcryptjs";
import { signAccessToken, signRefreshToken } from "../utils/jwt.util";
import { AuthRequest } from "../types/auth.types";
import dotenv from "dotenv";
import jwt from "jsonwebtoken";
import { asyncHandler } from "../utils/asyncHandler";
import { ApiError } from "../utils/ApiError";
import {
  LoginSchema,
  RefreshTokenSchema,
  RegisterSchema,
} from "../validate/auth.schema";

dotenv.config();

const JWT_REFRESH_SECRET = process.env.JWT_REFRESH_SECRET as string;

export const registerUser = asyncHandler(
  async (req: Request, res: Response) => {
    const { firstName, lastName, email, password } = req.body as RegisterSchema;

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      throw new ApiError(409, "User with this email already exists");
    }

    const hash = await bcrypt.hash(password, 10);
    const user = await User.create({
      firstName,
      lastName,
      email,
      password: hash,
      roles: [Role.STUDENT],
    });

    res.status(201).json({
      success: true,
      message: "User registered successfully",
      data: {
        id: user._id,
        email: user.email,
        roles: user.roles,
      },
    });
  }
);

export const login = asyncHandler(async (req: Request, res: Response) => {
  const { email, password } = req.body as LoginSchema;

  const user = await User.findOne({ email }).select("+password");
  if (!user) {
    throw new ApiError(401, "Invalid credentials");
  }

  const isPasswordValid = await bcrypt.compare(password, user.password);
  if (!isPasswordValid) {
    throw new ApiError(401, "Invalid credentials");
  }

  res.status(200).json({
    success: true,
    message: "Login successful",
    data: {
      accessToken: signAccessToken(user),
      refreshToken: signRefreshToken(user),
    },
  });
});

export const getMyProfile = (req: AuthRequest, res: Response) => {
  res.status(200).json({
    message: "My Profile",
  });
};

export const refreshToken = asyncHandler(
  async (req: Request, res: Response) => {
    const { token } = req.body as RefreshTokenSchema;
    if (!token) {
      throw new ApiError(400, "Refresh token required");
    }

    let payload;
    try {
      payload = jwt.verify(token, JWT_REFRESH_SECRET);
    } catch (err) {
      throw new ApiError(401, "Invalid or expired token");
    }

    const user = await User.findById(payload.sub);
    if (!user) {
      throw new ApiError(404, "User not found");
    }

    const accessToken = signAccessToken(user);
    res.status(200).json({ accessToken });
  }
);
