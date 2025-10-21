

export const autoScrollUntil = async (page: any, container: any, maxJobs: number) => {
    try {
        let prevCount = 0, tries = 0;

        while (tries < 10) {
            await page.evaluate(() => window.scrollBy(0, window.innerHeight));

            await page.waitForTimeout(1500);

            const count = await page.$$eval(container, (elements: any) => elements.length);

            if (count >= maxJobs) {
                break;
            }

            if (prevCount === count) {
                tries++;
            } else {
                prevCount = count;
                tries = 0;
            }
        }

    } catch (err) {
        console.log("Error in the auto scrolling");
    }
}


export const paginateUntil = async (page: any, config: any, maxJobs: number) => {
    try {
        let count = await page.$$eval(config.selectors.container, (eles: any) => eles.length);
        let tries = 0;

        while (count < maxJobs && tries < 10) {
            const next = await page.$(config.selectors.nextButton);

            if (!next) break;

            await next.click();
            await page.waitForLoadState('networkidle');
            await page.waitForTimeout(1000);

            count = await page.$$eval(config.selectors.container, (els: any) => els.length);
            tries++;
        }

        console.log("count: ", count);
    } catch (err) {
        console.log("Error in the pagination");
    }
}





