import multer from "multer";
import { storage } from "@/utils/cloudinary.utils";

export const upload = multer({ storage });
