import {MigrationInterface, QueryRunner} from "typeorm";

export class MealFoodsFoodInsert1648552313537 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
            INSERT INTO public.ingredient ("mealId", "foodId", "foodAmount")
                VALUES ('38e011fc-375f-4f7b-84f8-e085935ec9c9', '7a39795d-dc1b-4857-9b41-84e1ac9029c2', 20);
            INSERT INTO public.ingredient ("mealId", "foodId", "foodAmount")
                VALUES ('38e011fc-375f-4f7b-84f8-e085935ec9c9', 'f364274d-7429-4e8d-ae03-574e90f4b147', 20);
            INSERT INTO public.ingredient ("mealId", "foodId", "foodAmount")
                VALUES ('b601b5ee-4bd0-4db2-83b4-7d27d6e1d701', 'c580405c-d8da-4fe4-b1d2-cf7e2134ef43', 20);
            INSERT INTO public.ingredient ("mealId", "foodId",  "foodAmount")
                VALUES ('b601b5ee-4bd0-4db2-83b4-7d27d6e1d701', 'b7d139d0-50df-46fa-90a4-a0f0440e401a', 20);
        `)
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
    }

}
