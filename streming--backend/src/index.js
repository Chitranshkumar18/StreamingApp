import dotenv from "dotenv"
import connectDB from "./db/index.js";
import { app } from "./app.js";

dotenv.config({
    path: './.env'
})



connectDB()
    .then(() => {
        const port = process.env.PORT || 8000;
        app.listen(port, () => {
            console.log(`⚙️  Server is running at port: ${port}`); // This is good because the server starts listening after establishing the database connection.
        });
    })
    .catch((err) => {
        console.log("MongoDB connection failed !!!", err);
    });















/*
import express from "express";
const app = express();
(async()=>{
    try{
    await mongoose.connect(`${process.env.MONGODB_URI}/${DB_NAME}`)
    app.on("error",(error)=>{
        console.log("ERROR",error)
        throw error
    })
    app.listen(process.env.PORT,()=>{
        console.log(`App is running on port ${process.env.PORT}`)
    })
    }
    catch(error){
        console.error("Error",error)
        throw error
    }
})()
    */