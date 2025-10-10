import { AppDataSource } from "../config/data-source";
import { Dress } from "../entities/dress.entity";
import { Message } from "../entities/message.entity";
import { ApiError } from "../utils/ApiError";


const messageRepo=AppDataSource.getRepository(Message);
export class messageService{
    static async createMessage(content:string,userId:string){
        try{
            const message =messageRepo.create({content,user:{id:userId}})
            return await messageRepo.save(message);
        }catch(error){
            console.log(error)
            throw new ApiError(400,"Failded to add message")
        }
    }

    static async getAllMessages(){
        
        const messages= await messageRepo.find({relations:["user"]})
        if(!messages) throw new ApiError(400,"No message found");
        return messages;
    }

    static async markAsRead(mesageId:string){
        try{
            const message=await messageRepo.findOne({where:{id:mesageId}})
            if(!message) throw new ApiError(400,"No message found");
            if(message){
                message.isRead=true;
                await messageRepo.save(message)
            }
            // await messageRepo.update({id:mesageId},{isRead:true});
            return message
        }catch(error){
            console.log(error);
            throw new ApiError(400,"Faild to update");
        }
    }
} 