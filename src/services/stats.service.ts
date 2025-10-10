import { resourceUsage } from "process";
import { AppDataSource } from "../config/data-source";
import { Dress } from "../entities/dress.entity";
import { Message } from "../entities/message.entity";
import { ApiError } from "../utils/ApiError";
import { messageService } from "./message.service";


const dressRepo=AppDataSource.getRepository(Dress);
const messageRepo=AppDataSource.getRepository(Message);
export class statsService{
    static async getStats(filters:any){
        try{
            const {limit}=filters;
            const dresses=await dressRepo.find();
            const activeDresses=await dressRepo.find({where:{isActive:true}});
            const messages=await messageRepo.find();
            const UnreadedMessages=await messageRepo.find({where:{isRead:false}});


            const totalDress=dresses.length
            const totalActiveDress=activeDresses.length
            const totalMessages=messages.length
            const totalUnread=UnreadedMessages.length
            const messagess=await messageRepo.find({where:{isRead:false},relations:['user'],...(limit != null && { take: limit }),})


            console.log("total:",totalDress);
            console.log("total active:",totalActiveDress);
            console.log("total Message:",totalMessages);
            console.log("total unread Message:",totalUnread);

            return{
                totalDress,
                totalActiveDress,
                totalMessages,
                totalUnread,
                messagess
            }
        } catch(error){
            throw new ApiError(500,"Faild to fetach stats");
        }
    }
}