import express, { NextFunction, Request, Response } from "express";
import dotenv from "dotenv";
import morgan from "morgan";
import cors from "cors";

const app = express();
dotenv.config();

app.use(
  cors({
    origin: ["http://localhost:5173"],
  })
);

app.use(morgan("dev"));
app.use(express.json());

import uploadRouter from "./routes/upload.routes";
import scrappedJobs from "./routes/scrapeJob.routes";

app.use("/upload", uploadRouter);
app.use("/job/scrapped/data", scrappedJobs);

app.get('/ping', (req: Request, res: Response, next: NextFunction)=> {
  res.send("hello world");
})

const port = process.env.PORT || 5000;
app.listen(port, () => {
  console.log(`Server is running on PORT: ${port} ✅`);
});
