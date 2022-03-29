import { Factory, Seeder } from 'typeorm-seeding'
import { Connection } from 'typeorm'
import { Ingredient } from '../entities/Ingredient';
import { Meal } from '../entities/Meal';
import { Food } from '../entities/Food';
    
export default class CreateIngredients implements Seeder {
    public async run(factory: Factory, connection: Connection): Promise<any> {

    const bananaYoghurt = await connection
        .createQueryBuilder()
        .select("meal")
        .where("meal.id = :id", { id: '38e011fc-375f-4f7b-84f8-e085935ec9c9' })
        .from(Meal, "meal")
        .getOne()
    
    const chickenAndRice = await connection
        .createQueryBuilder()
        .select("meal")
        .where("meal.id = :id", { id: 'b601b5ee-4bd0-4db2-83b4-7d27d6e1d701' })
        .from(Meal, "meal")
        .getOne()
    
    const banana = await connection
        .createQueryBuilder()
        .select("food")
        .where("food.id = :id", { id: '7a39795d-dc1b-4857-9b41-84e1ac9029c2' })
        .from(Food, "food")
        .getOne()
    const yoghurt = await connection
        .createQueryBuilder()
        .select("food")
        .where("food.id = :id", { id: 'f364274d-7429-4e8d-ae03-574e90f4b147' })
        .from(Food, "food")
        .getOne()
    const chicken = await connection
        .createQueryBuilder()
        .select("food")
        .where("food.id = :id", { id: 'c580405c-d8da-4fe4-b1d2-cf7e2134ef43' })
        .from(Food, "food")
        .getOne()
    const rice = await connection
        .createQueryBuilder()
        .select("food")
        .where("food.id = :id", { id: 'b7d139d0-50df-46fa-90a4-a0f0440e401a' })
        .from(Food, "food")
        .getOne()
        
    await connection
        .createQueryBuilder()
        .insert()
        .into(Ingredient)
        .values([
        {meal: bananaYoghurt, food: banana, foodAmount: 20},
        {meal: bananaYoghurt, food: yoghurt, foodAmount: 20},
        {meal: chickenAndRice, food: chicken, foodAmount: 20},
        {meal: chickenAndRice, food: rice, foodAmount: 20},
        ])
        .execute()
    }
}