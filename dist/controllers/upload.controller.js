"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.uploadImage = void 0;
const uploadImage = async (req, res, next) => {
    try {
        if (!req.file) {
            return res.status(400).json({ message: "No file uploaded" });
        }
        return res.status(200).json({
            message: "Image uploaded successfully",
            data: {
                url: req.file.path,
                public_id: req.file.filename,
            },
        });
    }
    catch (error) {
        console.error("Upload Error:", error);
        return res.status(500).json({
            message: "Server Error",
            error: error instanceof Error ? error.message : error,
        });
    }
};
exports.uploadImage = uploadImage;
