import mongoose, { Schema, model, Types, Document } from "mongoose";
import { EnrollmentStatus } from "../types/course.type";
import { PaymentStatus } from "../types/payment.types";

export interface IEnrollment extends Document {
  _id: mongoose.Types.ObjectId;
  student: mongoose.Types.ObjectId;
  course: mongoose.Types.ObjectId;

  status: EnrollmentStatus;
  enrolledAt: Date;
  completedAt?: Date;

  completionPercentage: number;
  certificateIssued: boolean;

  currentModuleId?: Types.ObjectId;
  currentLessonId?: Types.ObjectId;

  paymentStatus: PaymentStatus;
  paymentIntentId?: string;
  amountPaid?: number;

  lastAccessedAt: Date;
  timeSpent: number;

  updatedAt: Date;
}

const EnrollmentSchema = new Schema<IEnrollment>(
  {
    student: { type: Schema.Types.ObjectId, ref: "User", required: true },
    course: { type: Schema.Types.ObjectId, ref: "Course", required: true },

    status: {
      type: String,
      enum: {
        values: Object.values(EnrollmentStatus),
        message: "{VALUE} is not a valid Enrollment Status",
      },
      default: EnrollmentStatus.ACTIVE,
    },

    enrolledAt: { type: Date, default: Date.now },
    completedAt: Date,

    completionPercentage: { type: Number, default: 0 },
    certificateIssued: { type: Boolean, default: false },

    currentModuleId: Schema.Types.ObjectId,
    currentLessonId: Schema.Types.ObjectId,

    paymentStatus: {
      type: String,
      enum: PaymentStatus,
      default: PaymentStatus.PENDING,
    },
    paymentIntentId: String,
    amountPaid: Number,

    lastAccessedAt: { type: Date, default: Date.now },
    timeSpent: { type: Number, default: 0 },
  },
  { timestamps: true }
);

EnrollmentSchema.index({ student: 1, course: 1 }, { unique: true });

export const Enrollment = model<IEnrollment>("Enrollment", EnrollmentSchema);
