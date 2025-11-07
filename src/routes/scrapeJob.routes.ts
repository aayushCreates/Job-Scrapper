import { getScrappedJob } from "../controllers/scrapeJob.controller";
import { Router } from "express";

const scrappedJobs = Router();

scrappedJobs.post('/', getScrappedJob);


export default scrappedJobs;