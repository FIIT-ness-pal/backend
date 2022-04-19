import {Entity, BaseEntity, PrimaryGeneratedColumn, Column, ManyToOne} from "typeorm";
import { User } from "./User";

@Entity()
export class Log extends BaseEntity{

    @PrimaryGeneratedColumn("uuid")
    id: string;

    @ManyToOne(() => User, user => user.logs, { onDelete: 'CASCADE' })
    user: User

    @Column()
    name: string

    @Column()
    amount: number

    @Column("float")
    calories: number

    @Column("float")
    carbs: number

    @Column("float")
    fat: number

    @Column("float")
    protein: number

    @Column("date")
    date: Date

    @Column("time")
    time: string
}