import { Factory, Seeder } from 'typeorm-seeding'
import { Connection } from 'typeorm'
import { Meal } from '../entities/Meal'
import { User } from '../entities/User'
    
export default class CreateMeals implements Seeder {
    public async run(factory: Factory, connection: Connection): Promise<any> {
    
    const adam = await connection
        .createQueryBuilder()
        .select("user")
        .where("user.id = :id", { id: '9696063f-13b8-4979-80d8-aafbac79c62a' })
        .from(User, "user")
        .getOne()

    const jakub = await connection
        .createQueryBuilder()
        .select("user")
        .where("user.id = :id", { id: 'b05f7ef7-ad07-4a25-8363-cdeafd369d62' })
        .from(User, "user")
        .getOne()

    await connection
        .createQueryBuilder()
        .insert()
        .into(Meal)
        .values([
        {id: '38e011fc-375f-4f7b-84f8-e085935ec9c9', name: 'Banana yoghurt', description: '', calories: 1, carbs: 1, fat: 1, protein: 1, isPublic: true, user: adam},
        {id: 'b601b5ee-4bd0-4db2-83b4-7d27d6e1d701', name: 'Grilled chicken with basmati rice', description: '', calories: 1, carbs: 1, fat: 1, protein: 1, isPublic: true, user: jakub},
        ])
        .execute()
    }
}