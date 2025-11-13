"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.indeedConfig = void 0;
exports.indeedConfig = {
    baseUrl: "https://www.naukri.com",
    searchUrl: (role, page = 1) => `https://www.naukri.com/${encodeURIComponent(role)}-jobs-${page}`,
    loadType: "pagination",
    selectors: {
        container: ".cust-job-tuple",
        title: "h2 a.title",
        companyName: "a.comp-name",
        location: ".locWdth",
        experience: ".expwdth",
        description: ".job-desc",
        skills: ".tags-gt li",
        jobUrl: "h2 a.title",
        nextButton: "a[aria-label='Next']"
    }
};
