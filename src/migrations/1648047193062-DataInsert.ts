import { MigrationInterface } from "typeorm/migration/MigrationInterface"
import { QueryRunner } from "typeorm/query-runner/QueryRunner"


export class DataInsert1648047193062 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
            INSERT INTO public.food ("name", "brand", "description", "calories", "carbs", "fat", "protein", "isPublic", "userId") 
                VALUES ('Jasmine rice', '', 'Raw rice', 355.6, 80, 1.11, 6.67, true, null);
            INSERT INTO public.food ("name", "brand", "description", "calories", "carbs", "fat", "protein", "isPublic", "userId") 
                VALUES ('Basmati rice', '', 'Indian long-grain rice', 105, 22.8, 0.25, 2.5, true, null);
            INSERT INTO public.food ("name", "brand", "description", "calories", "carbs", "fat", "protein", "isPublic", "userId") 
                VALUES ('Grilled chicken', '', '', 88.50, 0.89, 1.77, 19.40, true, null);
            INSERT INTO public.food ("name", "brand", "description", "calories", "carbs", "fat", "protein", "isPublic", "userId") 
                VALUES ('Pork tenderloin', '', '', 106.20, 0.89, 2.21, 20.27, true, null);
            INSERT INTO public.food ("name", "brand", "description", "calories", "carbs", "fat", "protein", "isPublic", "userId") 
                VALUES ('Pork chops', '', '', 114.6, 0.88, 3.97, 20.28, true, null);
            INSERT INTO public.food ("name", "brand", "description", "calories", "carbs", "fat", "protein", "isPublic", "userId") 
                VALUES ('Apple', '', 'Medium red apple', 52, 13.81, 0.17, 0.26, true, null);
            INSERT INTO public.food ("name", "brand", "description", "calories", "carbs", "fat", "protein", "isPublic", "userId") 
                VALUES ('Banana', '', 'Medium banana', 89, 22.84, 0.33, 1.09, true, null);
            INSERT INTO public.food ("name", "brand", "description", "calories", "carbs", "fat", "protein", "isPublic", "userId") 
                VALUES ('Corn flakes', 'Kelloggs', '', 238.1, 57.14, 0, 4.76, true, null);
            INSERT INTO public.food ("name", "brand", "description", "calories", "carbs", "fat", "protein", "isPublic", "userId") 
                VALUES ('Frosted flakes', 'Kelloggs', '', 382.35, 88.24, 0, 5.88, true, null);
            INSERT INTO public.food ("name", "brand", "description", "calories", "carbs", "fat", "protein", "isPublic", "userId") 
                VALUES ('Milk', 'K-classic', 'Cow milk', 63.4, 5.1, 3.38, 3.38, true, null);
            INSERT INTO public.food ("name", "brand", "description", "calories", "carbs", "fat", "protein", "isPublic", "userId") 
                VALUES ('Soy milk', 'Alpro', 'Lactose free soy milk', 100, 9, 3.5, 6, true, null);
            INSERT INTO public.food ("name", "brand", "description", "calories", "carbs", "fat", "protein", "isPublic", "userId") 
                VALUES ('Yoghurt', 'Nutriday', '', 55.43, 9.71, 1.14, 1.43, true, null);
            INSERT INTO public.food ("name", "brand", "description", "calories", "carbs", "fat", "protein", "isPublic", "userId") 
                VALUES ('Yoghurt', 'Sainsburys', 'Greek yoghurt', 120, 5.3, 9.2, 4.1, true, null);
            `)
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
            DELETE FROM public.food WHERE name = 'Jasmine rice';
            DELETE FROM public.food WHERE name = 'Basmati rice';
            DELETE FROM public.food WHERE name = 'Grilled chicken';
            DELETE FROM public.food WHERE name = 'Pork tenderloin';
            DELETE FROM public.food WHERE name = 'Pork chops';
            DELETE FROM public.food WHERE name = 'Apple';
            DELETE FROM public.food WHERE name = 'Banana';
            DELETE FROM public.food WHERE name = 'Corn flakes';
            DELETE FROM public.food WHERE name = 'Frosted flakes';
            DELETE FROM public.food WHERE name = 'Milk';
            DELETE FROM public.food WHERE name = 'Soy milk';
            DELETE FROM public.food WHERE name = 'Yoghurt';
        `)
    }

}
