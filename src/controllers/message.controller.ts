import { NextFunction, Request, Response } from "express";
import { messageService } from "../services/message.service";
import { ApiResponse } from "../utils/ApiResponse";

export class messageController{
    static async createMessage(req:Request,res:Response,next:NextFunction){
        try{
            const userId=(req as any).user.id;
            const {content}=req.body;
            const message=await messageService.createMessage(content,userId);
            return res.status(201).json(new ApiResponse(true,"Message added successfully",message));
        }catch(error){
            next(error) 
        }
    }

    static async getAllMessages(req:Request,res:Response,next:NextFunction){
        try{
            const messages=await messageService.getAllMessages();
            return res.status(200).json(new ApiResponse(true,"Message fetched successfully",messages))
        }catch(error){
            next(error)
        }
    }

    static async markAsRead(req:Request,res:Response,next:NextFunction){
        try{
            const messageId=req.params.id;
            console.log("inside markasread",messageId);
            const message=await messageService.markAsRead(messageId);
            return res.status(200).json(new ApiResponse(true,"Mark As Readed",message));
        }catch(error){
            next(error);
        }
    }
}