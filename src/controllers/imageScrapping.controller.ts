import { findJobUrlAndHtmlContent } from "@/scripts/imageJobScrapper";
import { formattedJobDetails } from "@/utils/formatJobDetails";
import { findCompanyWebsite } from "@/utils/validateJob.utils";
import { Request, Response, NextFunction } from "express";

export const imageUpload = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const fileCloudPath = req.file?.path;
    if (!fileCloudPath) {
      return res.status(404).json({
        success: false,
        message: "file cannot upload successfully, please try again",
      });
    }

    return res.status(200).json({
      success: true,
      message: "file uploaded successfully",
      data: fileCloudPath,
    });
  } catch (err) {
    console.log("Error in image upload", err);
    return res.status(500).json({
      success: false,
      message: "Error in image upload"
    })
  }
};

export const scrappingJob = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { companyName  } = req.body;

    const companyUrl = findCompanyWebsite(companyName);
    if(!companyUrl) {
      return res.status(404).json({
        success: false,
        message: "Company website is not found",
      })
    }

    const jobDetailsWithHtml = findJobUrlAndHtmlContent(companyUrl);
    if(!jobDetailsWithHtml){
      return res.status(404).json({
        success: false,
        message: "Job is not found",
      })
    } 

    const formattedDetails = formattedJobDetails(jobDetailsWithHtml);
    if(!formattedDetails) {
      return res.status(404).json({
        success: false,
        message: "Formatted job not found"
      })
    }

    res.status(200).json({
      success: true,
      message: "Job-Link is fetched successfully",
      data: formattedDetails
    })

  } catch (err) {
    console.log("Error in the scrapping job details");
    return res.status(500).json({
      success: false,
      message: "Error in scrapping job details"
    })
  }
};
