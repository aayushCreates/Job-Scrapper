import { autoScrollUntil, paginateUntil } from "@/utils/action.utils";
import { chromium } from "playwright-extra";
import stealth from 'puppeteer-extra-plugin-stealth';

chromium.use(stealth());

export const scrapper = async (config: any, role: string, maxJobs = 5, platform: string) => {
    try {
        const browser = await chromium.launch({
            headless: true
        });

        const page = await browser.newPage();

        let updatedRole = role;
        if(platform === "internshala"){
            updatedRole = role.replace(" ", "-");
        } else if(platform === "cuvette"){
            updatedRole = role.replace(" ", "%20");
        } else {
            updatedRole = role.replace(" ", "-");
        }

        const url = config.loadType === 'pagination' ? config.searchUrl(updatedRole) : config.baseUrl;

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
            (elements, { limit }) => {
            return elements.slice(0, limit).map(el => el.outerHTML);
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


