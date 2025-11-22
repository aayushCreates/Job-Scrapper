import { autoScrollUntil } from "@/utils/action.utils";
import StealthPlugin from "puppeteer-extra-plugin-stealth";
import puppeteer from "puppeteer-extra";
import fs from "fs";
import path from "path";

puppeteer.use(StealthPlugin());

const wait = (ms: number) => new Promise((res) => setTimeout(res, ms));

export const linkedinScrapper = async (
  linkedinConfig: any,
  maxPosts: number,
  inputQuery: any
) => {
  try {
    const browser = await puppeteer.launch({
      headless: false,
      args: ["--no-sandbox"],
    });

    const page = await browser.newPage();

    const cookiesPath = path.join(__dirname, "../../linkedin.cookies.json");
    const cookies = JSON.parse(
      fs.readFileSync(cookiesPath, "utf-8")
    );
    await page.setCookie(...cookies);

    // const input = "";
    // inputQuery.staticKeywords.map((w: string)=> {
    //     input.concat(`#${w.toLowerCase()}`);
    // })
      
      const contentURL = `https://www.linkedin.com/search/results/content/?keywords=campus%20hiring%20OR%20on%20campus%20OR%20pool%20campus%20OR%20TPO%20OR%20placement%20cell%20OR%20campus%20drive`;

    await page.goto(contentURL, {
      waitUntil: "networkidle2",
    });

    await wait(3000);

    // if (linkedinConfig.selectors.searchInput && inputQuery.length !== 0) {
    //   await page.click(linkedinConfig.selectors.searchInput);
    //   await page.keyboard.type(inputQuery, { delay: 100 });
    //   await page.keyboard.press("Enter");
    // }

    if (linkedinConfig.loadType === "scroll") {
      await autoScrollUntil(page, linkedinConfig.selectors.postContainer, maxPosts);
    }

    const posts = await page.$$eval(
      linkedinConfig.selectors.postContainer,
      (elements, limit: number) => {
        return Array.from(elements)
          .slice(0, limit)
          .map((el: any) => el.innerText.trim());  
      },
      maxPosts
    );

    await browser.close();
    return posts;
  } catch (err) {
    console.log("Error in scrapper...", err);
    return [];
  }
};
