import { getScrappedJobs } from "../../ai.controller";
import { Router } from "express";

const aiScrapperRoutes = Router();

aiScrapperRoutes.get('/', getScrappedJobs);

export default aiScrapperRoutes;
