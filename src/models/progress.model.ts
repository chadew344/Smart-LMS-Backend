import mongoose, { Schema, model, Document } from "mongoose";
import { ProgressStatus } from "../types/course.type";

export interface ILessonProgress extends Document {
  _id: mongoose.Types.ObjectId;
  student: mongoose.Types.ObjectId;
  course: mongoose.Types.ObjectId;
  moduleId: mongoose.Types.ObjectId;
  lessonId: mongoose.Types.ObjectId;

  status: ProgressStatus;
  completedAt?: Date;

  score?: number;
  attempts: number;
  timeSpent: number;
}

const LessonProgressSchema = new Schema<ILessonProgress>(
  {
    student: { type: Schema.Types.ObjectId, ref: "User", required: true },
    course: { type: Schema.Types.ObjectId, ref: "Course", required: true },

    moduleId: { type: Schema.Types.ObjectId, required: true },
    lessonId: { type: Schema.Types.ObjectId, required: true },

    status: {
      type: String,
      enum: {
        values: Object.values(ProgressStatus),
        message: "{VALUE} is not a valid Progres Status",
      },
      default: ProgressStatus.NOT_STARTED,
    },

    completedAt: Date,
    score: Number,
    attempts: { type: Number, default: 0 },
    timeSpent: { type: Number, default: 0 },
  },
  { timestamps: true }
);

LessonProgressSchema.index(
  { student: 1, course: 1, lessonId: 1 },
  { unique: true }
);

export const LessonProgress = model<ILessonProgress>(
  "LessonProgress",
  LessonProgressSchema
);
