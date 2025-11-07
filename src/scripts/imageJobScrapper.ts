import { chromium } from "playwright";

export const findJobUrlAndHtmlContent = async (url: string) => {
  try {
    const browser = await chromium.launch({
      headless: true,
    });

    const context = await browser.newContext({
      userAgent: "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/123.0.0.0 Safari/537.36",
      viewport: { width: 1280, height: 800 },
      locale: "en-US",
      javaScriptEnabled: true,
    })

    const page = await context.newPage();

    await page.goto(url, {
      waitUntil: "domcontentloaded",
      timeout: 30000,
    });

    await page.waitForTimeout(3000); 

    const jobHtml = await page.evaluate(() => document.body.innerHTML);

    await browser.close();

    return jobHtml;
  } catch (err) {
    console.log("error in job html from img");
    return null;
  }
};
