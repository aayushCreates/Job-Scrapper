"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getScrappedJobs = void 0;
const internshala_config_1 = require("@/config/internshala.config");
const naukri_config_1 = require("@/config/naukri.config");
const scrapper_1 = require("@/scripts/scrapper");
const aiFilter_utils_1 = require("@/utils/aiFilter.utils");
const chunking_utils_1 = require("@/utils/chunking.utils");
const axios_1 = __importDefault(require("axios"));
const getScrappedJobs = async (req, res, next) => {
    try {
        const { platform, role, maxJobs } = req.body;
        if (!platform) {
            return res.status(200).json({
                success: false,
                message: "Platform is not exists"
            });
        }
        ;
        if (platform === "internshala") {
            const scrappedHtmlArr = await (0, scrapper_1.scrapper)(internshala_config_1.internshalaConfig, role, maxJobs, "internshala");
            if (!scrappedHtmlArr || scrappedHtmlArr.length === 0) {
                return res.status(200).json({
                    success: false,
                    message: "Jobs are not found after scrapping"
                });
            }
            ;
            const chunksLimit = 10;
            const chunkedData = (0, chunking_utils_1.chunkData)(scrappedHtmlArr, chunksLimit);
            const aiFormattedData = await (0, aiFilter_utils_1.aiFilteration)(chunkedData);
            if (aiFormattedData.length === 0) {
                return res.status(200).json({
                    success: false,
                    message: "Jobs are not found after scrapping"
                });
            }
            ;
            res.status(200).json({
                success: true,
                message: "Jobs are scrapped successfully",
                data: aiFormattedData
            });
        }
        else if (platform === "cuvette") {
            let page = 1;
            const totalJobs = [];
            while (Math.ceil(maxJobs / 10) > page) {
                const jobs = await axios_1.default.get(`https://api.cuvette.tech/api/v1/externaljobs?search=${role}&page=${page}`);
                totalJobs.push(jobs.data.data);
                ++page;
            }
            res.status(200).json({
                success: true,
                message: "Jobs are scrapped successfully",
                data: totalJobs
            });
        }
        else if (platform === "naukri") {
            const scrappedHtmlArr = await (0, scrapper_1.scrapper)(naukri_config_1.naukriConfig, role, maxJobs, platform);
            console.log("scrapped: ", scrappedHtmlArr);
            if (!scrappedHtmlArr || scrappedHtmlArr.length === 0) {
                return res.status(200).json({
                    success: false,
                    message: "Jobs are not found after scrapping"
                });
            }
            ;
            const chunksLimit = 5;
            const chunkedData = (0, chunking_utils_1.chunkData)(scrappedHtmlArr, chunksLimit);
            console.log("chunkeddata: ", chunkedData);
            const aiFormattedData = await (0, aiFilter_utils_1.aiFilteration)(chunkedData);
            console.log("ai format: ", aiFormattedData);
            if (aiFormattedData.length === 0) {
                return res.status(200).json({
                    success: false,
                    message: "Jobs are not found after scrapping"
                });
            }
            ;
            res.status(200).json({
                success: true,
                message: "Jobs are scrapped successfully",
                data: aiFormattedData
            });
        }
    }
    catch (err) {
        console.log("Error in scrapping jobs: ", err);
        return res.status(500).json({
            success: false,
            message: "Internal server error during job scraping",
            error: err
        });
    }
};
exports.getScrappedJobs = getScrappedJobs;
