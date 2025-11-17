import { internshalaConfig } from "@/config/internshala.config";
import { naukriConfig } from "@/config/naukri.config";
import { scrapper } from "@/scripts/scrapper";
import { aiFilteration } from "@/utils/aiFilter.utils";
import { chunkData } from "@/utils/chunking.utils";
import axios from "axios";
import { Request, Response, NextFunction } from "express";


export const getScrappedJobs = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { platform, role, maxJobs } = req.body;
        console.log(req.body);
        if (!platform) {
            return res.status(200).json({
                success: false,
                message: "Platform is not exists"
            })
        };

        if (platform === "internshala") {
            const scrappedHtmlArr = await scrapper(internshalaConfig, role, maxJobs, "internshala");

            if (!scrappedHtmlArr || scrappedHtmlArr.length === 0) {
                return res.status(200).json({
                    success: false,
                    message: "Jobs are not found after scrapping"
                })
            };

            const chunksLimit = 10;
            const chunkedData = chunkData(scrappedHtmlArr, chunksLimit);

            const aiFormattedData = await aiFilteration(chunkedData);

            if (aiFormattedData.length === 0) {
                return res.status(200).json({
                    success: false,
                    message: "Jobs are not found after scrapping"
                })
            };
            res.status(200).json({
                success: true,
                message: "Jobs are scrapped successfully",
                data: aiFormattedData
            });

        } else if (platform === "cuvette") {
            let page = 1;
            const totalJobs: any = [];

            while(Math.ceil(maxJobs/10) > page){
                const jobs = await axios.get(`https://api.cuvette.tech/api/v1/externaljobs?search=${role}&page=${page}`);

                totalJobs.push(jobs.data.data);
                page++;
            }

            res.status(200).json({
                success: true,
                message: "Jobs are scrapped successfully",
                data: totalJobs
            });

        } else if (platform === "naukri") {
            const scrappedHtmlArr = await scrapper(naukriConfig, role, maxJobs, platform);

            if (!scrappedHtmlArr || scrappedHtmlArr.length === 0) {
                return res.status(200).json({
                    success: false,
                    message: "Jobs are not found after scrapping"
                })
            };

            const chunksLimit = 5;
            const chunkedData = chunkData(scrappedHtmlArr, chunksLimit);


            const aiFormattedData = await aiFilteration(chunkedData);


            if (aiFormattedData.length === 0) {
                return res.status(200).json({
                    success: false,
                    message: "Jobs are not found after scrapping"
                })
            };


            res.status(200).json({
                success: true,
                message: "Jobs are scrapped successfully",
                data: aiFormattedData
            });
        } else if (platform === "unstop") {
            console.log("req.body", req.body);
          
            let { jobType, exprience, jobPostedDays, maxJobs } = req.body;
          
            if (!jobType) jobType = "Full Time";
            if (!exprience) exprience = "fresher";
            if (!jobPostedDays) jobPostedDays = 1;
            if (!maxJobs) maxJobs = 30;
          
            let page = 1;
            const totalJobs: any[] = [];
          
            const position = role.toLowerCase().replace(" ", "+"); // software+developer
            const jobTimings = jobType.toLowerCase().replace(" ", "_");
          
            // usertype=fresher/corporate/students
            let exprienceLevel = "";
            if (exprience !== "fresher" && exprience !== "students") {
              exprienceLevel = "corporate";
            }
          
            while (totalJobs.length < maxJobs) {
              const response = await axios.get(
                `https://unstop.com/api/public/opportunity/search-result?opportunity=jobs&page=${page}&per_page=10&searchTerm=${position}&job_timing=${jobTimings}&datePosted=${jobPostedDays}&usertype=${exprienceLevel}&oppstatus=recent`
              );
          
              // 👇 Correct place where jobs exist
              const jobs = response?.data?.data?.data || [];
          
              if (jobs.length === 0) break;
          
              // 👇 map to your Prisma Schema
              const mappedJobs = jobs.map((job: any) => ({
                title: job.title,
                companyName: job.organisation?.name || "",
                description:
                  job.seo_details?.[0]?.description || job.title || "No description",
          
                location: job.jobDetail?.locations?.join(", ") || "Unknown",
          
                // Salary
                minSalary: job.jobDetail?.show_salary
                  ? String(job.jobDetail.show_salary)
                  : null,
                maxSalary: job.jobDetail?.show_salary
                  ? String(job.jobDetail.show_salary)
                  : null,
                salary:
                  job.jobDetail?.not_disclosed === false
                    ? "Disclosed"
                    : "Not disclosed",
          
                // Skills
                skills: Array.isArray(job.required_skills)
                  ? job.required_skills.map((s: any) => s.skill_name)
                  : [],
          
                eligibleYear: Array.isArray(job.filters)
                  ? job.filters
                      .filter((f: any) => f.type === "eligible")
                      .map((f: any) => f.name)
                      .join(", ")
                  : null,
          
                requiredExp:
                  job.jobDetail?.min_experience || job.jobDetail?.max_experience
                    ? `${job.jobDetail?.min_experience || 0}-${job.jobDetail?.max_experience || 0} years`
                    : "0 years",
          
                jobUrl: job.seo_url,
                postPlatform: "unstop",
                postedAt: new Date(job.created_at),
                experienceLevel: exprience,
                position: role
              }));
          
              totalJobs.push(...mappedJobs);
          
              if (jobs.length < 10) break; // no more pages
          
              page++;
            }
          
            return res.status(200).json({
              success: true,
              message: "Jobs fetched from Unstop successfully",
              total: totalJobs.length,
              data: totalJobs.slice(0, maxJobs)
            });
          }
          
    } catch (err) {
        console.log("Error in scrapping jobs", err);
        return res.status(500).json({
            success: false,
            message: "Internal server error during job scraping",
            error: err
        });
    }
}
