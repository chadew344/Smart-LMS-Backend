import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import mongoose from "mongoose";
dotenv.config();

const PORT = process.env.PORT;
const MONGO_URI = process.env.MONGO_URI as string;

const app = express();

app.use(express.json());

app.use(
  cors({
    origin: ["http://localhost:5173"],
    methods: ["GET", "POST", "PUT", "DELETE"],
  })
);

app.get("/", (req, res) => {
  res.send("Backend Running....");
});

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
  console.log("Server is running");
});
