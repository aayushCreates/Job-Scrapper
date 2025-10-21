import * as cheerio from 'cheerio';

export const refineData = (jobHtmlArr: any, webSelectors: any) => {
  const refineDataArr: any[] = [];

  jobHtmlArr.forEach((jobHtml: any, index: number) => {
    const $ = cheerio.load(jobHtml);
    const s = webSelectors; // alias for easier access

    const getText = (selector: string | undefined) =>
      selector ? $(selector).text().trim() : '';

    const getAttr = (selector: string | undefined, attr: string) =>
      selector ? $(selector).attr(attr)?.trim() || '' : '';

    const title = getText(s.title);
    const companyName = getText(s.companyName);
    const location = getText(s.location);
    const experience = getText(s.experience);
    const description = getText(s.description);
    const salary = getText(s.salary || ''); // Optional

    const jobUrlRaw = getAttr(s.jobUrl, 'href');
    const jobUrl = jobUrlRaw.startsWith('http')
      ? jobUrlRaw
      : webSelectors.baseUrl
        ? `${webSelectors.baseUrl}${jobUrlRaw}`
        : jobUrlRaw;

    // Extract skills array
    const skills: string[] = [];
    if (s.skills) {
      $(s.skills).each((_, el) => {
        skills.push($(el).text().trim());
      });
    }

    const postedAtText = getText(s.postedAt || '');

    const jobData = {
      title,
      companyName,
      location,
      experience,
      description,
      skills,
      jobUrl,
      salary,
      postedAtText,
    };
  });

  return refineDataArr;
};
