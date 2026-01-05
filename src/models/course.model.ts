import mongoose, { Document, Schema } from "mongoose";
import { Category, Level, MediaType } from "../types/course.type";
import { LessonType } from "../types/course.type";

export interface ILesson {
  _id?: mongoose.Types.ObjectId;
  title: string;
  description?: string;
  type: LessonType;
  duration?: number;
  order: number;

  video?: {
    url: string;
    publicId: string;
    format: string;
    size: number;
    resourceType: MediaType;
  };

  readingContent?: string;
  quizId?: mongoose.Types.ObjectId;
  resources?: string[];
}

export const LessonSchema = new Schema<ILesson>(
  {
    title: {
      type: String,
      required: [true, "Lesson title is required"],
      trim: true,
    },
    description: {
      type: String,
      trim: true,
    },
    type: {
      type: String,
      enum: {
        values: Object.values(LessonType),
        message: "{VALUE} is not a valid lesson type",
      },
      required: [true, "Lesson type is required"],
      default: LessonType.VIDEO,
    },
    duration: {
      type: Number,
      min: 0,
    },
    order: {
      type: Number,
      required: [true, "Lesson order is required"],
    },
    video: {
      url: { type: String, trim: true },
      publicId: { type: String, trim: true },
      format: { type: String },
      size: { type: Number },
      resourceType: {
        type: String,
        enum: MediaType,
        default: MediaType.VIDEO,
      },
    },
    readingContent: {
      type: String,
    },
    quizId: {
      type: Schema.Types.ObjectId,
      ref: "Quiz",
    },
    resources: [
      {
        type: String,
        trim: true,
      },
    ],
  },
  {
    timestamps: true,
  }
);

export interface IModule {
  _id?: mongoose.Types.ObjectId;
  title: string;
  description?: string;
  order: number;
  lessons: ILesson[];
}

export const ModuleSchema = new Schema<IModule>(
  {
    title: {
      type: String,
      required: [true, "Module title is required"],
      trim: true,
    },
    description: {
      type: String,
      trim: true,
    },
    order: {
      type: Number,
      required: [true, "Module order is required"],
    },
    lessons: {
      type: [LessonSchema],
      default: [],
    },
  },
  {
    timestamps: true,
  }
);

export interface ICourse extends Document {
  _id: mongoose.Types.ObjectId;
  title: string;
  description: string;

  thumbnail?: {
    url: string;
    publicId: string;
    format: string;
    size: number;
    resourceType: MediaType;
  };

  instructor: mongoose.Types.ObjectId;
  category: string;
  level: Level;
  price: number;

  modules: IModule[];

  requirements?: string[];
  learningOutcomes?: string[];
  enableSequentialLearning: boolean;

  totalDuration?: number;
  totalLessons?: number;
  enrollmentCount: number;
  rating?: number;

  isPublished: boolean;

  createdAt: Date;
  updatedAt: Date;
}

const CourseSchema = new Schema<ICourse>(
  {
    title: {
      type: String,
      required: [true, "Course title is required"],
      trim: true,
      maxlength: [100, "Title cannot exceed 100 characters"],
    },
    description: {
      type: String,
      required: [true, "Course description is required"],
      maxlength: [2000, "Description cannot exceed 2000 characters"],
    },

    thumbnail: {
      url: { type: String, trim: true },
      publicId: { type: String, trim: true },
      format: { type: String },
      size: { type: Number },
      resourceType: {
        type: String,
        enum: MediaType,
        default: MediaType.IMAGE,
      },
    },

    instructor: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: [true, "Instructor is required"],
    },
    category: {
      type: String,
      required: [true, "Category is required"],
      enum: {
        values: Object.values(Category),
        message: "{VALUE} is not a valid Category",
      },
    },
    level: {
      type: String,
      enum: {
        values: Object.values(Level),
        message: "{VALUE} is not a valid level",
      },
      default: Level.BEGINNER,
      required: true,
    },
    price: {
      type: Number,
      required: true,
      min: 0,
      default: 0,
    },
    modules: {
      type: [ModuleSchema],
      default: [],
    },
    requirements: [
      {
        type: String,
        trim: true,
      },
    ],
    learningOutcomes: [
      {
        type: String,
        trim: true,
      },
    ],
    enableSequentialLearning: {
      type: Boolean,
      default: false,
    },
    totalDuration: {
      type: Number,
      default: 0,
    },
    totalLessons: {
      type: Number,
      default: 0,
    },
    enrollmentCount: {
      type: Number,
      default: 0,
    },
    rating: {
      type: Number,
      min: 0,
      max: 5,
    },
    isPublished: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  }
);

CourseSchema.pre("save", function () {
  this.totalLessons = this.modules.reduce((total, module) => {
    return total + module.lessons.length;
  }, 0);

  this.totalDuration = this.modules.reduce((total, module) => {
    const moduleDuration = module.lessons.reduce((sum, lesson) => {
      return sum + (lesson.duration || 0);
    }, 0);
    return total + moduleDuration;
  }, 0);
});

CourseSchema.index({ instructor: 1 });
CourseSchema.index({ category: 1 });
CourseSchema.index({ isPublished: 1 });
CourseSchema.index({ level: 1 });
CourseSchema.index({ title: "text", description: "text" });

export const Course = mongoose.model<ICourse>("Course", CourseSchema);
