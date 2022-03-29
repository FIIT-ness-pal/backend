import {Entity, BaseEntity, PrimaryGeneratedColumn, Column, ManyToOne} from "typeorm";
import { User } from "./User";

@Entity()
export class Log extends BaseEntity{

    @PrimaryGeneratedColumn("uuid")
    id: number;

    @ManyToOne(() => User, user => user.logs, { onDelete: 'CASCADE' })
    user: User

    @Column()
    name: string

    @Column()
    amount: number

    @Column()
    calories: number

    @Column()
    carbs: number

    @Column()
    fat: number

    @Column()
    protein: number

    @Column("date")
    date: Date

    @Column("time")
    time: string
}