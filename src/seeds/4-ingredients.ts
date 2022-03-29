import { Factory, Seeder } from 'typeorm-seeding'
import { Connection } from 'typeorm'
import { Ingredient } from '../entities/Ingredient';
import { Meal } from '../entities/Meal';
    
export default class CreateIngredients implements Seeder {
    public async run(factory: Factory, connection: Connection): Promise<any> {
    await connection
        .createQueryBuilder()
        .delete()
        .from(Ingredient)
        .execute()
        
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
        
    await connection
        .createQueryBuilder()
        .insert()
        .into(Ingredient)
        .values([
        {meal: bananaYoghurt, name: 'Banana', amount: 20, calories: 100, carbs: 100, fat: 100, protein: 100},
        {meal: bananaYoghurt, name: 'Yoghurt', amount: 20, calories: 100, carbs: 100, fat: 100, protein: 100},
        {meal: chickenAndRice, name: 'Grilled chicken', amount: 20, calories: 100, carbs: 100, fat: 100, protein: 100},
        {meal: chickenAndRice, name: 'Basmati rice', amount: 20, calories: 100, carbs: 100, fat: 100, protein: 100},
        ])
        .execute()
    }
}