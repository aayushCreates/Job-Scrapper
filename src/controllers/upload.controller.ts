import cloudinary from "@/utils/cloudinary.utils";
import { Request, Response, NextFunction } from "express";


export const uploadImage = async (req: Request, res: Response, next: NextFunction) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: "No file uploaded" });
    }

    // Convert buffer to data URI for Cloudinary
    const dataURI = `data:${req.file.mimetype};base64,${req.file.buffer.toString('base64')}`;

    const uploadResult = await cloudinary.uploader.upload(dataURI, {
      folder: "job_images"
    });

    return res.status(200).json({
      message: "Image uploaded successfully",
      data: uploadResult.secure_url,
    });
  } catch (error) {
    console.error("Upload Error:", error);
    return res.status(500).json({ message: "Server Error", error });
  }
}


