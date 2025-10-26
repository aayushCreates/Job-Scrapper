import express from "express";
import dotenv from "dotenv";
const app = express();

dotenv.config();
app.use(express.json()); // To parse the JSON

import uploadRouter from "./routes/upload.routes";
import scrappedJobs from "./routes/scrapeJob.routes";

app.use('/upload', uploadRouter);
app.use('/job/scrapped/data', scrappedJobs);

// const port = process.env.PORT || 5000;
const port = 5000;
app.listen(port, () => {
  console.log(`Server is running on PORT: ${port} ✅`);
});
