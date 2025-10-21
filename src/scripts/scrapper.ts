import { autoScrollUntil, paginateUntil } from "@/utils/action.utils";
import { chromium } from "playwright";


export const scrapper = async (config: any, role: string, maxJobs = 10) => {
    try {
        const browser = await chromium.launch({
            headless: true
        });

        const page = await browser.newPage();

        const updatedRole = role.replace(" ", "-");

        const url = config.loadType === 'pagination' ? config.searchUrl(role) : config.baseUrl;

        await page.goto(url, {
            waitUntil: 'networkidle'
        })

        // If site requires search form:
        if (config.selectors.searchInput) {
            await page.fill(config.selectors.searchInput, role);
            await page.click(config.selectors.searchButton);
            await page.waitForLoadState('networkidle');
        }

        // Wait for container with retry
        // await waitForSelectorWithRetry(page, config.selectors.container, 30000);

        // If infinite scroll:
        if (config.loadType === 'scroll') {
            await autoScrollUntil(page, config.selectors.container, maxJobs);
        }

        if (config.loadType === 'pagination') {
            await paginateUntil(page, config, maxJobs);
        }
        
        const jobs = await page.$$eval(
            config.selectors.container,
            (elements, { limit, selectors, platform }) => {
              return elements.slice(0, limit).map((el) => ({
                title: el.querySelector(selectors.title)?.textContent?.trim() || "",
                description: el.querySelector(selectors.description)?.textContent?.trim() || "",
                companyName: el.querySelector(selectors.companyName)?.textContent?.trim() || "",
                location: el.querySelector(selectors.location)?.textContent?.trim() || "",
                salary: el.querySelector(selectors.salary)?.textContent?.trim() || "",
                allowedYears: "",
                requiredExperience: el.querySelector(selectors.experience)?.textContent?.trim() || "",
                skills: Array.from(el.querySelectorAll(selectors.skills)).map((s: any) => s.textContent?.trim() || ""),
                jobUrl: el.querySelector(selectors.jobUrl)?.getAttribute("href") || "",
                postPlatform: platform,
                experienceLevel: "",
                position: "",
                postedAt: null,
                createdAt: null,
              }));
            },
            {
              limit: maxJobs,
              selectors: config.selectors,
              platform: config.baseUrl,
            }
          );
          

        await browser.close();

        return jobs;  
    } catch (err) {
        console.log("Error in scrapper...", err);
        return [];
    }
}


