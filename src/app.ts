import express from "express"
import cors from 'cors'
import cookieParser from 'cookie-parser'
import authRoute from './routes/auth.routes'
import dressRoute from './routes/dress.routes'

const app=express()
app.use(cors())
app.use(express.json());
app.use(cookieParser());

console.log("inside app")
app.use('/api/v1/auth',authRoute);
app.use('/api/v1/dress',dressRoute);

export default app;