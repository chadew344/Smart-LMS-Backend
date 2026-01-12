import Stripe from "stripe";
import dotenv from "dotenv";
dotenv.config();

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: "2025-12-15.clover",
});

export const createPaymentIntent = async (
  amount: number,
  courseId: string,
  studentId: string
) => {
  const paymentIntent = await stripe.paymentIntents.create({
    amount: Math.round(amount * 100),
    currency: "usd",
    metadata: {
      courseId,
      studentId,
    },
  });

  return paymentIntent;
};

export const createCheckoutSession = async (
  courseId: string,
  courseName: string,
  amount: number,
  studentId: string,
  studentEmail: string
) => {
  const session = await stripe.checkout.sessions.create({
    payment_method_types: ["card"],
    line_items: [
      {
        price_data: {
          currency: "usd",
          product_data: {
            name: courseName,
          },
          unit_amount: Math.round(amount * 100),
        },
        quantity: 1,
      },
    ],
    mode: "payment",
    success_url: `${process.env.ALLOWED_ORIGINS}/payment/success?session_id={CHECKOUT_SESSION_ID}`,
    cancel_url: `${process.env.ALLOWED_ORIGINS}/payment/${courseId}`,
    customer_email: studentEmail,
    metadata: {
      courseId,
      studentId,
    },
  });

  return session;
};

export default stripe;
