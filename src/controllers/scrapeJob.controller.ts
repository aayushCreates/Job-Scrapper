import { findCareerPage } from "@/scripts/googleSearch.script";
import { findJobUrlAndHtmlContent } from "../scripts/imageJobScrapper";
import { formattedJobDetails } from "../utils/formatJobDetails";
import { extractJobDetailsFromImage } from "../utils/processImg.utils";
import { findCompanyWebsite } from "../utils/validateJob.utils";
import { Request, Response, NextFunction } from "express";

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

    const jobHtml = await findJobUrlAndHtmlContent(companyCareerData.link as string);
    if (!jobHtml) {
      return res.status(404).json({
        success: false,
        message: "Job not found",
      });
    }

    console.log("html: ", jobHtml);

    const formattedJob = await formattedJobDetails(jobHtml);
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
