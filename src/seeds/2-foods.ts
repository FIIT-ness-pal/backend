import { Factory, Seeder } from 'typeorm-seeding'
import { Connection } from 'typeorm'
import { Food } from '../entities/Food';
import { User } from '../entities/User';
    
export default class CreateFoods implements Seeder {
    public async run(factory: Factory, connection: Connection): Promise<any> {
    await connection
        .createQueryBuilder()
        .delete()
        .from(Food)
        .execute()
        
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
        .into(Food)
        .values([
        {id: '398f9704-8d6d-4911-bd73-41066fe19237', name: 'Jasmine rice', brand: '', description: 'Raw rice', calories: 355.6, carbs: 80, fat: 1.11, protein: 6.67, isPublic: true, user: adam},
        {id: 'b7d139d0-50df-46fa-90a4-a0f0440e401a', name: 'Basmati rice', brand: '', description: 'Indian long-grain rice', calories: 105, carbs: 22.8, fat: 0.25, protein: 2.5, isPublic: true, user: jakub},
        {id: 'c580405c-d8da-4fe4-b1d2-cf7e2134ef43', name: 'Grilled chicken', brand: '', description: '', calories: 88.5, carbs: 0.89, fat: 1.77, protein: 19.4, isPublic: true, user: adam},
        {id: '2dd6da04-074e-49bf-a672-1d3eb2d9a15a', name: 'Pork tenderloin', brand: '', description: '', calories: 106.2, carbs: 0.89, fat: 2.21, protein: 20.27, isPublic: true, user: jakub},
        {id: '4ea26a6e-eda8-47b2-a7d2-9e339f943ab2', name: 'Pork chops', brand: '', description: '', calories: 114.6, carbs: 0.88, fat: 3.97, protein: 20.28, isPublic: true, user: adam},
        {id: 'a9ca78c1-fad6-4cdb-84e5-0607e0868405', name: 'Apple', brand: '', description: 'Medium red apple', calories: 52, carbs: 13.81, fat: 0.17, protein: 0.26, isPublic: true, user: jakub},
        {id: '7a39795d-dc1b-4857-9b41-84e1ac9029c2', name: 'Banana', brand: '', description: 'Medium banana', calories: 89, carbs: 22.84, fat: 0.33, protein: 1.09, isPublic: true, user: adam},
        {id: 'e783f503-f170-4971-a4bd-359d5e679e93', name: 'Corn flakes', brand: 'Kelloggs', description: '', calories: 238.1, carbs: 57.14, fat: 0, protein: 4.76, isPublic: true, user: jakub},
        {id: 'eff39dd1-19eb-4094-8fef-bab28c3e2665', name: 'Frosted flakes', brand: 'Kelloggs', description: '', calories: 382.35, carbs: 88.24, fat: 0, protein: 5.88, isPublic: true, user: adam},
        {id: '7fbe98ff-85c6-4326-a005-e4d784c544fd', name: 'Milk', brand: 'K-classic', description: 'Cow milk', calories: 63.4, carbs: 5.1, fat: 3.38, protein: 3.38, isPublic: true, user: jakub},
        {id: '107c4f32-1193-4c49-87df-1eab02b8a824', name: 'Soy milk', brand: 'Alpro', description: 'Lactose free soy milk', calories: 100, carbs: 9, fat: 3.5, protein: 6, isPublic: true, user: adam},
        {id: 'f364274d-7429-4e8d-ae03-574e90f4b147', name: 'Yoghurt', brand: 'Nutriday', description: '', calories: 55.43, carbs: 9.71, fat: 1.14, protein: 1.43, isPublic: true, user: jakub},
        {id: '727dca8e-d4c2-4cd3-ab36-1dcdbef04277', name: 'Yoghurt', brand: 'Sainsburys', description: 'Greek yoghurt', calories: 120, carbs: 5.3, fat: 9.2, protein: 4.1, isPublic: true, user: adam}

        ])
        .execute()
    }
}