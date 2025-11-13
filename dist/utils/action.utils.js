"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.paginateUntil = exports.autoScrollUntil = void 0;
const autoScrollUntil = async (page, container, maxJobs) => {
    try {
        let prevCount = 0, tries = 0;
        while (tries < 10) {
            await page.evaluate(() => window.scrollBy(0, window.innerHeight));
            await page.waitForTimeout(1500);
            const count = await page.$$eval(container, (elements) => elements.length);
            if (count >= maxJobs) {
                break;
            }
            if (prevCount === count) {
                tries++;
            }
            else {
                prevCount = count;
                tries = 0;
            }
        }
    }
    catch (err) {
        console.log("Error in the auto scrolling");
    }
};
exports.autoScrollUntil = autoScrollUntil;
const paginateUntil = async (page, config, maxJobs) => {
    try {
        let count = await page.$$eval(config.selectors.container, (eles) => eles.length);
        let tries = 0;
        while (count < maxJobs && tries < 10) {
            const next = await page.$(config.selectors.nextButton);
            if (!next)
                break;
            await next.click();
            await page.waitForLoadState('networkidle');
            await page.waitForTimeout(1000);
            count = await page.$$eval(config.selectors.container, (els) => els.length);
            tries++;
        }
        console.log("count: ", count);
    }
    catch (err) {
        console.log("Error in the pagination");
    }
};
exports.paginateUntil = paginateUntil;
