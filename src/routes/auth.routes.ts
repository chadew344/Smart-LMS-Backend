import { Router } from "express";
import { authenticate } from "../middleware/auth.middleware";
import {
  getMyProfile,
  login,
  logout,
  refreshToken,
  registerUser,
} from "../controllers/auth.controller";
import { validate } from "../middleware/validate.middleware";
import { loginSchema, registerSchema } from "../validate/auth.schema";

const router = Router();

router.post("/register", validate(registerSchema), registerUser);

router.post("/login", validate(loginSchema), login);

router.post("/refresh", refreshToken);

router.post("/logout", authenticate, logout);

router.get("/me", authenticate, getMyProfile);

export default router;
