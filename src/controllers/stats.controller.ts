import { NextFunction, Request, Response } from "express";
import { statsService } from "../services/stats.service";
import { ApiResponse } from "../utils/ApiResponse";

export class statsController{
    static async getStat(req:Request,res:Response,next:NextFunction){
        try{
            const filters=req.query;
            const stats=await statsService.getStats(filters);
            res.status(200).json(new ApiResponse(true,"Stats fetched successfully",stats))
        }catch(error){
            console.log(error)
            next(error);
        }
        
    }
}