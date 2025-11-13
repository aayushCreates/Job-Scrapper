"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.internshalaConfig = void 0;
const getJobUrl = (role, page = 1) => (`https://internshala.com/jobs/${encodeURIComponent(role)}-internship/page-${page}`);
exports.internshalaConfig = {
    baseUrl: "https://internshala.com",
    searchUrl: getJobUrl,
    loadType: "pagination",
    selectors: {
        container: ".individual_internship",
        title: ".job-title-href",
        companyName: ".company_name",
        location: ".locations",
        experience: ".row-1-item i.ic-16-briefcase + span",
        description: ".about_job .text",
        skills: ".job_skills .job_skill",
        jobUrl: ".job-title-href",
        nextButton: ".next-page"
    }
};
