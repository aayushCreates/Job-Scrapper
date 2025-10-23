import { Request, Response, NextFunction } from "express";
import cloudinary from 'cloudinary';

export const imageUpload = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {

    const path = await cloudinary.v2.uploader.upload()

    const fileCloudPath = req.file?.path;
    if (!fileCloudPath) {
      return res.status(404).json({
        success: false,
        message: "file cannot upload successfully, please try again",
      });
    }

    return res.status(200).json({
      success: true,
      message: "file uploaded successfully",
      data: fileCloudPath,
    });
  } catch (err) {
    console.log("Error in image scrapping", err);
  }
};
