import { findJobUrlAndHtmlContent } from "@/scripts/imageJobScrapper";
import { formattedJobDetails } from "@/utils/formatJobDetails";
import { extractJobDetailsFromImage } from "@/utils/processImg.utils";
import { findCompanyWebsite } from "@/utils/validateJob.utils";
import { Request, Response, NextFunction } from "express";

export const getScrappedJob = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { imgUrl } = req.body;
    if (!imgUrl) {
      return res.status(404).json({
        success: false,
        message: "File img not found",
      });
    }

    const imgDetails: any = extractJobDetailsFromImage(imgUrl);
    if (!imgDetails) {
      return res.status(404).json({
        success: false,
        message: "Img details cannot found",
      });
    }

    const companyWebsite = await findCompanyWebsite(
      imgDetails?.company as string
    );
    if (!companyWebsite) {
      return res.status(404).json({
        success: false,
        message: "Company website cannot found",
      });
    }

    const jobHtml = findJobUrlAndHtmlContent(companyWebsite as string);
    if (!jobHtml) {
      return res.status(404).json({
        success: false,
        message: "Job not found",
      });
    }

    const formattedJob = formattedJobDetails(jobHtml);
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
