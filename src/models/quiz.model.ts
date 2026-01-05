import mongoose, { Schema, Document } from "mongoose";
import { ProgressStatus } from "../types/course.type";

export interface IQuiz extends Document {
  _id: mongoose.Types.ObjectId;
  title: string;
  description: string;
  courseName: string;
  questions: number;
  duration: number;
  attempts?: number;
  bestScore?: number;
  status: ProgressStatus;
  dueDate?: string;
  createdAt: Date;
  updatedAt: Date;
}

const QuizSchema = new Schema<IQuiz>(
  {
    title: { type: String, required: true },
    description: { type: String, required: true },
    courseName: { type: String, required: true },

    questions: { type: Number, required: true },
    duration: { type: Number, required: true },

    attempts: { type: Number },
    bestScore: { type: Number },

    status: {
      type: String,
      enum: {
        values: Object.values(ProgressStatus),
        message: "{VALUE} is not a valid Quiz status",
      },
      required: true,
    },

    dueDate: { type: String },
  },
  { timestamps: true }
);

export const Quiz = mongoose.model<IQuiz>("Quiz", QuizSchema);
