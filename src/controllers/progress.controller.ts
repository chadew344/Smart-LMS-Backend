import { Response } from "express";
import { LessonProgress } from "../models/progress.model";
import { Enrollment } from "../models/enrollment.model";
import { Course } from "../models/course.model";
import { asyncHandler } from "../utils/asyncHandler";
import { ApiError } from "../utils/ApiError";
import { successResponse } from "../utils/successResponse";
import { AuthRequest } from "../types/auth.types";
import { ProgressStatus } from "../types/course.type";
import {
  MarkLessonCompleteInput,
  GetProgressByCourseParams,
  UpdateProgressInput,
  UpdateProgressParams,
} from "../validate/progress.schema";

export const markLessonComplete = asyncHandler(
  async (req: AuthRequest, res: Response) => {
    const { courseId, moduleId, lessonId, status, score, timeSpent } =
      req.body as MarkLessonCompleteInput;
    const studentId = req.user!.sub;

    const enrollment = await Enrollment.findOne({
      student: studentId,
      course: courseId,
    });

    if (!enrollment) {
      throw new ApiError(400, "You must be enrolled in this course");
    }

    const course = await Course.findById(courseId);
    if (!course) {
      throw new ApiError(404, "Course not found");
    }

    let progress = await LessonProgress.findOne({
      student: studentId,
      course: courseId,
      lessonId: lessonId,
    });

    if (progress) {
      progress.status = status;
      progress.moduleId = moduleId as any;
      if (score !== undefined) progress.score = score;
      if (timeSpent !== undefined) progress.timeSpent += timeSpent;
      if (status === ProgressStatus.COMPLETED) {
        progress.completedAt = new Date();
      }
      progress.attempts += 1;
      await progress.save();
    } else {
      progress = await LessonProgress.create({
        student: studentId,
        course: courseId,
        moduleId: moduleId,
        lessonId: lessonId,
        status: status,
        score: score,
        timeSpent: timeSpent || 0,
        attempts: 1,
        completedAt:
          status === ProgressStatus.COMPLETED ? new Date() : undefined,
      });
    }

    await updateEnrollmentProgress(studentId, courseId, course);

    await Enrollment.findOneAndUpdate(
      { student: studentId, course: courseId },
      {
        currentModuleId: moduleId,
        currentLessonId: lessonId,
        lastAccessedAt: new Date(),
      }
    );

    successResponse(res, "Progress updated successfully", progress);
  }
);

export const getProgressByCourse = asyncHandler(
  async (req: AuthRequest, res: Response) => {
    const { courseId } = req.params as GetProgressByCourseParams;
    const studentId = req.user!.sub;

    const enrollment = await Enrollment.findOne({
      student: studentId,
      course: courseId,
    });

    if (!enrollment) {
      throw new ApiError(400, "You are not enrolled in this course");
    }

    const progressRecords = await LessonProgress.find({
      student: studentId,
      course: courseId,
    }).sort({ createdAt: 1 });

    const course = await Course.findById(courseId);

    if (!course) {
      throw new ApiError(404, "Course not found");
    }

    const totalLessons = course.totalLessons || 0;
    const completedLessons = progressRecords.filter(
      (p) => p.status === ProgressStatus.COMPLETED
    ).length;
    const completionPercentage =
      totalLessons > 0
        ? Math.round((completedLessons / totalLessons) * 100)
        : 0;

    successResponse(res, "Progress fetched successfully", {
      enrollment: {
        _id: enrollment._id,
        completionPercentage: enrollment.completionPercentage,
        status: enrollment.status,
        currentModuleId: enrollment.currentModuleId,
        currentLessonId: enrollment.currentLessonId,
        lastAccessedAt: enrollment.lastAccessedAt,
      },
      stats: {
        totalLessons,
        completedLessons,
        inProgressLessons: progressRecords.filter(
          (p) => p.status === ProgressStatus.IN_PROGRESS
        ).length,
        completionPercentage,
      },
      progress: progressRecords,
    });
  }
);

