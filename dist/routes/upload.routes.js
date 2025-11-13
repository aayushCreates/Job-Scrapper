"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const upload_controller_1 = require("../controllers/upload.controller");
const multer_middleware_1 = require("../middlewares/multer.middleware");
const express_1 = require("express");
const uploadRouter = (0, express_1.Router)();
uploadRouter.post('/', multer_middleware_1.upload.single("image"), upload_controller_1.uploadImage);
exports.default = uploadRouter;
