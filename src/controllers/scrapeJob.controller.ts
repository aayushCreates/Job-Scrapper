import { findCareerPage } from "@/scripts/googleSearch.script";
import { findJobUrlAndHtmlContent } from "../scripts/imageJobScrapper";
import { formattedJobDetails } from "../utils/formatJobDetails";
import { extractJobDetailsFromImage } from "../utils/processImg.utils";
import { findCompanyWebsite } from "../utils/validateJob.utils";
import { Request, Response, NextFunction } from "express";
import { JobContainer } from "@/middlewares/htmlParser.middleware";

export const getScrappedJob = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { image } = req.body;
    if (!image) {
      return res.status(404).json({
        success: false,
        message: "File img not found",
      });
    }

    const imgDetails: any = await extractJobDetailsFromImage(image);
    if (!imgDetails) {
      return res.status(404).json({
        success: false,
        message: "Img details cannot found",
      });
    }

    const companyCareerData = await findCareerPage(imgDetails.companyName);

    if (!companyCareerData) {
      return res.status(404).json({
        success: false,
        message: "Company career webpage cannot found",
      });
    }

    const careerPageHtml = await findJobUrlAndHtmlContent(companyCareerData.link as string);
    if (!careerPageHtml) {
      return res.status(404).json({
        success: false,
        message: "Job not found",
      });
    }

    const relevantJobContent = JobContainer(careerPageHtml);

    console.log("relevent job content: ", relevantJobContent);

    const formattedJob = await formattedJobDetails(careerPageHtml);
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
  } catch (err) {
    console.log("Error in the scrapping job details");
    return res.status(500).json({
      success: false,
      message: "Error in scrapping job details"
    })
  }
};
