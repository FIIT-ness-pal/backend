import { Factory, Seeder } from 'typeorm-seeding'
import { Connection } from 'typeorm'
import { Log } from '../entities/Log'
import { User } from '../entities/User';
    
export default class CreateLogs implements Seeder {
    public async run(factory: Factory, connection: Connection): Promise<any> {
    await connection
        .createQueryBuilder()
        .delete()
        .from(Log)
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
        .into(Log)
        .values([
            {id: '8a3a903e-2820-469e-a00a-81ac2dfb0584', name: 'Orange', amount: 100, calories: 10, carbs: 10, fat: 10, protein: 10, date: '2022-03-29', "time": '10:55:32', "user": adam},
            {id: 'c31ab0e9-3180-482b-a88a-b647fa22905d', name: 'Apple', amount: 100, calories: 10, carbs: 10, fat: 10, protein: 10, date: '2022-03-30', "time": '10:59:40', "user": jakub},
            {id: '11b5fb47-ce43-42d0-a4b1-04d4819b0a20', name: 'Apple', amount: 100, calories: 10, carbs: 10, fat: 10, protein: 10, date: '2022-03-29', "time": '10:40:21', "user": adam},
        ])
        .execute()
    }
}