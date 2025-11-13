"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.cuvetteConfig = void 0;
const jobUrl = (role, pageNo = 1) => (`https://api.cuvette.tech/api/v1/externaljobs?search=${role}&page=${pageNo}`);
exports.cuvetteConfig = {
    baseUrl: "https://www.cuvette.tech",
    // searchUrl: (role: string, page = 1) => `https://www.cuvette.tech/jobs?search=${encodeURIComponent(role)}&page=${page}`,
    // "https://api.cuvette.tech/api/v1/externaljobs?search=software%20developer,full%20stack%20developer&pageNumber=1"
    searchUrl: jobUrl,
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
