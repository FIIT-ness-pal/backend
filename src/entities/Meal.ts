import {Entity, BaseEntity, PrimaryGeneratedColumn, Column, ManyToOne, ManyToMany, JoinTable, OneToMany} from "typeorm";
import { User } from "./User";
import { Food } from "./Food";
import { Ingredient } from "./Ingredient";

@Entity()
export class Meal extends BaseEntity{

    @PrimaryGeneratedColumn("uuid")
    id: string

    @ManyToOne(() => User, user => user.meals, { onDelete: 'CASCADE' })
    user: User

    @Column()
    name: string

    @Column({
        nullable: true
    })
    description: string

    @Column("float")
    calories: number

    @Column("float")
    carbs: number

    @Column("float")
    fat: number

    @Column("float")
    protein: number

    @Column()
    isPublic: boolean

    @OneToMany(() => Ingredient, ingredient => ingredient.meal)
    ingredients: Ingredient[]
}