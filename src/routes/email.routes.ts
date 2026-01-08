import { Router } from "express";
import { authenticate } from "../middleware/auth.middleware";
import { sendNotification } from "../controllers/email.controller";
import { validate } from "../middleware/validate.middleware";
import { emailSchema } from "../validate/email.schema";

const router = Router();

router.post("/", authenticate, validate(emailSchema), sendNotification);

export default router;
