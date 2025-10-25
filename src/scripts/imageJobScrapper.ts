import { chromium } from "playwright";

export const findJobUrlAndHtmlContent = async (url: string) => {
  try {
    let jobDetails;
    const browser = await chromium.launch({
      headless: true,
    });
    const page = await browser.newPage();

    await page.goto(url, {
      waitUntil: "domcontentloaded",
      timeout: 30000,
    });

    const link = await page.$(
      'a:has-text("Career"), a:has-text("Job"), a:has-text("Openings")'
    );
    if (!link) return null;

    const href = await link.getAttribute("href");

    const jobUrl = href?.startsWith("http")
      ? href
      : new URL(href as string, url).href;

    await page.goto(jobUrl, {
      waitUntil: "networkidle"
    })

    const jobHtml = await page.content();
    jobDetails = {
      jobHtml: jobHtml,
      jobUrl: jobUrl
    }

    await browser.close();
    return jobDetails;
  } catch (err) {
    console.log("error in job details from img")
  }
};
