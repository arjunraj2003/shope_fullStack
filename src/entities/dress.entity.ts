import { Column, CreateDateColumn, Entity, ManyToOne, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";
import { User } from "./user.entity";

export enum AgeGroup{
    NEWBORN="newborn",
    KIDS="kids",
}
export enum Gender{
    MALE='male',
    FEMALE='female',
    UNISEX='unisex'
}

@Entity()
export class Dress{
    @PrimaryGeneratedColumn('uuid')
    id:string;

    @Column()
    name:string;

    @Column("text")
    description: string;

    @Column("decimal", { precision: 10, scale: 2 })
    price: number;

    @Column("int")
    stock: number;

    @Column({type:'enum',enum:AgeGroup})
    category:AgeGroup;

    @Column({type:'enum',enum:Gender})
    gender:Gender;

    @Column({default:true})
    isActive:boolean;

    @Column("text", { array: true, nullable: true })
    images: string[];

    @ManyToOne(()=>User,(user)=>user.dress)
    user:User;

    @CreateDateColumn()
    createdAt:Date;

    @UpdateDateColumn()
    updateAt:Date;
}