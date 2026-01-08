import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import mongoose from "mongoose";
import authRouter from "./routes/auth.routes";
import courseRouter from "./routes/course.routes";
import enrollmentRoutes from "./routes/enrollement.routes";
import progressRoutes from "./routes/progress.routes";
import uploadRoutes from "./routes/upload.routes";
import aiRoutes from "./routes/ai.routes";
import emailRoutes from "./routes/email.routes";
import { errorHandler } from "./middleware/error.middleware";
import cookieParser from "cookie-parser";
dotenv.config();

const PORT = process.env.PORT || 5000;
const MONGO_URI = process.env.MONGO_URI as string;

const app = express();

app.use(express.json());

app.use(cookieParser());

app.use(
  cors({
    origin: ["http://localhost:5173"],
    methods: ["GET", "POST", "PUT", "DELETE"],
    credentials: true,
  })
);

app.use("/api/v1/auth", authRouter);

app.use("/api/v1/courses", courseRouter);

app.use("/api/v1/enrollments", enrollmentRoutes);

app.use("/api/v1/progress", progressRoutes);

app.use("/api/v1/upload", uploadRoutes);

app.use("/api/v1/ai", aiRoutes);

app.use("/api/v1/email", emailRoutes);

app.get("/", (_req, res) => {
  res.send("Backend Running....");
});

app.use(errorHandler);

mongoose
  .connect(MONGO_URI)
  .then(() => {
    console.log("DB Connected");
  })
  .catch((err) => {
    console.error(err);
    process.exit(1);
  });

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
