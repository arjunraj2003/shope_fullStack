import { NextFunction, Request, Response } from "express";
import { DressOperations } from "../services/dress.service";
import { ApiResponse } from "../utils/ApiResponse";

export class DressController {
    static async createDress(req: Request, res: Response, next: NextFunction) {
        try {
            const userId = (req as any).user?.id;
            const data = req.body;
            const files = req.files as Express.Multer.File[];

         
            const images = files.map((file) => (file.path));

            const dress = await DressOperations.createDress(data, userId, images);

            res.status(201).json(
                new ApiResponse(true, "Dress created successfully", dress)
            );
        } catch (error) {
            next(error);
        }
    }


    static async getAllDress(req: Request, res: Response, next: NextFunction) {
        try {
            const filters = req.query;
            const dresses = await DressOperations.getAllDress(filters);

            res.status(200).json(new ApiResponse(true, "Dress Fetched successfully ", dresses));
        } catch (error) {
            next(error);
        }
    }

    static async getDressById(req: Request, res: Response, next: NextFunction) {
        try {
            const id = req.params.id;

            const dress = await DressOperations.getDressById(id);
            res.status(200).json(new ApiResponse(true, "Dress Fetch successfully", dress));
        } catch (error) {
            next(error);
        }
    }

    static async updateDress(req: Request, res: Response, next: NextFunction) {
        try {
            const userId = (req as any).user.id;
            const dressId = req.params.id;
            const data = req.body;
            const files = req.files as Express.Multer.File[];

            const imageUrls = files.map((file) => file.path);
            const dress = await DressOperations.updateDressById(dressId, data, userId, imageUrls);
            res.status(200).json(new ApiResponse(true, "Dress Updated successfully", dress))
        } catch (error) {
            next(error);
            console.log(error);
        }
    }

    static async deleteDress(req: Request, res: Response, next: NextFunction) {
        try {
            const dressId = req.params.id;
            const userId = (req as any).user.id;
            const dress = await DressOperations.deleteDress(dressId, userId);
            res.status(200).json(new ApiResponse(true, "Dress Deleted successfully", dress))
        } catch (error) {
            next(error);

        }
    }

}