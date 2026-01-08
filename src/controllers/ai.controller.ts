import axios from "axios";
import { Request, Response } from "express";
import dotenv from "dotenv";
import { successResponse } from "../utils/successResponse";
import { asyncHandler } from "../utils/asyncHandler";

dotenv.config();

const geminiClient = axios.create({
  baseURL:
    "https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent",
  headers: {
    "Content-Type": "application/json",
    "X-goog-api-key": process.env.GEMINI_API_KEY as string,
  },
  timeout: 15000,
});

export const generateContent = asyncHandler(
  async (req: Request, res: Response) => {
    const { text, maxToken } = req.body;

    if (!text || typeof text !== "string") {
      return res.status(400).json({
        success: false,
        message: "Text prompt is required",
      });
    }

    let response;

    for (let attempt = 1; attempt <= 3; attempt++) {
      try {
        response = await geminiClient.post("", {
          contents: [
            {
              parts: [{ text }],
            },
          ],
          generationConfig: {
            maxOutputTokens: maxToken ?? 50,
          },
        });
        break;
      } catch (error: any) {
        if (error.response?.status === 429 && attempt < 3) {
          await new Promise((r) => setTimeout(r, attempt * 2000));
        } else {
          throw error;
        }
      }
    }

    const generatedContent =
      response?.data?.candidates?.[0]?.content?.parts?.[0]?.text ??
      "No response from AI";

    successResponse(
      res,
      "AI generated response successfully",
      generatedContent
    );
  }
);
