import { Request, Response } from "express";
import { IUser, Role, User } from "../models/user.model";
import bcrypt from "bcryptjs";
import { signAccessToken, signRefreshToken } from "../utils/jwt.util";
import { AuthRequest } from "../types/auth.types";
import dotenv from "dotenv";
import jwt from "jsonwebtoken";
import { asyncHandler } from "../utils/asyncHandler";
import { ApiError } from "../utils/ApiError";
import { LoginSchema, RegisterSchema } from "../validate/auth.schema";
import { RefreshToken } from "../models/refreshToken.model";
import { successResponse } from "../utils/successResponse";
import { sendEmail } from "../config/email.config";
import { accountUpgrade } from "../utils/emailText";

dotenv.config();

const JWT_REFRESH_SECRET = process.env.JWT_REFRESH_SECRET as string;

const REFRESH_TOKEN_EXPIRY_DAYS = 7;
const REFRESH_TOKEN_EXPIRY_MS = REFRESH_TOKEN_EXPIRY_DAYS * 24 * 60 * 60 * 1000;

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

    res = await setRefreshToken(user, res);

    successResponse(
      res,
      "User registered successfully",
      {
        user: {
          id: user._id,
          email: user.email,
          firstName: user.firstName,
          lastName: user.lastName,
          roles: user.roles,
        },
        accessToken: signAccessToken(user),
      },
      201
    );
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

  res = await setRefreshToken(user, res);

  return successResponse(res, "Login successful", {
    user: {
      id: user._id,
      email: user.email,
      firstName: user.firstName,
      lastName: user.lastName,
      roles: user.roles,
    },
    accessToken: signAccessToken(user),
  });
});

export const getMyProfile = (_req: AuthRequest, res: Response) => {
  res.status(200).json({
    message: "My Profile",
  });
};

export const refreshToken = asyncHandler(
  async (req: Request, res: Response) => {
    const { refreshToken } = req.cookies;

    if (!refreshToken) {
      throw new ApiError(400, "Refresh token required");
    }

    let payload: any;

    try {
      payload = jwt.verify(refreshToken, JWT_REFRESH_SECRET);
    } catch (err) {
      throw new ApiError(401, "Invalid or expired token");
    }

    const user = await User.findById(payload.sub);
    if (!user) {
      throw new ApiError(404, "User not found");
    }

    const tokenExist = await RefreshToken.findOne({
      token: refreshToken,
      userId: payload.sub,
    });

    if (!tokenExist) {
      throw new ApiError(401, "Refresh token not found or revoked");
    }

    await RefreshToken.deleteOne({ _id: tokenExist._id });

    res = await setRefreshToken(user, res);

    const newAccessToken = signAccessToken(user);

    return successResponse(res, "Token refreshed successfully", {
      user: {
        id: user._id,
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName,
        roles: user.roles,
      },
      accessToken: newAccessToken,
    });
  }
);

export const logout = asyncHandler(async (req: AuthRequest, res: Response) => {
  const { refreshToken } = req.cookies;

  if (refreshToken) {
    await RefreshToken.deleteOne({ token: refreshToken });
  }

  res.clearCookie("refreshToken");

  return successResponse(res, "Logged out successfully");
});

const setRefreshToken = async (user: IUser, res: Response) => {
  const refreshToken = signRefreshToken(user);

  await RefreshToken.create({
    token: refreshToken,
    userId: user._id,
    expiresAt: new Date(Date.now() + REFRESH_TOKEN_EXPIRY_MS),
  });

  res.cookie("refreshToken", refreshToken, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict",
    maxAge: REFRESH_TOKEN_EXPIRY_MS,
  });

  return res;
};

export const upgradeToInstructor = asyncHandler(
  async (req: AuthRequest, res: Response) => {
    const _id = req.user!.sub;

    const user = await User.findOne({ _id });

    if (!user) {
      throw new ApiError(401, "User not found");
    }

    if (!user.roles.includes(Role.INSTRUCTOR)) {
      user.roles.push(Role.INSTRUCTOR);
    }

    const updatedUser = await user.save();

    sendEmail({
      to: user.email,
      subject: "Your Account Has Been Upgraded to Instructor",
      text: accountUpgrade(user.firstName),
    });

    return successResponse(
      res,
      "Your account has been successfully upgraded to instructor",
      {
        user: {
          id: user._id,
          email: user.email,
          firstName: user.firstName,
          lastName: user.lastName,
          roles: updatedUser.roles,
        },
        accessToken: null,
      }
    );
  }
);
