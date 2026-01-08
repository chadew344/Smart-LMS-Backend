import { Response } from "express";
import { Enrollment } from "../models/enrollment.model";
import { Course } from "../models/course.model";
import { asyncHandler } from "../utils/asyncHandler";
import { ApiError } from "../utils/ApiError";
import { successResponse } from "../utils/successResponse";
import { AuthRequest } from "../types/auth.types";
import {
  EnrollInCourseInput,
  GetEnrollmentParams,
  GetEnrollmentByCourseParams,
} from "../validate/enrollment.schema";
import { sendEmail } from "../config/email.config";
import { courseEnroll } from "../utils/emailText";

export const enrollInCourse = asyncHandler(
  async (req: AuthRequest, res: Response) => {
    const { courseId } = req.body as EnrollInCourseInput;
    const studentId = req.user!.sub;

    const course = await Course.findById(courseId);
    if (!course) {
      throw new ApiError(404, "Course not found");
    }

    if (!course.isPublished) {
      throw new ApiError(400, "Cannot enroll in unpublished course");
    }

    const existingEnrollment = await Enrollment.findOne({
      student: studentId,
      course: courseId,
    });

    if (existingEnrollment) {
      throw new ApiError(400, "Already enrolled in this course");
    }

    const enrollment = await Enrollment.create({
      student: studentId,
      course: courseId,
    });

    await Course.findByIdAndUpdate(courseId, {
      $inc: { enrollmentCount: 1 },
    });

    const populatedEnrollment = await Enrollment.findById(enrollment._id)
      .populate({
        path: "course",
        populate: {
          path: "instructor",
          select: "firstName lastName email",
        },
      })
      .populate("student", "firstName lastName email");

    sendEmail({
      to: "",
      subject: "New Course Enrollment",
      text: courseEnroll("John", course.title, "David"),
    });

    successResponse(res, "Enrolled successfully", populatedEnrollment, 201);
  }
);

export const getMyEnrollments = asyncHandler(
  async (req: AuthRequest, res: Response) => {
    const studentId = req.user!.sub;

    const enrollments = await Enrollment.find({ student: studentId })
      .populate({
        path: "course",
        populate: {
          path: "instructor",
          select: "firstName lastName email",
        },
      })
      .sort({ enrolledAt: -1 });

    successResponse(res, "Enrollments fetched successfully", enrollments);
  }
);

export const getEnrollment = asyncHandler(
  async (req: AuthRequest, res: Response) => {
    const { enrollmentId } = req.params as GetEnrollmentParams;
    const studentId = req.user!.sub;

    const enrollment = await Enrollment.findById(enrollmentId).populate({
      path: "course",
      populate: {
        path: "instructor",
        select: "firstName lastName email",
      },
    });

    if (!enrollment) {
      throw new ApiError(404, "Enrollment not found");
    }

    if (enrollment.student.toString() !== studentId) {
      throw new ApiError(403, "Not authorized to access this enrollment");
    }

    successResponse(res, "Enrollment fetched successfully", enrollment);
  }
);

export const getEnrollmentByCourse = asyncHandler(
  async (req: AuthRequest, res: Response) => {
    const { courseId } = req.params as GetEnrollmentByCourseParams;
    const studentId = req.user!.sub;

    const enrollment = await Enrollment.findOne({
      student: studentId,
      course: courseId,
    }).populate({
      path: "course",
      populate: {
        path: "instructor",
        select: "firstName lastName email",
      },
    });

    if (!enrollment) {
      throw new ApiError(404, "Not enrolled in this course");
    }

    successResponse(res, "Enrollment fetched successfully", enrollment);
  }
);

export const getCourseStudents = asyncHandler(
  async (req: AuthRequest, res: Response) => {
    const { courseId } = req.params as GetEnrollmentByCourseParams;
    // const userId = req.user!.sub;

    const course = await Course.findById(courseId);
    if (!course) {
      throw new ApiError(404, "Course not found");
    }

    const enrollments = await Enrollment.find({ course: courseId })
      .populate("student", "firstName lastName email")
      .sort({ enrolledAt: -1 });

    successResponse(res, "Students fetched successfully", {
      total: enrollments.length,
      students: enrollments,
    });
  }
);

export const unenrollFromCourse = asyncHandler(
  async (req: AuthRequest, res: Response) => {
    const { enrollmentId } = req.params as GetEnrollmentParams;
    const studentId = req.user!.sub;

    const enrollment = await Enrollment.findById(enrollmentId);

    if (!enrollment) {
      throw new ApiError(404, "Enrollment not found");
    }

    if (enrollment.student.toString() !== studentId) {
      throw new ApiError(403, "Not authorized");
    }

    await Enrollment.findByIdAndDelete(enrollmentId);

    await Course.findByIdAndUpdate(enrollment.course, {
      $inc: { enrollmentCount: -1 },
    });

    successResponse(res, "Unenrolled successfully", null);
  }
);
