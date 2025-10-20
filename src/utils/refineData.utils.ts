import * as cheerio from 'cheerio';

export const refineData = (jobHtml: any) => {
  const $ = cheerio.load(jobHtml);

  const title = $('h2 a.title').text().trim();
  const companyName = $('a.comp-name').text().trim();
  const location = $('.locWdth').text().trim();
  const experience = $('.expwdth').text().trim();
  const description = $('.job-desc').text().trim();

  const skills: string[] = [];
  $('.tags-gt li').each((_, el) => {
    skills.push($(el).text().trim());
  });

  const jobUrlRaw = $('h2 a.title').attr('href') || '';
  const jobUrl = jobUrlRaw.startsWith('http')
    ? jobUrlRaw
    : `https://www.naukri.com${jobUrlRaw}`;

  const salary = $('.salary').text().trim() || 'Not specified'; // Adjust if site provides salary
  const postedAtText = $('.type br + span').text().trim() || ''; // e.g., "2 days ago"

  return {
    title,
    companyName,
    location,
    experience,
    description,
    skills,
    jobUrl,
    salary,
    postedAtText
  };
};
