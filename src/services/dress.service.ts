import { AppDataSource } from "../config/data-source";
import { Dress } from "../entities/dress.entity";
import { ApiError } from "../utils/ApiError";

const dressRepo=AppDataSource.getRepository(Dress);


export class DressOperations{
    static async createDress(data:Partial<Dress>,userId:string){
        try{
            console.log(data,userId)
            const dress=dressRepo.create({...data,user:{id:userId}as any});
            return await dressRepo.save(dress);
        }catch(error){
            console.log(error)
            throw new ApiError(400,"Faild to create dress");
        }
    }

    static async getAllDress(){
        try{
            return await dressRepo.find({relations:['user']});
        }catch(error){
            throw new ApiError(500,"Faild to fetch dresses");
        }
    }

    static async getDressById(id:string){
        const dress=await dressRepo.findOne({where:{id},relations:['user']});
        if(!dress) throw new ApiError(404,"Dress not found");
        return dress;
    }

    static async updateDressById(id:string,data:Partial<Dress>,userId:string){
        const dress=await dressRepo.findOne({where:{id},relations:['user']});
        if(!dress) throw new ApiError(404,"Dress not found");

        if(dress.user.id !== userId) throw new ApiError(403,"You cannot update this dress");

        try{
            Object.assign(dress,data);
            return await dressRepo.save(dress);
        }catch(error){
            throw new ApiError(400,"Faild to update the dress");
        }
    }

    static async deleteDress(id:string,userId:string){
        const dress=await dressRepo.findOne({where:{id},relations:['user']});
        if(!dress) throw new ApiError(404,"Dress not found");

        if(dress.user.id !== userId) throw new ApiError(403,"You cannot delete this dress");

        try{
            await dressRepo.remove(dress);
            return {message:"Dress deleted successfully"};
        }catch(error){
            throw new ApiError(500,"Failed to delete dress");
        }
    }
}
