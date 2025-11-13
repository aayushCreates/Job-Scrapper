"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.findCompanyWebsite = void 0;
const axios_1 = __importDefault(require("axios"));
const findCompanyWebsite = async (companyName) => {
    try {
        const apiKey = process.env.GOOGLE_API_KEY;
        const cx = process.env.GOOGLE_CX_ID;
        const query = encodeURIComponent(`${companyName} official site`);
        const url = `https://www.googleapis.com/customsearch/v1?key=${apiKey}&cx=${cx}&q=${query}`;
        const response = await axios_1.default.get(url);
        const data = response.data;
        if (!data.items || data.items.length === 0) {
            console.log("No search results found.");
            return null;
        }
        // ✅ Extract the best possible website
        const website = extractOfficialWebsite(data, companyName);
        return website;
    }
    catch (err) {
        console.log("Error in validating Job by company");
    }
};
exports.findCompanyWebsite = findCompanyWebsite;
const extractOfficialWebsite = (data, companyName) => {
    const cleanName = companyName.toLowerCase().replace(/\s+/g, "");
    const candidates = data.items.filter((item) => {
        return (item.displayLink?.toLowerCase().includes(cleanName));
    });
    const preferred = candidates.find((item) => (/\.com|\.in|\.org/i.test(item.displayLink) && !item.displayLink.includes("linkedin") && !item.displayLink.includes("wikipedia")));
    const selected = preferred || data.items[0];
    return selected?.link || null;
};
