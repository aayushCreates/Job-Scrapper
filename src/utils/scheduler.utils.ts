import { naukriConfig } from "@/config/naukri.config";
import { scrapper } from "@/scripts/scrapper";
import cron from "node-cron";

let isRunning = false;

cron.schedule("0 0 0 * *", async () => {
  if (isRunning) return console.log("⏳ Previous job still running...");
  isRunning = true;

  try {
    const roles = [
      "frontend developer",
      "backend developer",
      "data analyst",
      "video editor",
      "full stack developer",
      "software developer",
      "machine learning engineer",
      "data scientist",
      "ai engineer"
    ];

    roles.map((role) => async () => {
      console.log("⚙️ Starting new scrape...");

      const naukriJobs = await scrapper(naukriConfig, role, 10, "naukri");
      const cuvetteJobs = await scrapper(naukriConfig, role, 10, "cuvette");
      const internshalaJobs = await scrapper(
        naukriConfig,
        role,
        10,
        "internshala"
      );

      console.log(`✅ Scraped ${naukriJobs.length} jobs`);
      console.log(`✅ Scraped ${cuvetteJobs.length} jobs`);
      console.log(`✅ Scraped ${internshalaJobs.length} jobs`);
    });
  } catch (err) {
    console.error("❌ Scraper error:", err);
  } finally {
    isRunning = false;
  }
});
