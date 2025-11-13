"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.naukriConfig = void 0;
const getJobUrl = (role, page = 1) => `https://www.naukri.com/${encodeURIComponent(role)}-jobs-${page}`;
exports.naukriConfig = {
    baseUrl: "https://www.naukri.com",
    searchUrl: getJobUrl,
    loadType: "pagination",
    selectors: {
        container: ".cust-job-tuple",
        title: "h2 a.title",
        companyName: "a.comp-name",
        location: ".job-details .loc-wrap",
        experience: ".job-details .exp-wrap",
        description: ".job-desc",
        skills: ".tags-gt li",
        jobUrl: "h2 a.title",
        nextButton: ".styles_pagination_oIvXh a.styles_btn-secondary_2AsIP"
    }
};
