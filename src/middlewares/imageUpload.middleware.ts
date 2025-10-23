import { v2 as cloudinary } from "cloudinary";

export const imageUpload = async () => {
  try {
    cloudinary.config({
      cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
      api_key: process.env.CLOUDINARY_API_KEY,
      api_secret: process.env.CLOUDINARY_API_SECRET,
    });

    

  } catch (err) {
    console.log("Error in image upload", err);
  }
};
