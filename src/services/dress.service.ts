import { AppDataSource } from "../config/data-source";
import { Dress } from "../entities/dress.entity";
import { ApiError } from "../utils/ApiError";

const dressRepo=AppDataSource.getRepository(Dress);


export class DressOperations{
    static async createDress(data:Partial<Dress>,userId:string,imageUrls:string[]){
        try{
            console.log(data,userId)
            const dress=dressRepo.create({...data,images:imageUrls,user:{id:userId}as any});
            return await dressRepo.save(dress);
        }catch(error){
            console.log(error)
            throw new ApiError(400,"Faild to create dress");
        }
    }

    static async getAllDress(filters:any){
        try{
            const {search,category,gender,minPrice,maxPrice,page = 1, limit = 10}=filters;

            const query=dressRepo.createQueryBuilder('dress').leftJoinAndSelect('dress.user','user');

             if (search) {
                query.andWhere(
                    `(LOWER(dress.name) ILIKE :search OR LOWER(dress.description) ILIKE :search)`,
                    { search: `%${search.toLowerCase()}%` }
                );
            }
            if (category) {
                query.andWhere('dress.category = :category', { category });
            }
            if (gender) {
                query.andWhere('dress.gender = :gender', { gender });
            }

            if (minPrice) {
                query.andWhere('dress.price >= :minPrice', { minPrice: parseFloat(minPrice) });
            }

            if (maxPrice) {
                query.andWhere('dress.price <= :maxPrice', { maxPrice: parseFloat(maxPrice) });
            }

            const take = parseInt(limit);
            const skip = (parseInt(page) - 1) * take;

            query.skip(skip).take(take);

             const [data, total] = await query.getManyAndCount();

            return {
            data,
            total,
            currentPage: parseInt(page),
            totalPages: Math.ceil(total / take),
            };
            
        }catch(error){
            console.log(error)
            throw new ApiError(500,"Faild to fetch dresses");
        }
    }

    static async getDressById(id:string){
        const dress=await dressRepo.findOne({where:{id},relations:['user']});
        if(!dress) throw new ApiError(404,"Dress not found");
        return dress;
    }

    static async updateDressById(id:string,data:Partial<Dress>,userId:string,imageUrls:string[]){
        const dress=await dressRepo.findOne({where:{id},relations:['user']});
        if(!dress) throw new ApiError(404,"Dress not found");

        if(dress.user.id !== userId) throw new ApiError(403,"You cannot update this dress");

        try{
            Object.assign(dress,data);
            if (imageUrls.length > 0) {
              dress.images = imageUrls;
            }
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
