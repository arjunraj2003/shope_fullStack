import { Request, Response } from "express";
import { AuthService } from "../services/auth.service";
import { LoginSchema, RegisterSchema } from "../validation/auth.schema";
import redis from '../config/redis';




export class AuthController{
    static async register(req:Request,res:Response){
        try{
            const {name,email,password}=RegisterSchema.parse(req.body);
            const user=await AuthService.register(name,email,password);
            return res.status(201).json({message:"User registered",user})
        }catch(error){
            if (error instanceof Error && "errors" in error) {
                // Zod validation errors
                return res.status(400).json({ error: "Validation failed", details: (error as any).errors });
            }
            return res.status(400).json({error:(error as any).message});
        }
    }

    static async login(req:Request,res:Response){
        try{
            const {email,password}=LoginSchema.parse(req.body);
            const {user,accessToken,refreshToken,tokenId}=await AuthService.login(email,password);

            await redis.set(`refresh:${user.id}:${tokenId}`,refreshToken,{
                EX:7*24*60*60
            });

            res.cookie("refreshToken",refreshToken,{
                httpOnly:true,
                secure:process.env.NODE_ENV === "production",
                sameSite:"strict",
                path:'/',
                maxAge:7*24*60*60*1000
            });

            res.cookie("tokenId", tokenId, {
                httpOnly: true,
                secure: process.env.NODE_ENV === "production",
                sameSite: "strict",
                path: "/",
                maxAge: 7 * 24 * 60 * 60 * 1000
            });

            return res.json({user,accessToken});
        }catch(error){
            if (error instanceof Error && "errors" in error) {
                return res.status(400).json({ error: "Validation failed", details: (error as any).errors });
            }
            return res.status(401).json({error:(error as Error).message});
        }
    }
    static async refresh(req:Request,res:Response){
        try{
            const refreshToken=req.cookies.refreshToken;
            const tokenId=req.cookies.tokenId;
            if(!refreshToken || !tokenId) return res.status(401).json({message:"Missing refresh token or token ID"});

            const { userId } = await AuthService.verifyRefreshToken(refreshToken);

            const storedToken = await redis.get(`refresh:${userId}:${tokenId}`);

            if (!storedToken || storedToken !== refreshToken) {
                return res.status(403).json({ message: "Invalid or expired refresh token" });
            }

            const NewAccessToken=await AuthService.refresh(refreshToken);
            return res.json({accessToken:NewAccessToken});
        }catch(error){
            return res.status(403).json({error:(error as any).message});
        }
    }

    static async logout(req: Request, res: Response) {
    try {
        const tokenId = req.cookies.tokenId;
        const refreshToken = req.cookies.refreshToken;

        if (!tokenId || !refreshToken) {
        return res.status(400).json({ message: "Missing token or tokenId" });
        }

        const { userId } = await AuthService.verifyRefreshToken(refreshToken);

        // Remove from Redis
        await redis.del(`refresh:${userId}:${tokenId}`);

        // Clear cookies
        res.clearCookie("refreshToken", { path: "/" });
        res.clearCookie("tokenId", { path: "/" });
        console.log("logouted");

        return res.json({ message: "Logged out successfully" });
    } catch (error) {
        return res.status(400).json({ error: (error as any).message });
    }
    }

}