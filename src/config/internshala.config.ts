

export const internshalaConfig = {
  baseUrl: "https://internshala.com",
  searchUrl: 'https://internshala.com/jobs',

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
}
