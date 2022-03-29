import {MigrationInterface, QueryRunner} from "typeorm";

export class UserInsert1648555537634 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
            INSERT INTO public.user(id, "firstName", "lastName", "passwordHash", email, weight, height, "birthDate", "caloriesGoal", photo)
                VALUES ('b05f7ef7-ad07-4a25-8363-cdeafd369d62', 'Adam', 'Blahovič', '$2b$10$gfL9nLgZWfjUPxluRgYdiuVXTarjM/IC5EbzUZ0mS/lv85myq5p9K', 'xblahovic@stuba.sk', 100, 100, '1998-10-10', 4200, 'images/avatar.png');
            INSERT INTO public.user(id, "firstName", "lastName", "passwordHash", email, weight, height, "birthDate", "caloriesGoal", photo)
                VALUES ('9696063f-13b8-4979-80d8-aafbac79c62a', 'Jakub', 'Abrahoim', '$2b$10$gfL9nLgZWfjUPxluRgYdiuVXTarjM/IC5EbzUZ0mS/lv85myq5p9K', 'xabrahoim@stuba.sk', 100, 100, '1998-10-10', 4200, 'images/avatar.png');
        `)
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
            DELETE FROM public.user WHERE id = 'b05f7ef7-ad07-4a25-8363-cdeafd369d62';
            DELETE FROM public.user WHERE id = '9696063f-13b8-4979-80d8-aafbac79c62a';
        `)
    }

}
