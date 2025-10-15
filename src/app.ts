import express from "express"
import cors from 'cors'
import cookieParser from 'cookie-parser'
import authRoute from './routes/auth.routes'
import dressRoute from './routes/dress.routes'
import messageRoute from './routes/message.routes'
import statsRoute from './routes/stats.route'
import path from "path"


const app=express()
app.use(cors({
  origin: 'https://shope-fullstack.onrender.com', 
  credentials: true
}));
app.use(express.json());
app.use(cookieParser());
app.use("/uploads", express.static(path.join(__dirname, "../uploads")));

console.log("inside app")

app.use('/api/v1/auth',authRoute);
app.use('/api/v1/dress',dressRoute);
app.use('/api/v1/messages',messageRoute);
app.use('/api/v1/dashboard/stats',statsRoute);

export default app;