import {Entity, PrimaryGeneratedColumn, Column} from "typeorm";

@Entity()
export class User {

    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    firstName: string;

    @Column()
    lastName: string;

    @Column()
    userName: string;

    @Column()
    passwordHash: string;

    @Column()
    email: string;

    @Column("real")
    weight: number;

    @Column("real")
    height: number;

    @Column("timestamp")
    birthDate: Date;

    @Column()
    calorieGoal: number;

    @Column()
    photoUrl: string;

}
