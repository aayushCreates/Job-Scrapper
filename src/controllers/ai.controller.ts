import { cuvetteConfig } from "@/config/cuvette.config";
import { internshalaConfig } from "@/config/internshala.config";
import { naukriConfig } from "@/config/naukri.config";
import { scrapper } from "@/scripts/scrapper";
import { aiFilteration } from "@/utils/aiFilter.utils";
import { chunkData } from "@/utils/chunking.utils";
import { refineData } from "@/utils/refineData.utils";
import { Request, Response, NextFunction } from "express";


export const getScrappedJobs = async (req: Request, res: Response, next: NextFunction)=> {
    try {
        const { platform, role, maxJobs } = req.body;
        if(!platform){
            return res.status(200).json({
                success: false,
                message: "Platform is not exists"
            })
        };

        if(platform === "internshala"){
            const scrappedHtmlArr = await scrapper(internshalaConfig, role, maxJobs);
            if(scrappedHtmlArr.length === 0) {
                return res.status(200).json({
                    sucess: false,
                    message: "Jobs are not found after scrapping"
                })
            };

            const processedData = refineData(scrappedHtmlArr);

            const chunksLimit = 10;
            const chunkedData = chunkData(processedData, chunksLimit);

            const aiFormattedData = await aiFilteration(chunkedData);
            if(aiFormattedData.length === 0) {
                return res.status(200).json({
                    sucess: false,
                    message: "Jobs are not found after scrapping"
                })
            };

            res.status(200).json({
                success: true,
                message: "Jobs are scrapped successfully",
                data: aiFormattedData
            });

        }else if(platform === "cuvette") {
            const scrappedHtmlArr = await scrapper(cuvetteConfig, role, maxJobs);
            if(scrappedHtmlArr.length === 0) {
                return res.status(200).json({
                    sucess: false,
                    message: "Jobs are not found after scrapping"
                })
            };

            const processedData = refineData(scrappedHtmlArr);

            const chunksLimit = 10;
            const chunkedData = chunkData(processedData, chunksLimit);

            const aiFormattedData = await aiFilteration(chunkedData);
            if(aiFormattedData.length === 0) {
                return res.status(200).json({
                    sucess: false,
                    message: "Jobs are not found after scrapping"
                })
            };

            res.status(200).json({
                success: true,
                message: "Jobs are scrapped successfully",
                data: aiFormattedData
            });

        }else if (platform === "naukri") {
            const scrappedHtmlArr = await scrapper(naukriConfig, role, maxJobs);
            if(scrappedHtmlArr.length === 0) {
                return res.status(200).json({
                    sucess: false,
                    message: "Jobs are not found after scrapping"
                })
            };

            const processedData = refineData(scrappedHtmlArr);

            const chunksLimit = 10;
            const chunkedData = chunkData(processedData, chunksLimit);

            const aiFormattedData = await aiFilteration(chunkedData);
            if(aiFormattedData.length === 0) {
                return res.status(200).json({
                    sucess: false,
                    message: "Jobs are not found after scrapping"
                })
            };

            res.status(200).json({
                success: true,
                message: "Jobs are scrapped successfully",
                data: aiFormattedData
            });
        }
        // else if (platform === "") {
        //     const scrappedHtmlArr = await scrapper(linkedinConfig, role, maxJobs);
        // }

    } catch(err) {
        console.log("Error in scrapping jobs: ", err);
    }
}
