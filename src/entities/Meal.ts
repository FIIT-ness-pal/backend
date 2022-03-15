import {Entity, BaseEntity, PrimaryGeneratedColumn, Column, ManyToOne, ManyToMany, JoinTable} from "typeorm";
import { User } from "./User";
import { Food } from "./Food";

@Entity()
export class Meal extends BaseEntity{

    @PrimaryGeneratedColumn("uuid")
    id: number

    @ManyToOne(() => User, user => user.meals)
    user: User

    @Column()
    name: string

    @Column({
        nullable: true
    })
    description: string

    @Column()
    calories: number

    @Column()
    carbs: number

    @Column()
    fat: number

    @Column()
    protein: number

    @Column()
    isPublic: boolean

    @ManyToMany(() => Food)
    @JoinTable()
    foods: Food[]
}