import {MigrationInterface, QueryRunner} from "typeorm";

export class LogInsert1648557277096 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
            INSERT INTO public.log(id, name, amount, calories, carbs, fat, protein, date, "time", "userId")
                VALUES ('8a3a903e-2820-469e-a00a-81ac2dfb0584', Orange, 100, 10, 10, 10, 10, 2022-03-29, 10:55:32, 'b05f7ef7-ad07-4a25-8363-cdeafd369d62');
            INSERT INTO public.log(id, name, amount, calories, carbs, fat, protein, date, "time", "userId")
                VALUES ('c31ab0e9-3180-482b-a88a-b647fa22905d', Apple, 100, 10, 10, 10, 10, 2022-03-30, 10:59:40, 'b05f7ef7-ad07-4a25-8363-cdeafd369d62');
            INSERT INTO public.log(id, name, amount, calories, carbs, fat, protein, date, "time", "userId")
                VALUES ('11b5fb47-ce43-42d0-a4b1-04d4819b0a20', Apple, 100, 10, 10, 10, 10, 2022-03-29, 10:40:21, '9696063f-13b8-4979-80d8-aafbac79c62a');
        `)
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
    }

}
