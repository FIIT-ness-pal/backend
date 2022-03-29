import {BaseEntity, Column, Entity, ManyToOne, PrimaryGeneratedColumn} from "typeorm";
import { Food } from "./Food";
import { Meal } from "./Meal";

@Entity()
export class Ingredient extends BaseEntity{
    @PrimaryGeneratedColumn("uuid")
    id: number

    @ManyToOne(() => Food, food => food.ingredients)
    food: Food

    @ManyToOne(() => Meal, meal => meal.ingredients)
    meal: Meal

    @Column()
    foodAmount: number
}
