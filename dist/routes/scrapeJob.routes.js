"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const scrapeJob_controller_1 = require("../controllers/scrapeJob.controller");
const express_1 = require("express");
const scrappedJobs = (0, express_1.Router)();
scrappedJobs.post('/', scrapeJob_controller_1.getScrappedJob);
exports.default = scrappedJobs;
