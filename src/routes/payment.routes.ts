import express from "express";
import { authenticate } from "../middleware/auth.middleware";
import {
  createPaymentSession,
  verifyPayment,
} from "../controllers/payment.controller";

const router = express.Router();

router.post("/create-session", authenticate, createPaymentSession);
router.post("/verify", verifyPayment);

export default router;
