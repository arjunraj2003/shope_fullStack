import express from "express"
import cors from 'cors'
import cookieParser from 'cookie-parser'
import authRoute from './routes/auth.routes'
import dressRoute from './routes/dress.routes'
import messageRoute from './routes/message.routes'
import statsRoute from './routes/stats.route'
import path from "path"


const app=express()
const allowedOrigins = [process.env.FRONTEND_URL, 'http://localhost:3000'];
app.use(cors({
  origin: function (origin, callback) {
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
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