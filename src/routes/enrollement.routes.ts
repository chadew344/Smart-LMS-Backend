import express from "express";
import {
  enrollInCourse,
  getMyEnrollments,
  getEnrollment,
  getEnrollmentByCourse,
  unenrollFromCourse,
  getCourseStudents,
} from "../controllers/enrollement.controller";
import { authenticate, authorize } from "../middleware/auth.middleware";
import { Role } from "../models/user.model";
import {
  enrollInCourseSchema,
  getEnrollmentSchema,
  getEnrollmentByCourseSchema,
} from "../validate/enrollment.schema";
import { validate } from "../middleware/validate.middleware";

const router = express.Router();

router.post(
  "/",
  authenticate,
  authorize([Role.STUDENT]),
  validate(enrollInCourseSchema),
  enrollInCourse
);
router.get(
  "/my-courses",
  authenticate,
  authorize([Role.STUDENT]),
  getMyEnrollments
);
router.get(
  "/:enrollmentId",
  authenticate,
  validate(getEnrollmentSchema),
  getEnrollment
);

router.get(
  "/course/:courseId",
  authenticate,
  validate(getEnrollmentByCourseSchema),
  getEnrollmentByCourse
);

router.delete(
  "/:enrollmentId",
  authenticate,
  authorize([Role.STUDENT]),
  validate(getEnrollmentSchema),
  unenrollFromCourse
);

router.get(
  "/course/:courseId/students",
  authenticate,
  authorize([Role.INSTRUCTOR, Role.ADMIN]),
  validate(getEnrollmentByCourseSchema),
  getCourseStudents
);

export default router;
