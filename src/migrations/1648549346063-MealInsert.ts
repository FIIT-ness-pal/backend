import {MigrationInterface, QueryRunner} from "typeorm";

export class MealInsert1648549346063 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
            INSERT INTO public.meal ("id", "name", "description", "calories", "carbs", "fat", "protein", "isPublic", "userId")
                VALUES ('38e011fc-375f-4f7b-84f8-e085935ec9c9', 'Banana yoghurt', '', '1', '1', '1', '1', 'true', '9696063f-13b8-4979-80d8-aafbac79c62a');
            INSERT INTO public.meal ("id", "name", "description", "calories", "carbs", "fat", "protein", "isPublic", "userId")
                VALUES ('b601b5ee-4bd0-4db2-83b4-7d27d6e1d701', 'Grilled chicken with basmati rice', '', '1', '1', '1', '1', 'true', '9696063f-13b8-4979-80d8-aafbac79c62a');
        `)
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
            DELETE FROM public.meal WHERE name = 'Banana yoghurt';
            DELETE FROM public.meal WHERE name = 'Grilled chicken with basmati rice';
        `)
    }

}
