import {Entity, BaseEntity, PrimaryGeneratedColumn, Column, ManyToOne, OneToMany} from "typeorm";
import { Ingredient } from "./Ingredient";
import {User} from "./User"

@Entity()
export class Food extends BaseEntity{

    @PrimaryGeneratedColumn("uuid")
    id: string;

    @ManyToOne(() => User, user => user.foods, { onDelete: 'CASCADE' })
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
}