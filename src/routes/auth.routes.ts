import { Router } from "express";
import { authenticate } from "../middleware/auth.middleware";
import {
  getMyProfile,
  login,
  refreshToken,
  registerUser,
} from "../controllers/auth.controller";
import { validate } from "../middleware/validate.middlware";
import {
  loginSchema,
  refreshTokenSchema,
  registerSchema,
} from "../validate/auth.schema";

const router = Router();

router.post("/register", validate(registerSchema), registerUser);

router.post("/login", validate(loginSchema), login);

router.get("/me", authenticate, getMyProfile);

router.post("/refresh", validate(refreshTokenSchema), refreshToken);

export default router;
