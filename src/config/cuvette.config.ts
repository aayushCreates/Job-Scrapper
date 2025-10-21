

export const cuvetteConfig = {
  baseUrl: "https://www.cuvette.tech",
  searchUrl: (role: string, page = 1) => `https://www.cuvette.tech/jobs?search=${encodeURIComponent(role)}&page=${page}`,
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