"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const naukri_config_1 = require("@/config/naukri.config");
const scrapper_1 = require("@/scripts/scrapper");
const node_cron_1 = __importDefault(require("node-cron"));
const retry_utils_1 = require("./retry.utils");
const rateLimit_utils_1 = __importDefault(require("./rateLimit.utils"));
let isRunning = false;
node_cron_1.default.schedule("0 */6 * * *", async () => {
    if (isRunning)
        return console.log("⏳ Previous job still running...");
    isRunning = true;
    try {
        console.log("🚀 Starting scheduled job scraping...");
        const roles = [
            "frontend developer",
            "backend developer",
            "data analyst",
            "video editor",
            "full stack developer",
            "software developer",
            "machine learning engineer",
            "data scientist",
        ];
        for (const role of roles) {
            console.log(`\n⚙️ Scraping for role: ${role}`);
            await (0, rateLimit_utils_1.default)();
            const naukriJobs = await (0, retry_utils_1.retry)(() => (0, scrapper_1.scrapper)(naukri_config_1.naukriConfig, role, 10, "naukri"), 3, 1000);
            await (0, rateLimit_utils_1.default)();
            const cuvetteJobs = await (0, retry_utils_1.retry)(() => (0, scrapper_1.scrapper)(naukri_config_1.naukriConfig, role, 10, "cuvette"), 3, 1000);
            await (0, rateLimit_utils_1.default)();
            const internshalaJobs = await (0, retry_utils_1.retry)(() => (0, scrapper_1.scrapper)(naukri_config_1.naukriConfig, role, 10, "internshala"), 3, 1000);
            console.log(`✅ ${role}: Naukri ${naukriJobs.length} jobs`);
            console.log(`✅ ${role}: Cuvette ${cuvetteJobs.length} jobs`);
            console.log(`✅ ${role}: Internshala ${internshalaJobs.length} jobs`);
        }
        console.log("🎉 Scraping completed for all roles!");
    }
    catch (err) {
        console.error("❌ Scraper error:", err);
    }
    finally {
        isRunning = false;
    }
});
