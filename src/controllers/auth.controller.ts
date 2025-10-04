import { Request, Response } from "express";
import { AuthService } from "../services/auth.service";


export class AuthController{
    static async register(req:Request,res:Response){
        try{
            const {name,email,password}=req.body;
            const user=await AuthService.register(name,email,password);
            res.status(201).json({message:"User registerd",user})
        }catch(error){
            res.status(400).json({error:(error as any).message});
        }
    }

    static async login(req:Request,res:Response){
        try{
            const {email,password}=req.body;
            const {user,accessToken,refreshToken}=await AuthService.login(email,password);
            res.cookie("refreshToken",refreshToken,{
                httpOnly:true,
                secure:process.env.NODE_ENV === "production",
                sameSite:"strict",
                path:'/',
                maxAge:7*24*60*60*1000
            });
            res.json({user,accessToken});
        }catch(error){
            res.status(401).json({error:(error as Error).message});
        }
    }
    static async refresh(req:Request,res:Response){
        try{
            const refreshToken=req.cookies.refreshToken;
            if(!refreshToken) return res.status(401).json({message:"No refresh token"});

            const NewAccessToken=await AuthService.refresh(refreshToken);
            res.json({accessToken:NewAccessToken});
        }catch(error){
            res.status(403).json({error:(error as any).message});
        }
    }
}