import mongoose, { Schema, model, Document } from "mongoose";

export interface IQuizSubmission extends Document {
  _id: mongoose.Types.ObjectId;
  student: mongoose.Types.ObjectId;
  quiz: mongoose.Types.ObjectId;
  course: mongoose.Types.ObjectId;

  answers: any[];
  score: number;
  passed: boolean;

  attemptNumber: number;
  submittedAt: Date;
}

const QuizSubmissionSchema = new Schema<IQuizSubmission>(
  {
    student: { type: Schema.Types.ObjectId, ref: "User", required: true },
    quiz: { type: Schema.Types.ObjectId, ref: "Quiz", required: true },
    course: { type: Schema.Types.ObjectId, ref: "Course", required: true },

    answers: { type: Schema.Types.Mixed, required: true },
    score: { type: Number, required: true },
    passed: { type: Boolean, required: true },

    attemptNumber: { type: Number, required: true },
    submittedAt: { type: Date, default: Date.now },
  },
  { timestamps: true }
);

QuizSubmissionSchema.index({ student: 1, quiz: 1 });

export const QuizSubmission = model<IQuizSubmission>(
  "QuizSubmission",
  QuizSubmissionSchema
);
