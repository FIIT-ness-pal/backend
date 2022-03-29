import {Entity, BaseEntity, PrimaryGeneratedColumn, Column, ManyToOne, OneToMany} from "typeorm";
import { Ingredient } from "./Ingredient";
import {User} from "./User"

@Entity()
export class Food extends BaseEntity{

    @PrimaryGeneratedColumn("uuid")
    id: number;

    @ManyToOne(() => User, user => user.foods)
    user: User;

    @Column()
    name: string

    @Column({
        nullable: true
    })
    brand: string

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

    @OneToMany(() => Ingredient, ingredient => ingredient.food)
    ingredients: Ingredient[]
}