import { Readable } from "stream";
import { Response } from "express";
import cloudinary from "../config/cloudinary";
import { asyncHandler } from "../utils/asyncHandler";
import { successResponse } from "../utils/successResponse";
import { AuthRequest } from "../types/auth.types";
import { ApiError } from "../utils/ApiError";
import { MediaType } from "../types/course.type";

const BASE_FOLDER = process.env.CLOUDINARY_FOLDER as string;

export const uploadMediaToCloudinary = asyncHandler(
  async (req: AuthRequest, res: Response) => {
    if (!req.file) {
      throw new ApiError(400, "No file uploaded");
    }

    const { mimetype, buffer } = req.file;
    const isVideo = mimetype.startsWith("video");

    const uploadResult = await new Promise<any>((resolve, reject) => {
      const uploadStream = cloudinary.uploader.upload_stream(
        {
          folder: isVideo ? `${BASE_FOLDER}/videos` : `${BASE_FOLDER}/images`,
          resource_type: isVideo ? "video" : "image",
        },
        (error, result) => {
          if (error) reject(error);
          else resolve(result);
        }
      );

      Readable.from(buffer).pipe(uploadStream);
    });

    successResponse(
      res,
      "Upload successful",
      {
        url: uploadResult.secure_url,
        publicId: uploadResult.public_id,
        resourceType: isVideo ? MediaType.VIDEO : MediaType.IMAGE,
        format: uploadResult.format,
        size: uploadResult.bytes,
      },
      201
    );
  }
);

export const deleteMediaFromCloudinary = asyncHandler(
  async (req: AuthRequest, res: Response) => {
    const { publicId, resourceType } = req.body;

    if (!publicId) {
      throw new ApiError(400, "publicId is required to delete a file");
    }

    const result = await cloudinary.uploader.destroy(publicId, {
      resource_type: resourceType === MediaType.VIDEO ? "video" : "image",
    });

    if (result.result !== "ok") {
      throw new ApiError(400, "Failed to delete file from Cloudinary");
    }

    successResponse(res, "File deleted successfully", null, 200);
  }
);
