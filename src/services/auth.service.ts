import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { AppDataSource } from '../config/data-source';
import { User } from '../entities/user.entity';

const ACCESS_SECRET=process.env.JWT_ACCESS_SECRET;
const REFRESH_SECRET=process.env.JWT_REFRESH_SECRET;

export class AuthService{
    
    static async register(name:string,email:string,password:string){
        const userRepo=  AppDataSource.getRepository(User)

        const hashed=await bcrypt.hash(password,10);
        const user=await userRepo.findOne({where:{email}})
        if(user){
            throw new Error("User exist")
        }
        const saveUser=userRepo.create({name,email,password:hashed});
        return await userRepo.save(saveUser);
    }

    static async login(email:string,password:string){
        const userRepo= AppDataSource.getRepository(User)

        const user=await userRepo.findOne({where:{email}})
        if(!user){
            throw new Error("Invalid credintials");
        }

        const isMatch=await bcrypt.compare(password,user.password)
        if(!isMatch){
            throw new Error("Invalid credintials");
        }

        if (!ACCESS_SECRET || !REFRESH_SECRET) {
            throw new Error("JWT secret keys are not defined in environment variables");
        }

        const accessToken=jwt.sign({id:user.id},ACCESS_SECRET,{expiresIn:"15m"});
        const refreshToken=jwt.sign({id:user.id},REFRESH_SECRET,{expiresIn:"7d"});

        return {user,accessToken,refreshToken};
    }

    static async refresh(token:string){
        try{
            if(!REFRESH_SECRET || !ACCESS_SECRET){
                throw new Error("No refresh token is avvailable");
            }
            const decoded=jwt.verify(token,REFRESH_SECRET) as {id:number}
            const accessToken=jwt.sign({id:decoded.id},ACCESS_SECRET,{expiresIn:'15m'});
            return accessToken;
        }catch{
            throw new Error("invalid refresh token ");
        }
    }
}