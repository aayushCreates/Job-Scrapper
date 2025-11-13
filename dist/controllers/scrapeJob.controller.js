"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getScrappedJob = void 0;
const googleSearch_script_1 = require("@/scripts/googleSearch.script");
const imageJobScrapper_1 = require("../scripts/imageJobScrapper");
const formatJobDetails_1 = require("../utils/formatJobDetails");
const processImg_utils_1 = require("../utils/processImg.utils");
const getScrappedJob = async (req, res, next) => {
    try {
        const { image } = req.body;
        if (!image) {
            return res.status(404).json({
                success: false,
                message: "File img not found",
            });
        }
        const imgDetails = await (0, processImg_utils_1.extractJobDetailsFromImage)(image);
        if (!imgDetails) {
            return res.status(404).json({
                success: false,
                message: "Img details cannot found",
            });
        }
        const companyCareerData = await (0, googleSearch_script_1.findCareerPage)(imgDetails.companyName);
        // const companyWebsite = await findCompanyWebsite(
        //   imgDetails?.companyName as string
        // );
        // if (!companyWebsite) {
        //   return res.status(404).json({
        //     success: false,
        //     message: "Company website cannot found",
        //   });
        // }
        if (!companyCareerData) {
            return res.status(404).json({
                success: false,
                message: "Company career webpage cannot found",
            });
        }
        const jobHtml = await (0, imageJobScrapper_1.findJobUrlAndHtmlContent)(companyCareerData.link);
        if (!jobHtml) {
            return res.status(404).json({
                success: false,
                message: "Job not found",
            });
        }
        console.log("html: ", jobHtml);
        const formattedJob = await (0, formatJobDetails_1.formattedJobDetails)(jobHtml);
        console.log("formatted job: ", formattedJob);
        if (!formattedJob) {
            return res.status(404).json({
                success: false,
                message: "Formatted job not found",
            });
        }
        res.status(200).json({
            success: true,
            message: "Job-Link is found successfully",
            data: formattedJob,
        });
    }
    catch (err) {
        console.log("Error in the scrapping job details");
        return res.status(500).json({
            success: false,
            message: "Error in scrapping job details"
        });
    }
};
exports.getScrappedJob = getScrappedJob;
