import express from 'express'
import { AppDataSource } from './config/data-source'
import app from './app';
import { getRedisClient } from './config/redis';




const PORT=process.env.PORT || 5000
AppDataSource.initialize().then(()=>{
    const redis = getRedisClient();
    console.log("DataBase Connected!...")
    app.listen(PORT,()=>{
        console.log(`server is on port ${PORT}`)
    })
}).catch((err)=>{
    console.log("Database connection error",err);
})
