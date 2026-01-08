import { Router } from "express";
import { authenticate } from "../middleware/auth.middleware";
import { generateContent } from "../controllers/ai.controller";

const router = Router();

router.post("/chat", generateContent);

export default router;
