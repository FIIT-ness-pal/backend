import {BaseEntity, Column, Entity, ManyToOne, PrimaryGeneratedColumn} from "typeorm";
import { Food } from "./Food";
import { Meal } from "./Meal";

@Entity()
export class Ingredient extends BaseEntity{
    @PrimaryGeneratedColumn("uuid")
    id: string
    
    @ManyToOne(() => Meal, meal => meal.ingredients, { onDelete: 'CASCADE' })
    meal: Meal

    @Column()
    name: string

    @Column("float")
    amount: number

    @Column("float")
    calories: number

    @Column("float")
    carbs: number
    
    @Column("float")
    fat: number
    
    @Column("float")
    protein: number
}
