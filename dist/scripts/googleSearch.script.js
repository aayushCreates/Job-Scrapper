"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.findCareerPage = void 0;
const axios_1 = __importDefault(require("axios"));
const findCareerPage = async (companyName) => {
    try {
        const apiKey = process.env.GOOGLE_API_KEY;
        const cx = process.env.GOOGLE_CX_ID;
        const query = `${companyName} careers OR jobs site:${companyName.toLowerCase().replace(/\s+/g, '')}.com`;
        const url = `https://www.googleapis.com/customsearch/v1?key=${apiKey}&cx=${cx}&q=${encodeURIComponent(query)}`;
        const { data } = await axios_1.default.get(url);
        const items = data.items || [];
        // Find the best match — prioritize URLs containing "career" or "job"
        const bestMatch = items.find((item) => /(career|careers|job|join-us)/i.test(item.link));
        // If none found, fallback to first result
        const selected = bestMatch || items[0];
        return {
            company: companyName,
            title: selected?.title,
            link: selected?.link,
            snippet: selected?.snippet,
        };
    }
    catch (err) {
        console.log("Error in google search api code: ", err);
        return null;
    }
};
exports.findCareerPage = findCareerPage;
