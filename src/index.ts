import express from 'express'
import { AppDataSource } from './config/data-source'
import app from './app';



const PORT=process.env.PORT || 5000
AppDataSource.initialize().then(()=>{
    console.log("DataBase Connected!...")

    app.listen(PORT,()=>{
        console.log(`server is on port ${PORT}`)
    })
}).catch((err)=>{
    console.log("Database connection error",err);
})
