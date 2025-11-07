import { uploadImage } from "../controllers/upload.controller";
import { upload } from "../middlewares/multer.middleware";
import { Request, Response, NextFunction, Router } from "express";

const uploadRouter =  Router();

uploadRouter.post('/', upload.single("image"), uploadImage);


export default uploadRouter;