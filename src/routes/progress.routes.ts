import express from "express";
import {
  markLessonComplete,
  getProgressByCourse,
  getLessonProgress,
  updateProgress,
  getCourseProgressAll,
} from "../controllers/progress.controller";
import { authenticate, authorize } from "../middleware/auth.middleware";
import { validate } from "../middleware/validate.middleware";
import {
  markLessonCompleteSchema,
  getProgressByCourseSchema,
  updateProgressSchema,
} from "../validate/progress.schema";
import { Role } from "../models/user.model";

const router = express.Router();

router.post(
  "/",
  authenticate,
  authorize([Role.STUDENT]),
  validate(markLessonCompleteSchema),
  markLessonComplete
);

router.get(
  "/course/:courseId",
  authenticate,
  authorize([Role.STUDENT]),
  validate(getProgressByCourseSchema),
  getProgressByCourse
);

router.get(
  "/lesson/:courseId/:lessonId",
  authenticate,
  authorize([Role.STUDENT]),
  getLessonProgress
);

router.put(
  "/:progressId",
  authenticate,
  authorize([Role.STUDENT]),
  validate(updateProgressSchema),
  updateProgress
);

router.get(
  "/course/:courseId/all",
  authenticate,
  authorize([Role.INSTRUCTOR, Role.ADMIN]),
  validate(getProgressByCourseSchema),
  getCourseProgressAll
);

export default router;
