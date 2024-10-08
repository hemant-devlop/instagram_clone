import express, { urlencoded } from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import dotenv from "dotenv";
import connnectDb from './utils/db.js';
import userRoute from './routes/user.route.js'
import postRoute from './routes/post.route.js'
import messageRoute from './routes/message.route.js'
import { app,server } from './soket/socket.js';
import path from 'path';

dotenv.config({});

const __dirname=path.resolve();

const PORT =process.env.PORT||3000;
//middleware
app.use(express.json());
app.use(cookieParser());
app.use(urlencoded({ extended: true }))

const corsOptions = {
    origin:  process.env.URL,
    credentials: true,  
    methods: 'GET,POST,PUT,DELETE,OPTIONS',  // Allow these HTTP methods
    allowedHeaders: 'Content-Type,Authorization', 
}
app.use(cors(corsOptions));
app.options('*', cors(corsOptions));  // Enable CORS preflight handling
//routes
app.use('/api/v1/user',userRoute)
app.use('/api/v1/post',postRoute)
app.use('/api/v1/message',messageRoute)

app.use(express.static(path.join(__dirname,"/frontend/dist")))
app.use('*',(req,res)=>{
    res.sendFile(path.resolve(__dirname,"frontend","dist","index.html"))
})

connnectDb();
server.listen(PORT, () => { 
    console.log(`server running on port ${PORT}`) })