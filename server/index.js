import express from 'express';
import mongoose from 'mongoose';
import userRouter from './routes/user.route.js';
import authRouter from './routes/auth.route.js';
import cookieParser from 'cookie-parser';
import dotenv from 'dotenv';

dotenv.config();

const app = express();
mongoose.connect("mongodb+srv://jagriti:jagriti@mern-estate.uu6f755.mongodb.net/?retryWrites=true&w=majority&appName=mern-estate")
.then(console.log("connected to Db"))
.catch((err)=>{
    console.log(err);
});

app.use(express.json());
app.use(cookieParser());

app.listen("3000" ,()=>{
    console.log(`server running in port 3000`);
});


app.use("/api/user" , userRouter);
app.use("/api/auth" , authRouter);

app.use((err , req , res , next) =>{
    const statusCode = err.statusCode || 500 ;
    const message = err.message || "Internal Server Error" ;
    res.status(statusCode).json({
        success: false,
        statusCode,
        message, 
    });
});

