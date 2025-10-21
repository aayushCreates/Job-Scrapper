import express from 'express';
import dotenv from 'dotenv';
const app = express();

dotenv.config();
app.use(express.json());     // To parse the JSON

import aiScrapperRoutes from './routes/ai.routes';

app.use('/scrpe/job' ,aiScrapperRoutes);


const port = process.env.PORT || 5000;
app.listen(port, ()=> {
    console.log(`Server is running on PORT: ${port} ✅`)
});