

export const cuvetteConfig = {
    baseUrl: "https://www.naukri.com",
    searchUrl: (role: string, page = 1) => `https://www.naukri.com/${encodeURIComponent(role)}-jobs-${page}`,
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
}