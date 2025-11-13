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
Object.defineProperty(exports, "__esModule", { value: true });
exports.refineData = void 0;
const cheerio = __importStar(require("cheerio"));
const refineData = (jobHtmlArr, webSelectors, postPlatform) => {
    const refineDataArr = [];
    jobHtmlArr.forEach((jobHtml) => {
        const $ = cheerio.load(jobHtml);
        const s = webSelectors;
        const getText = (selector) => selector ? $(selector).text().trim() : '';
        const getAttr = (selector, attr) => selector ? $(selector).attr(attr)?.trim() || '' : '';
        const title = getText(s.title);
        const companyName = getText(s.companyName);
        const location = getText(s.location);
        const requiredExperience = getText(s.experience);
        const description = getText(s.description);
        const salary = getText(s.salary || '');
        const jobUrlRaw = getAttr(s.jobUrl, 'href');
        const jobUrl = jobUrlRaw?.startsWith('http')
            ? jobUrlRaw
            : s.baseUrl
                ? `${s.baseUrl}${jobUrlRaw}`
                : jobUrlRaw;
        // Extract requiredSkills array
        const requiredSkills = [];
        if (s.skills) {
            $(s.skills).each((_, el) => {
                const skill = $(el).text().trim();
                if (skill)
                    requiredSkills.push(skill);
            });
        }
        // Parse date from postedAtText
        const postedAtText = getText(s.postedAt || '');
        let postedAt = new Date(); // fallback to current date
        if (postedAtText) {
            const parsed = Date.parse(postedAtText);
            if (!isNaN(parsed))
                postedAt = new Date(parsed);
            // You can customize date parsing if the format is not ISO
        }
        // Placeholders - customize as needed
        const allowedBatches = ['2025', '2026']; // replace with actual logic
        const allowedBranches = ['CSE', 'IT', 'CYBER']; // replace with actual logic
        const jobData = {
            title,
            companyName,
            description,
            requiredSkills,
            allowedBatches,
            allowedBranches,
            salary,
            jobUrl,
            location,
            requiredExperience,
            postPlatform,
            postedAt,
        };
        refineDataArr.push(jobData);
    });
    return refineDataArr;
};
exports.refineData = refineData;
