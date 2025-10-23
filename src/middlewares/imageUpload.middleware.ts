import { v2 as cloudinary } from "cloudinary";
import { CloudinaryStorage } from "multer-storage-cloudinary";
import multer from 'multer';

export const imageUpload = async () => {
  try {
    cloudinary.config({
      cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
      api_key: process.env.CLOUDINARY_API_KEY,
      api_secret: process.env.CLOUDINARY_API_SECRET,
    });

    //  storage part creation for this img upload
    const storage = new CloudinaryStorage({
        cloudinary,
        params: {
            // folder: "uploads",
            allowed_formats: ["jpg", "png", "jpeg", "webp"],
        }
    });

    //  creation of upload middleware
    const upload = multer({
        storage
    });
  } catch (err) {
    console.log("Error in image upload", err);
  }
};
