import { Router } from "express";
import { authenticate, authorize } from "../middleware/auth.middleware";
import {
  getMyProfile,
  login,
  logout,
  refreshToken,
  registerUser,
  upgradeToInstructor,
} from "../controllers/auth.controller";
import { validate } from "../middleware/validate.middleware";
import { loginSchema, registerSchema } from "../validate/auth.schema";
import { Role } from "../models/user.model";

const router = Router();

router.post("/register", validate(registerSchema), registerUser);

router.post("/login", validate(loginSchema), login);

router.post("/refresh", refreshToken);

router.post("/logout", authenticate, logout);

router.get("/me", authenticate, getMyProfile);

router.post(
  "/instructor",
  authenticate,
  authorize([Role.STUDENT]),
  upgradeToInstructor
);

export default router;
