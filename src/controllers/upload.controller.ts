import cloudinary from "@/utils/cloudinary.utils";
import { Request, Response, NextFunction } from "express";


export const uploadImage = async (req: Request, res: Response, next: NextFunction)=> {
    try {
        if (!req.file) {
            return res.status(400).json({ message: "No file uploaded" });
          }

          const result = await cloudinary.uploader.upload_stream(
            { folder: "job_images" },
            (err, uploadResult)=> {
                if (err) {
                    return res.status(500).json({ message: "Cloudinary upload failed", err });
                  }
          
                  return res.status(200).json({
                    message: "Image uploaded successfully",
                    data: uploadResult?.secure_url,
                  });
            }
          )
          req.file.stream.pipe(result);
        } catch (error) {
          console.error("Upload Error:", error);
          return res.status(500).json({ message: "Server Error", error });
        }
    }


