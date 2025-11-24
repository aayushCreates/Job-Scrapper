import { internshalaConfig } from "@/config/internshala.config";
import { linkedinConfig } from "@/config/linkedin.config";
import { naukriConfig } from "@/config/naukri.config";
import unstopSrappedJobs from "@/middlewares/unstop.middleware";
import { linkedinScrapper } from "@/scripts/linkedinScrapper";
import { scrapper } from "@/scripts/scrapper";
import { aiFilteration } from "@/utils/aiFilter.utils";
import { chunkData } from "@/utils/chunking.utils";
import { linkedinPostFilter } from "@/utils/postFilter.utils";
import axios from "axios";
import { Request, Response, NextFunction } from "express";


export const getScrappedJobs = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { platform, role, maxJobs } = req.body;
        if (!platform) {
            return res.status(200).json({
                success: false,
                message: "Platform is not exists"
            });
        }

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
          
            const jobs = unstopSrappedJobs(maxJobs, exprience, role, jobPostedDays, jobType);
            if (Array.isArray(jobs) && jobs.length === 0) {
              return res.status(404).json({
                success: false,
                message: "Jobs are not found from unstop",
                data: []
              });
            }

            //  send to the DB
          
            return res.status(200).json({
              success: true,
              message: "Jobs fetched from Unstop successfully",
              total: Array.isArray(jobs) && jobs.length,
              data: jobs
            });
        } else if (platform === "linkedin") {
            const { inputQuery } = req.body;

            const result = await linkedinScrapper(linkedinConfig, maxJobs, inputQuery);

            const cleanPost = (text: string) => {
                return text
                  .replace(/^Feed post/gi, "")
                  .replace(/Follow/gi, "")
                  .replace(/hashtag/gi, "")
                  .replace(/…more/gi, "")
                  .replace(/\d+\scomments?/gi, "")
                  .replace(/\d+\sreposts?/gi, "")
                  .replace(/\d+\slikes?/gi, "")
                  .replace(/^\s+|\s+$/g, "")
                  .replace(/\n{2,}/g, "\n")
                  .trim();
              };
              
            const cleanedDetails = result.map(res=> cleanPost(res));

            const chunkedData = chunkData(cleanedDetails as any, maxJobs);

            console.log("chunked data: ", chunkedData);
            console.log("chunked data: ", chunkedData.length);

            const formattedJobs = await linkedinPostFilter(chunkedData) as any;
            console.log("formatted result from the linkedin api", formattedJobs);

            // console.log("length: ", formattedJobs.length);

            return res.status(200).json({
                data: formattedJobs,
                message: "jobs posts are fetched successfully from linkedin"
            })
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
