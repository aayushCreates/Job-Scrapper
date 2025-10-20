import express from 'express';
const app = express();

import aiScrapperRoutes from './routes/ai.routes';

app.use('/scrpe/job' ,aiScrapperRoutes);


const port = process.env.PORT || 5000;
app.listen(port, ()=> {
    console.log(`Server is running on PORT: ${port} ✅`)
});