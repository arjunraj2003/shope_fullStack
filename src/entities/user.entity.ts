import { Column, CreateDateColumn, Entity, OneToMany, PrimaryGeneratedColumn, UpdateDateColumn} from 'typeorm'
import { Dress } from './dress.entity';

export enum UserRole{
    ADMIN="admin",
    STAFF="staff",
    CUSTOMER="customer",
}

@Entity()
export class User{
    @PrimaryGeneratedColumn("uuid")
    id:string;

    @Column()
    name:string;

    @Column({unique:true})
    email:string;

    @Column()
    password:string;

    @Column({type:'enum',enum:UserRole,default:UserRole.CUSTOMER})
    role:UserRole;

    @OneToMany(()=>Dress,(dress)=>dress.user)
    dress:Dress[];

    @CreateDateColumn()
    createdAt:Date;

    @UpdateDateColumn()
    updateAt:Date;
}
