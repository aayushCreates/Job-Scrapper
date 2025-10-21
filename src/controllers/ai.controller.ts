import { cuvetteConfig } from "@/config/cuvette.config";
import { internshalaConfig } from "@/config/internshala.config";
import { naukriConfig } from "@/config/naukri.config";
import { scrapper } from "@/scripts/scrapper";
import { aiFilteration } from "@/utils/aiFilter.utils";
import { chunkData } from "@/utils/chunking.utils";
import { refineData } from "@/utils/refineData.utils";
import axios from "axios";
import { Request, Response, NextFunction } from "express";


export const getScrappedJobs = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { platform, role, maxJobs } = req.body;
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

                ++page;
            }
            res.status(200).json({
                success: true,
                message: "Jobs are scrapped successfully",
                data: totalJobs
            });

        } else if (platform === "naukri") {
            const scrappedHtmlArr = await scrapper(naukriConfig, role, maxJobs, platform);

            console.log("scrapped: ", scrappedHtmlArr);
            if (!scrappedHtmlArr || scrappedHtmlArr.length === 0) {
                return res.status(200).json({
                    success: false,
                    message: "Jobs are not found after scrapping"
                })
            };

            const chunksLimit = 5;
            const chunkedData = chunkData(scrappedHtmlArr, chunksLimit);

            console.log("chunkeddata: ", chunkedData);

            const aiFormattedData = await aiFilteration(chunkedData);

            console.log("ai format: ", aiFormattedData);

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
        }
    } catch (err) {
        console.log("Error in scrapping jobs: ", err);
        return res.status(500).json({
            success: false,
            message: "Internal server error during job scraping",
            error: err
        });
    }
}
