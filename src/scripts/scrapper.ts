import { chromium } from "playwright";


const scrapper =  async (config: any, role: string, maxJobs=10)=> {
    try {
        const browser = await chromium.launch({
            headless: true
        });

       const page = await browser.newPage();

       const url = config.loadType === 'pagination' ? config.searchUrl(role) : config.baseUrl;

       await page.goto(url, {
        waitUntil: 'networkidle'
       })

        // If site requires search form:
       if(config.selectors.searchInput){
        await page.fill(config.selectors.searchInput, role);
        await page.click(config.selectors.searchButton);
        await page.waitForLoadState('networkidle');
       }

        // Wait for container with retry
        await waitForSelectorWithRetry(page, config.selectors.container, 30000);


        // If infinite scroll:
        if(config.loadType === 'scroll') {
            await autoscrollUntil(page, config.selectors.container, maxJobs);
        }

        if(config.loadType === 'pagination'){
            await paginateUntil(page, config, maxJobs);
        }

        const cards = await page.$$eval(config.selectors.container, (els, sel, limit) =>
            els.slice(0, limit).map(el => el.outerHTML), config.selectors, maxJobs
          );

        await browser.close();

        return cards;   // array of HTML strings (or objects)
    } catch(err) {
        console.log("Error in scrapper...");
    }
}


