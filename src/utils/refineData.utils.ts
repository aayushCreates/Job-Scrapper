import * as cheerio from 'cheerio';

export const refineData = (jobHtmlArr: any[], webSelectors: any, postPlatform: string) => {
  const refineDataArr: any[] = [];

  jobHtmlArr.forEach((jobHtml: any) => {
    const $ = cheerio.load(jobHtml);
    const s = webSelectors;

    const getText = (selector: string | undefined) =>
      selector ? $(selector).text().trim() : '';

    const getAttr = (selector: string | undefined, attr: string) =>
      selector ? $(selector).attr(attr)?.trim() || '' : '';

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
    const requiredSkills: string[] = [];
    if (s.skills) {
      $(s.skills).each((_, el) => {
        const skill = $(el).text().trim();
        if (skill) requiredSkills.push(skill);
      });
    }

    // Parse date from postedAtText
    const postedAtText = getText(s.postedAt || '');
    let postedAt: Date = new Date(); // fallback to current date

    if (postedAtText) {
      const parsed = Date.parse(postedAtText);
      if (!isNaN(parsed)) postedAt = new Date(parsed);
      // You can customize date parsing if the format is not ISO
    }

    // Placeholders - customize as needed
    const allowedBatches: string[] = ['2025', '2026']; // replace with actual logic
    const allowedBranches: string[] = ['CSE', 'IT', 'CYBER']; // replace with actual logic

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
