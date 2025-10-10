import { NextFunction, Request, Response } from "express"
import jwt from 'jsonwebtoken'

const ACCESS_SECRET=process.env.JWT_ACCESS_SECRET 

export interface AuthRequest extends Request {
  user?: { id: number }; // attach user payload to request
}

export const authMiddleware=(req:AuthRequest,res:Response,next:NextFunction)=>{
    try{
        const authHeader=req.headers.authorization;
        if(!authHeader || !authHeader.startsWith("Bearer")){
            return res.status(401).json({message:"No token provided"});
        }

        const token=authHeader?.split(" ")[1];
        if (!ACCESS_SECRET) {
            throw new Error("JWT secret not configured");
        }

        const decoded=jwt.verify(token,ACCESS_SECRET) as {id:number}
        console.log("decoded",decoded)

        req.user={id:decoded.id}
        
        next()
    }catch(error){
        return res.status(401).json({message:"Invalid or expired token"});
    }
};