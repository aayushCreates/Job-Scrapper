import { imageUpload } from "@/controllers/imageScrapping.controller";
import { Router } from "express";
import { upload } from 'cloudinary';

const imageScrapperRoute = Router(); 


imageScrapperRoute.post('/upload', upload.single("image"), imageUpload);
imageScrapperRoute.get('');

export default imageScrapperRoute;