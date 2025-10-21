import { cuvetteConfig } from "@/config/cuvette.config";
import { internshalaConfig } from "@/config/internshala.config";
import { naukriConfig } from "@/config/naukri.config";
import { scrapper } from "@/scripts/scrapper";
import { aiFilteration } from "@/utils/aiFilter.utils";
import { chunkData } from "@/utils/chunking.utils";
import { refineData } from "@/utils/refineData.utils";
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
            const scrappedHtmlArr = await scrapper(internshalaConfig, role, maxJobs);

            console.log("scrapped arr: ", scrappedHtmlArr);

            if (!scrappedHtmlArr || scrappedHtmlArr.length === 0) {
                return res.status(200).json({
                    success: false,
                    message: "Jobs are not found after scrapping"
                })
            };

            // const processedData = refineData(scrappedHtmlArr, internshalaConfig);
            // const chunksLimit = 10;
            // const chunkedData = chunkData(processedData, chunksLimit);

            // const aiFormattedData = await aiFilteration(chunkedData);
            // if (aiFormattedData.length === 0) {
            //     return res.status(200).json({
            //         success: false,
            //         message: "Jobs are not found after scrapping"
            //     })
            // };

            // res.status(200).json({
            //     success: true,
            //     message: "Jobs are scrapped successfully",
            //     data: aiFormattedData
            // });

        } else if (platform === "cuvette") {
            const scrappedHtmlArr = await scrapper(cuvetteConfig, role, maxJobs);

            if (!scrappedHtmlArr || scrappedHtmlArr.length === 0) {
                return res.status(200).json({
                    success: false,
                    message: "Jobs are not found after scrapping"
                })
            };

            const processedData = refineData(scrappedHtmlArr, cuvetteConfig);

            const chunksLimit = 10;
            const chunkedData = chunkData(processedData, chunksLimit);

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

        } else if (platform === "naukri") {
            const scrappedHtmlArr = await scrapper(naukriConfig, role, maxJobs);
            console.log("Scrapped HTML array length:", scrappedHtmlArr?.length);

            if (!scrappedHtmlArr || scrappedHtmlArr.length === 0) {
                return res.status(200).json({
                    success: false,
                    message: "Jobs are not found after scrapping"
                })
            };

            console.log("Scrapped HTML array:", scrappedHtmlArr);

            const processedData = refineData(scrappedHtmlArr, naukriConfig);
            console.log("Refined data length:", processedData.length);
            console.log("First refined job:", processedData[0]);

            const chunksLimit = 10;
            const chunkedData = chunkData(processedData, chunksLimit);

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