export const getLessonProgress = asyncHandler(
  async (req: AuthRequest, res: Response) => {
    const { courseId, lessonId } = req.params;
    const studentId = req.user!.sub;

    const progress = await LessonProgress.findOne({
      student: studentId,
      course: courseId,
      lessonId: lessonId,
    });

    if (!progress) {
      return successResponse(res, "No progress yet", {
        status: ProgressStatus.NOT_STARTED,
        completedAt: null,
        score: null,
        attempts: 0,
        timeSpent: 0,
      });
    }

    successResponse(res, "Lesson progress fetched successfully", progress);
  }
);

export const updateProgress = asyncHandler(
  async (req: AuthRequest, res: Response) => {
    const { progressId } = req.params as UpdateProgressParams;
    const updateData = req.body as UpdateProgressInput;
    const studentId = req.user!.sub;

    const progress = await LessonProgress.findById(progressId);

    if (!progress) {
      throw new ApiError(404, "Progress record not found");
    }

    if (progress.student.toString() !== studentId) {
      throw new ApiError(403, "Not authorized to update this progress");
    }

    if (updateData.status) progress.status = updateData.status;
    if (updateData.score !== undefined) progress.score = updateData.score;
    if (updateData.timeSpent !== undefined)
      progress.timeSpent += updateData.timeSpent;

    if (
      updateData.status === ProgressStatus.COMPLETED &&
      !progress.completedAt
    ) {
      progress.completedAt = new Date();
    }

    await progress.save();

    const course = await Course.findById(progress.course);
    if (course) {
      await updateEnrollmentProgress(
        studentId,
        progress.course.toString(),
        course
      );
    }

    successResponse(res, "Progress updated successfully", progress);
  }
);

export const getCourseProgressAll = asyncHandler(
  async (req: AuthRequest, res: Response) => {
    const { courseId } = req.params as GetProgressByCourseParams;
    // const userId = req.user!.sub;

    const course = await Course.findById(courseId);
    if (!course) {
      throw new ApiError(404, "Course not found");
    }

    const enrollments = await Enrollment.find({ course: courseId }).populate(
      "student",
      "firstName lastName email"
    );

    const progressRecords = await LessonProgress.find({ course: courseId });

    const studentProgress = enrollments.map((enrollment) => {
      const studentProgressRecords = progressRecords.filter(
        (p) => p.student.toString() === enrollment.student._id.toString()
      );

      const completedLessons = studentProgressRecords.filter(
        (p) => p.status === ProgressStatus.COMPLETED
      ).length;

      return {
        student: enrollment.student,
        enrollment: {
          _id: enrollment._id,
          enrolledAt: enrollment.enrolledAt,
          lastAccessedAt: enrollment.lastAccessedAt,
          completionPercentage: enrollment.completionPercentage,
          status: enrollment.status,
        },
        stats: {
          totalLessons: course.totalLessons || 0,
          completedLessons,
          inProgressLessons: studentProgressRecords.filter(
            (p) => p.status === ProgressStatus.IN_PROGRESS
          ).length,
        },
      };
    });

    successResponse(res, "Course progress fetched successfully", {
      course: {
        _id: course._id,
        title: course.title,
        totalLessons: course.totalLessons,
      },
      totalStudents: enrollments.length,
      students: studentProgress,
    });
  }
);

async function updateEnrollmentProgress(
  studentId: string,
  courseId: string,
  course: any
) {
  const completedCount = await LessonProgress.countDocuments({
    student: studentId,
    course: courseId,
    status: ProgressStatus.COMPLETED,
  });

  const totalLessons = course.totalLessons || 0;
  const completionPercentage =
    totalLessons > 0 ? Math.round((completedCount / totalLessons) * 100) : 0;

  const updateData: any = {
    completionPercentage,
  };

  if (completionPercentage === 100) {
    updateData.status = "completed";
    updateData.completedAt = new Date();
  }

  await Enrollment.findOneAndUpdate(
    { student: studentId, course: courseId },
    updateData
  );
}
