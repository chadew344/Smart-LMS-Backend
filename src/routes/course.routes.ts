import { Router } from "express";
import { authenticate, authorize } from "../middleware/auth.middleware";
import { Role } from "../models/user.model";
import {
  createCourse,
  deleteCourse,
  getCourse,
  getCourses,
  getInstructorCourses,
  publishCourse,
  updateCourse,
} from "../controllers/course.controller";
import {
  createCourseSchema,
  updateCourseSchema,
  getCourseSchema,
  deleteCourseSchema,
  publishCourseSchema,
  getCoursesSchema,
} from "../validate/course.schema";
import { validate } from "../middleware/validate.middleware";

const router = Router();

router.get(
  "/instructor/my-courses",
  authenticate,
  authorize([Role.INSTRUCTOR]),
  getInstructorCourses
);

router.get("/", validate(getCoursesSchema), getCourses);

router.post(
  "/",
  authenticate,
  authorize([Role.INSTRUCTOR]),
  validate(createCourseSchema),
  createCourse
);

router.get("/:courseId", authenticate, validate(getCourseSchema), getCourse);

router.patch(
  "/:courseId",
  authenticate,
  authorize([Role.INSTRUCTOR]),
  validate(updateCourseSchema),
  updateCourse
);

router.put(
  "/:courseId/publish",
  authenticate,
  authorize([Role.INSTRUCTOR]),
  validate(publishCourseSchema),
  publishCourse
);

router.delete(
  "/:courseId",
  authenticate,
  authorize([Role.INSTRUCTOR, Role.ADMIN]),
  validate(deleteCourseSchema),
  deleteCourse
);

export default router;
