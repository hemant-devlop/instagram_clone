import express, { urlencoded } from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import dotenv from "dotenv";
import connnectDb from './utils/db.js';
import userRoute from './routes/user.route.js'
import postRoute from './routes/post.route.js'
import messageRoute from './routes/message.route.js'
dotenv.config({});

const app = express();
const PORT =process.env.PORT||3000;
//middleware
app.use(express.json());
app.use(cookieParser());
app.use(urlencoded({ extended: true }))
const corsOptions = {
    origin: 'http://localhost:5173',
    credentials: true,  
}
app.use(cors(corsOptions));
//routes
app.use('/api/v1/user',userRoute)
app.use('/api/v1/post',postRoute)
app.use('/api/v1/message',messageRoute)

connnectDb();
app.listen(PORT, () => { 
    console.log(`server running on port ${PORT}`) })