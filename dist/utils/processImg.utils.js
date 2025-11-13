"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.extractJobDetailsFromImage = void 0;
const openai_1 = __importDefault(require("openai"));
const tesseract_js_1 = __importDefault(require("tesseract.js"));
const extractJobDetailsFromImage = async (imgPath) => {
    const { data } = await tesseract_js_1.default.recognize(imgPath, "eng");
    const prompt = `
    Extract structured job info from this text:
    ${data?.text}
  
    Return JSON with:
    { "companyName": "", "title": "", "jobType": "", "keywords": [] }
    `;
    try {
        const client = new openai_1.default({
            apiKey: process.env.OPEN_AI_API_KEY,
        });
        const response = await client.chat.completions.create({
            model: "gpt-4.1-mini",
            messages: [
                {
                    role: "user",
                    content: prompt,
                },
            ],
        });
        let content = response?.choices[0]?.message?.content ?? "";
        content = content.replace(/```json|```/g, "").trim();
        const parsed = JSON.parse(content);
        return parsed;
    }
    catch (err) {
        console.error("❌ Error extracting job details:", err);
        return null;
    }
};
exports.extractJobDetailsFromImage = extractJobDetailsFromImage;
