// import { chromium } from "playwright-extra";
// import stealth from "playwright-extra-plugin-stealth";

// chromium.use(stealth());

// export const findJobUrlAndHtmlContent = async (url: string) => {
//   try {
//     const browser = await chromium.launch({
//       headless: true,
//     });

//     const context = await browser.newContext({
//       userAgent: "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/123.0.0.0 Safari/537.36",
//       viewport: { width: 1280, height: 800 },
//       locale: "en-US",
//       javaScriptEnabled: true,
//     });

//     const page = await context.newPage();

//     await page.goto(url, {
//       waitUntil: "domcontentloaded",
//       timeout: 30000,
//     });

//     await page.waitForTimeout(3000);

//     const jobHtml = await page.evaluate(() => document.body.innerHTML);

//     await browser.close();

//     return jobHtml;
//   } catch (err) {
//     console.log("error in job html from img");
//     return null;
//   }
// };

import puppeteer from "puppeteer-extra";
import StealthPlugin from "puppeteer-extra-plugin-stealth";
import UserAgents from "user-agents";

puppeteer.use(StealthPlugin());

export const findJobUrlAndHtmlContent = async (url: string) => {
  const browser = await puppeteer.launch({
    headless: true, // Set to false when debugging
    args: [
      "--no-sandbox",
      "--disable-setuid-sandbox",
      "--disable-blink-features=AutomationControlled",
      "--window-size=1366,768",
    ],
  });

  try {
    const page = await browser.newPage();

    // Random realistic UA
    const ua = new UserAgents().toString();
    await page.setUserAgent(ua);

    // Set viewport and headers for realism
    await page.setViewport({ width: 1366, height: 768 });
    await page.setExtraHTTPHeaders({
      "Accept-Language": "en-US,en;q=0.9",
    });

    console.log(`🌐 Navigating to: ${url}`);
    await page.goto(url, { waitUntil: "networkidle2", timeout: 60000 });

    // Wait for job-related elements to load
    await page.waitForSelector("div, section, article, li", { timeout: 10000 });

    // Scroll for lazy-loaded content
    await autoScroll(page);

    // Get the rendered DOM
    const html = await page.content();

    await browser.close();
    return html;
  } catch (err) {
    console.error("❌ Failed to scrape:", err);
    try {
      await browser.close();
    } catch {}
    return null;
  }
};

// Helper: smooth scrolling to load lazy content
async function autoScroll(page: any) {
  await page.evaluate(async () => {
    await new Promise<void>((resolve) => {
      let totalHeight = 0;
      const distance = 400;
      const timer = setInterval(() => {
        window.scrollBy(0, distance);
        totalHeight += distance;

        if (totalHeight >= document.body.scrollHeight) {
          clearInterval(timer);
          resolve();
        }
      }, 250);
    });
  });
}
