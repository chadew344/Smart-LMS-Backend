import { Response } from "express";
import { asyncHandler } from "../utils/asyncHandler";
import { successResponse } from "../utils/successResponse";
import { Course } from "../models/course.model";
import {
  CreateCourseInput,
  UpdateCourseInput,
  UpdateCourseParams,
  GetCourseParams,
  DeleteCourseParams,
  PublishCourseParams,
  GetCoursesQuery,
} from "../validate/course.schema";
import { ApiError } from "../utils/ApiError";
import { AuthRequest } from "../types/auth.types";

export const getCourses = asyncHandler(
  async (req: AuthRequest, res: Response) => {
    const {
      category,
      level,
      search,
      page = "1",
      limit = "12",
    } = req.query as GetCoursesQuery;

    const query: any = { isPublished: true };

    if (category) query.category = category;
    if (level) query.level = level;
    if (search) {
      query.$or = [
        { title: { $regex: search, $options: "i" } },
        { description: { $regex: search, $options: "i" } },
      ];
    }

    const pageNum = parseInt(page);
    const limitNum = parseInt(limit);
    const skip = (pageNum - 1) * limitNum;

    const courses = await Course.find(query)
      .populate("instructor", "firstName lastName email")
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limitNum);

    const total = await Course.countDocuments(query);

    successResponse(res, "Courses fetched successfully", {
      courses,
      pagination: {
        page: pageNum,
        limit: limitNum,
        total,
        pages: Math.ceil(total / limitNum),
      },
    });
  }
);

export const getCourse = asyncHandler(
  async (req: AuthRequest, res: Response) => {
    const { courseId } = req.params as GetCourseParams;

    const course = await Course.findById(courseId).populate(
      "instructor",
      "firstName lastName email bio"
    );

    if (!course) {
      throw new ApiError(404, "Course not found");
    }

    successResponse(res, "Course fetched successfully", course);
  }
);

export const createCourse = asyncHandler(
  async (req: AuthRequest, res: Response) => {
    const body = req.body as CreateCourseInput;
    const instructorId = req.user!.sub;

    const course = await Course.create({
      title: body.title,
      description: body.description,
      category: body.category,
      level: body.level,
      price: body.price,
      thumbnail: body.thumbnail,
      modules: body.modules,
      requirements: body.requirements,
      learningOutcomes: body.learningOutcomes,
      enableSequentialLearning: body.enableSequentialLearning || false,
      instructor: instructorId,
      isPublished: false,
    });

    const populatedCourse = await Course.findById(course._id).populate(
      "instructor",
      "firstName lastName email"
    );

    successResponse(res, "Course created successfully", populatedCourse, 201);
  }
);

export const updateCourse = asyncHandler(
  async (req: AuthRequest, res: Response) => {
    const { courseId } = req.params as UpdateCourseParams;
    const updateData = req.body as UpdateCourseInput;
    const userId = req.user!.sub;

    const course = await Course.findById(courseId);

    if (!course) {
      throw new ApiError(404, "Course not found");
    }

    if (course.instructor.toString() !== userId) {
      throw new ApiError(403, "Not authorized to update this course");
    }

    const updatedCourse = await Course.findByIdAndUpdate(courseId, updateData, {
      new: true,
      runValidators: true,
    }).populate("instructor", "firstName lastName email");

    successResponse(res, "Course updated successfully", updatedCourse);
  }
);

export const deleteCourse = asyncHandler(
  async (req: AuthRequest, res: Response) => {
    const { courseId } = req.params as DeleteCourseParams;
    const userId = req.user!.sub;

    const course = await Course.findById(courseId);

    if (!course) {
      throw new ApiError(404, "Course not found");
    }

    if (course.instructor.toString() !== userId) {
      throw new ApiError(403, "Not authorized to delete this course");
    }

    await course.deleteOne();

    successResponse(res, "Course deleted successfully", null);
  }
);

export const publishCourse = asyncHandler(
  async (req: AuthRequest, res: Response) => {
    const { courseId } = req.params as PublishCourseParams;
    const userId = req.user!.sub;

    const course = await Course.findById(courseId);

    if (!course) {
      throw new ApiError(404, "Course not found");
    }

    if (course.instructor.toString() !== userId) {
      throw new ApiError(403, "Not authorized to publish this course");
    }

    if (course.modules.length === 0) {
      throw new ApiError(
        400,
        "Course must have at least one module to publish"
      );
    }

    const totalLessons = course.modules.reduce(
      (sum, module) => sum + module.lessons.length,
      0
    );
    if (totalLessons < 3) {
      throw new ApiError(400, "Course must have at least 3 lessons to publish");
    }

    course.isPublished = !course.isPublished;
    await course.save();

    await course.populate("instructor", "firstName lastName email");

    successResponse(
      res,
      `Course ${course.isPublished ? "published" : "unpublished"} successfully`,
      course
    );
  }
);

export const getInstructorCourses = asyncHandler(
  async (req: AuthRequest, res: Response) => {
    const instructorId = req.user!.sub;

    const courses = await Course.find({ instructor: instructorId }).sort({
      createdAt: -1,
    });

    successResponse(res, "Courses fetched successfully", courses);
  }
);
