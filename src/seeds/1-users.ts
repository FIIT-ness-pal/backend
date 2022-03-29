import { Factory, Seeder } from 'typeorm-seeding'
import { Connection } from 'typeorm'
import { User } from '../entities/User'
 
export default class CreateUsers implements Seeder {
  public async run(factory: Factory, connection: Connection): Promise<any> {
    await connection
      .createQueryBuilder()
      .insert()
      .into(User)
      .values([
        {id: '9696063f-13b8-4979-80d8-aafbac79c62a', firstName: 'Jakub', lastName: 'Abrahoim', passwordHash: '$2b$10$gfL9nLgZWfjUPxluRgYdiuVXTarjM/IC5EbzUZ0mS/lv85myq5p9K', email: 'xabrahoim@stuba.sk', weight: 100, height: 100, birthDate: '1998-10-10', caloriesGoal: 4200, photo: 'images/avatar.png'},
        {id: 'b05f7ef7-ad07-4a25-8363-cdeafd369d62', firstName: 'Adam', lastName: 'Blahovič', passwordHash: '$2b$10$gfL9nLgZWfjUPxluRgYdiuVXTarjM/IC5EbzUZ0mS/lv85myq5p9K', email: 'xblahovic@stuba.sk', weight: 100, height: 100, birthDate: '1998-10-10', caloriesGoal: 4200, photo: 'images/avatar.png'},
      ])
      .execute()
  }
}