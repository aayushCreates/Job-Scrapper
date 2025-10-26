import { getScrappedJob } from "@/controllers/scrapeJob.controller";
import { Router } from "express";

const scrappedJobs = Router();

scrappedJobs.get('/', getScrappedJob);


export default scrappedJobs;