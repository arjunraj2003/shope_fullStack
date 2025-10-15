import { NextFunction, Request, Response } from "express"
import jwt from 'jsonwebtoken'
import { AppDataSource } from "../config/data-source";
import { User } from "../entities/user.entity";

const ACCESS_SECRET=process.env.JWT_ACCESS_SECRET 

export interface AuthRequest extends Request {
  user?: { 
    id: string;
    role: string;
    name?: string;
    email?: string;
   }; // attach user payload to request
}

export const authMiddleware = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith("Bearer")) {
      return res.status(401).json({ message: "No token provided" });
    }

    const token = authHeader.split(" ")[1];
    if (!ACCESS_SECRET) {
      throw new Error("JWT secret not configured");
    }

    const decoded = jwt.verify(token, ACCESS_SECRET) as { id: string };
    console.log("decoded", decoded);

    const user = await AppDataSource.getRepository(User).findOne({ where: { id: decoded.id } });

    if (!user) {
      return res.status(401).json({ message: "User not found" });
    }

    req.user = {
      id: user.id,
      role: user.role, // assuming you want to pass role as well
      // add other user fields here if needed
    };

    next();
  } catch (error) {
    return res.status(401).json({ message: "Invalid or expired token" });
  }
};


export const isAdmin=(req:AuthRequest,res:Response,next:NextFunction)=>{

        const user=req.user 
        if(!user) {
            return res.status(401).json({message: 'Unauthorized: User not found'})
        }

         if (user.role !== 'admin') {
            return res.status(403).json({ message: 'Forbidden: Admins only' });
        }
        next()
}