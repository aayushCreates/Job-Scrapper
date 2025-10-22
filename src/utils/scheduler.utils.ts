import { naukriConfig } from "@/config/naukri.config";
import { scrapper } from "@/scripts/scrapper";
import cron from "node-cron";

let isRunning = false;

// Runs every 6 hours (you can change it)
cron.schedule("0 */6 * * *", async () => {
  if (isRunning) return console.log("⏳ Previous job still running...");
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

      const naukriJobs = await scrapper(naukriConfig, role, 10, "naukri");
      const cuvetteJobs = await scrapper(naukriConfig, role, 10, "cuvette");
      const internshalaJobs = await scrapper(
        naukriConfig,
        role,
        10,
        "internshala"
      );

      console.log(`✅ ${role}: Naukri ${naukriJobs.length} jobs`);
      console.log(`✅ ${role}: Cuvette ${cuvetteJobs.length} jobs`);
      console.log(`✅ ${role}: Internshala ${internshalaJobs.length} jobs`);
    }

    console.log("🎉 Scraping completed for all roles!");
  } catch (err) {
    console.error("❌ Scraper error:", err);
  } finally {
    isRunning = false;
  }
});
