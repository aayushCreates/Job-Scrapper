import { uploadImage } from "@/controllers/upload.controller";
import { upload } from "@/middlewares/multer.middleware";
import { Router } from "express";

const uploadRouter =  Router();

uploadRouter.post('/', upload.single("image"), uploadImage);



export default uploadRouter;