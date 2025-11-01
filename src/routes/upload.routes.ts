import { uploadImage } from "../controllers/upload.controller";
import { upload } from "../middlewares/multer.middleware";
import { Request, Response, NextFunction, Router } from "express";

const uploadRouter =  Router();

uploadRouter.post('/', upload.single("image"), uploadImage);
uploadRouter.use((err, req: Request, res: Response, next: NextFunction) => {
    console.error("🔥 Multer or middleware error:", err);
    res.status(500).json({
      message: "Middleware failed",
      error: err instanceof Error ? err.message : err,
    });
  });


export default uploadRouter;