import { Router } from "express";
import { authenticate, authorize } from "../middleware/auth.middleware";
import { Role } from "../models/user.model";
import { upload } from "../middleware/upload.middleware";
import {
  deleteMediaFromCloudinary,
  uploadMediaToCloudinary,
} from "../controllers/upload.controller";

const router = Router();

router.post(
  "/",
  authenticate,
  authorize([Role.INSTRUCTOR]),
  upload.single("media"),
  uploadMediaToCloudinary
);

router.delete(
  "/",
  authenticate,
  authorize([Role.INSTRUCTOR, Role.ADMIN]),
  deleteMediaFromCloudinary
);

export default router;
