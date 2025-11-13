"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.formattedJobDetails = void 0;
const openai_1 = __importDefault(require("openai"));
const cheerio = __importStar(require("cheerio")); // Import cheerio
// Helper function to extract relevant job content from HTML
const extractJobContent = (htmlContent) => {
    const $ = cheerio.load(htmlContent);
    let extractedText = "";
    // Prioritize common job detail sections
    const selectors = [
        "h1", "h2", "h3", "h4", "h5", "h6", // Headings
        "p", // Paragraphs
        "li", // List items
        "div.job-description", // Common class names
        "div.description",
        "div.content",
        "section",
        "article",
    ];
    selectors.forEach(selector => {
        $(selector).each((i, element) => {
            const text = $(element).text().trim();
            if (text) {
                extractedText += text + "\n\n"; // Add some separation
            }
        });
    });
    // Fallback: if not much is found, get text from body or a main container
    if (extractedText.length < 200) { // Arbitrary threshold to check if enough content was extracted
        extractedText = $("body").text().trim();
    }
    // Limit the extracted text to a reasonable size to avoid exceeding token limits
    // This is a heuristic, actual limit might vary based on model and prompt size
    const MAX_CONTENT_LENGTH = 4000; // Roughly 1000 tokens, adjust as needed
    if (extractedText.length > MAX_CONTENT_LENGTH) {
        extractedText = extractedText.substring(0, MAX_CONTENT_LENGTH) + "... [content truncated]";
    }
    return extractedText;
};
const formattedJobDetails = async (jobDetailsHtml) => {
    const client = new openai_1.default({
        apiKey: process.env.OPEN_AI_API_KEY,
    });
    // Extract concise content from the HTML
    const conciseJobContent = extractJobContent(jobDetailsHtml);
    const prompt = `You are a strict formatter assistant.
    And your job is to make the given raw scrapped job content into proper json format given below
    {
        title: string,
        position: string,
        description: string,
        requiredSkills: string[],
        allowedYears: string,
        allowedBranches: string[],
        salary: string,
        jobUrl: string,
        companyName: string,
        postedAt: string (ISO 8601 format),
        createdAt: string (ISO 8601),
        updatedAt: string (ISO 8601)
    }
    
    if you find that a particular key data is not present then treat as empty or according to the dataType. and also if you find that same position or title are present more than once then according to the post data give me different different json formatted data for job title or position.

    ### Rules:
        - Normalize \`requiredSkills\` to an array (e.g. split on commas).
        - Keep \`salary\` as a string (e.g. "₹5–8 LPA", "Not disclosed").
        - Ensure all date fields are ISO strings (e.g. "2025-10-20T00:00:00Z").
        - Return only the JSON array. No markdown, no explanation.

        Here is the data:
        ${JSON.stringify(conciseJobContent)}
    `;
    const response = await client.responses.create({
        model: 'gpt-4.1-mini',
        input: prompt
    });
    const textOutput = response.output_text || "";
    try {
        const parsed = JSON.parse(textOutput);
        return parsed;
    }
    catch (err) {
        console.error("Failed to parse formatted job JSON:", err);
        console.log("Raw output:", textOutput);
        return null;
    }
};
exports.formattedJobDetails = formattedJobDetails;
