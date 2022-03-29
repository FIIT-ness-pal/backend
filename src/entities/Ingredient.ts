import {BaseEntity, Column, Entity, ManyToOne, PrimaryGeneratedColumn} from "typeorm";
import { Food } from "./Food";
import { Meal } from "./Meal";

@Entity()
export class Ingredient extends BaseEntity{
    @PrimaryGeneratedColumn("uuid")
    id: number

    @ManyToOne(() => Food, food => food.ingredients, { onDelete: "CASCADE" })
    food: Food

    @ManyToOne(() => Meal, meal => meal.ingredients, { onDelete: "CASCADE" })
    meal: Meal

    @Column()
    foodAmount: number
}
