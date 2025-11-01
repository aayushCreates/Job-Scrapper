import express from "express";
import dotenv from "dotenv";
import cors from 'cors';

const app = express();

dotenv.config();
app.use(express.json());

app.use(
  cors({
    origin: ["http://localhost:5173", "http://localhost:3030"],
  })
);

import uploadRouter from "./routes/upload.routes";
import scrappedJobs from "./routes/scrapeJob.routes";

app.use('/upload', uploadRouter);
app.use('/job/scrapped/data', scrappedJobs);
// app.use('/job-board/jobs', otherJobs);

// const port = process.env.PORT || 5000;
const port = 8080;
app.listen(port, () => {
  console.log(`Server is running on PORT: ${port} ✅`);
});
