import { MigrationInterface } from "typeorm/migration/MigrationInterface"
import { QueryRunner } from "typeorm/query-runner/QueryRunner"


export class DataInsert1648047193062 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
            INSERT INTO public.food ("id", "name", "brand", "description", "calories", "carbs", "fat", "protein", "isPublic", "userId") 
                VALUES ('398f9704-8d6d-4911-bd73-41066fe19237', 'Jasmine rice', '', 'Raw rice', 355.6, 80, 1.11, 6.67, true, null);
            INSERT INTO public.food ("id", "name", "brand", "description", "calories", "carbs", "fat", "protein", "isPublic", "userId") 
                VALUES ('b7d139d0-50df-46fa-90a4-a0f0440e401a', 'Basmati rice', '', 'Indian long-grain rice', 105, 22.8, 0.25, 2.5, true, null);
            INSERT INTO public.food ("id", "name", "brand", "description", "calories", "carbs", "fat", "protein", "isPublic", "userId") 
                VALUES ('c580405c-d8da-4fe4-b1d2-cf7e2134ef43', 'Grilled chicken', '', '', 88.50, 0.89, 1.77, 19.40, true, null);
            INSERT INTO public.food ("id", "name", "brand", "description", "calories", "carbs", "fat", "protein", "isPublic", "userId") 
                VALUES ('2dd6da04-074e-49bf-a672-1d3eb2d9a15a', 'Pork tenderloin', '', '', 106.20, 0.89, 2.21, 20.27, true, null);
            INSERT INTO public.food ("id", "name", "brand", "description", "calories", "carbs", "fat", "protein", "isPublic", "userId") 
                VALUES ('4ea26a6e-eda8-47b2-a7d2-9e339f943ab2', 'Pork chops', '', '', 114.6, 0.88, 3.97, 20.28, true, null);
            INSERT INTO public.food ("id", "name", "brand", "description", "calories", "carbs", "fat", "protein", "isPublic", "userId") 
                VALUES ('a9ca78c1-fad6-4cdb-84e5-0607e0868405', 'Apple', '', 'Medium red apple', 52, 13.81, 0.17, 0.26, true, null);
            INSERT INTO public.food ("id", "name", "brand", "description", "calories", "carbs", "fat", "protein", "isPublic", "userId") 
                VALUES ('7a39795d-dc1b-4857-9b41-84e1ac9029c2', 'Banana', '', 'Medium banana', 89, 22.84, 0.33, 1.09, true, null);
            INSERT INTO public.food ("id", "name", "brand", "description", "calories", "carbs", "fat", "protein", "isPublic", "userId") 
                VALUES ('e783f503-f170-4971-a4bd-359d5e679e93', 'Corn flakes', 'Kelloggs', '', 238.1, 57.14, 0, 4.76, true, null);
            INSERT INTO public.food ("id", "name", "brand", "description", "calories", "carbs", "fat", "protein", "isPublic", "userId") 
                VALUES ('eff39dd1-19eb-4094-8fef-bab28c3e2665', 'Frosted flakes', 'Kelloggs', '', 382.35, 88.24, 0, 5.88, true, null);
            INSERT INTO public.food ("id", "name", "brand", "description", "calories", "carbs", "fat", "protein", "isPublic", "userId") 
                VALUES ('7fbe98ff-85c6-4326-a005-e4d784c544fd', 'Milk', 'K-classic', 'Cow milk', 63.4, 5.1, 3.38, 3.38, true, null);
            INSERT INTO public.food ("id", "name", "brand", "description", "calories", "carbs", "fat", "protein", "isPublic", "userId") 
                VALUES ('107c4f32-1193-4c49-87df-1eab02b8a824', 'Soy milk', 'Alpro', 'Lactose free soy milk', 100, 9, 3.5, 6, true, null);
            INSERT INTO public.food ("id", "name", "brand", "description", "calories", "carbs", "fat", "protein", "isPublic", "userId") 
                VALUES ('f364274d-7429-4e8d-ae03-574e90f4b147', 'Yoghurt', 'Nutriday', '', 55.43, 9.71, 1.14, 1.43, true, null);
            INSERT INTO public.food ("id", "name", "brand", "description", "calories", "carbs", "fat", "protein", "isPublic", "userId") 
                VALUES ('727dca8e-d4c2-4cd3-ab36-1dcdbef04277', 'Yoghurt', 'Sainsburys', 'Greek yoghurt', 120, 5.3, 9.2, 4.1, true, null);
            `)
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
            DELETE FROM public.food WHERE id = '398f9704-8d6d-4911-bd73-41066fe19237';
            DELETE FROM public.food WHERE id = 'b7d139d0-50df-46fa-90a4-a0f0440e401a';
            DELETE FROM public.food WHERE id = 'c580405c-d8da-4fe4-b1d2-cf7e2134ef43';
            DELETE FROM public.food WHERE id = '2dd6da04-074e-49bf-a672-1d3eb2d9a15a';
            DELETE FROM public.food WHERE id = '4ea26a6e-eda8-47b2-a7d2-9e339f943ab2';
            DELETE FROM public.food WHERE id = 'a9ca78c1-fad6-4cdb-84e5-0607e0868405';
            DELETE FROM public.food WHERE id = '7a39795d-dc1b-4857-9b41-84e1ac9029c2';
            DELETE FROM public.food WHERE id = 'e783f503-f170-4971-a4bd-359d5e679e93';
            DELETE FROM public.food WHERE id = 'eff39dd1-19eb-4094-8fef-bab28c3e2665';
            DELETE FROM public.food WHERE id = '7fbe98ff-85c6-4326-a005-e4d784c544fd';
            DELETE FROM public.food WHERE id = '107c4f32-1193-4c49-87df-1eab02b8a824';
            DELETE FROM public.food WHERE id = '727dca8e-d4c2-4cd3-ab36-1dcdbef04277';
            DELETE FROM public.food WHERE id = 'f364274d-7429-4e8d-ae03-574e90f4b147';
            `)
    }

}
