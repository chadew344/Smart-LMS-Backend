import { Response } from "express";
import { asyncHandler } from "../utils/asyncHandler";
import { AuthRequest } from "../types/auth.types";
import { ApiError } from "../utils/ApiError";
import { successResponse } from "../utils/successResponse";
import { Course } from "../models/course.model";
import stripe, { createCheckoutSession } from "../config/stripe.config";
import { User } from "../models/user.model";
import { Enrollment } from "../models/enrollment.model";

export const createPaymentSession = asyncHandler(
  async (req: AuthRequest, res: Response) => {
    const { courseId } = req.body;
    const studentId = req.user!.sub;

    const student = await User.findOne({ _id: studentId });

    if (!student) {
      throw new ApiError(404, "User not found");
    }

    const studentEmail = student.email;

    const course = await Course.findById(courseId);
    if (!course) {
      throw new ApiError(404, "Course not found");
    }

    if (course.price === 0) {
      throw new ApiError(400, "This course is free");
    }

    const existingEnrollment = await Enrollment.findOne({
      student: studentId,
      course: courseId,
    });

    if (existingEnrollment) {
      throw new ApiError(400, "Already enrolled in this course");
    }

    const session = await createCheckoutSession(
      courseId,
      course.title,
      course.price,
      studentId,
      studentEmail
    );

    successResponse(res, "Payment session created", {
      sessionId: session.id,
      url: session.url,
    });
  }
);

// export const verifyPayment = asyncHandler(
//   async (req: AuthRequest, res: Response) => {
//     const { sessionId } = req.body;

//     const session = await stripe.checkout.sessions.retrieve(sessionId);

//     if (session.payment_status !== "paid") {
//       throw new ApiError(400, "Payment not completed");
//     }

//     const { courseId, studentId } = session.metadata!;

//     const enrollment = await Enrollment.create({
//       student: studentId,
//       course: courseId,
//       paymentStatus: "completed",
//       paymentIntentId: session.payment_intent as string,
//       amountPaid: session.amount_total! / 100,
//     });

//     await Course.findByIdAndUpdate(courseId, {
//       $inc: { enrollmentCount: 1 },
//     });

//     const populatedEnrollment = await Enrollment.findById(enrollment._id)
//       .populate({
//         path: "course",
//         populate: {
//           path: "instructor",
//           select: "firstName lastName email",
//         },
//       })
//       .populate("student", "firstName lastName email");

//     successResponse(res, "Payment verified and enrolled", populatedEnrollment);
//   }
// );

export const verifyPayment = asyncHandler(
  async (req: AuthRequest, res: Response) => {
    const { sessionId } = req.body;

    const session = await stripe.checkout.sessions.retrieve(sessionId);

    if (session.payment_status !== "paid") {
      throw new ApiError(400, "Payment not completed");
    }

    const { courseId, studentId } = session.metadata!;

    const existingEnrollment = await Enrollment.findOne({
      student: studentId,
      course: courseId,
    });

    if (existingEnrollment) {
      return successResponse(
        res,
        "Payment already verified",
        existingEnrollment
      );
    }

    const enrollment = await Enrollment.create({
      student: studentId,
      course: courseId,
      paymentStatus: "completed",
      paymentIntentId: session.payment_intent as string,
      amountPaid: session.amount_total! / 100,
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

    successResponse(res, "Payment verified and enrolled", populatedEnrollment);
  }
);
