import {Entity, BaseEntity, PrimaryGeneratedColumn, Column, OneToMany} from "typeorm";
import { Food } from "./Food"
import { Log } from "./Log";
import { Meal } from "./Meal"

@Entity()
export class User extends BaseEntity{

    @PrimaryGeneratedColumn("uuid")
    id: number;

    @Column()
    firstName: string;

    @Column()
    lastName: string;

    @Column()
    passwordHash: string;

    @Column({
        unique: true
    })
    email: string;

    @Column("real")
    weight: number;

    @Column("real")
    height: number;

    @Column("timestamp")
    birthDate: Date;

    @Column()
    caloriesGoal: number;

    @Column()
    photo: string;

    @OneToMany(() => Food, food => food.user)
    foods: Food[]

    @OneToMany(() => Meal, meal => meal.user)
    meals: Meal[]

    @OneToMany(() => Log, log => log.user)
    logs: Log[]
}
