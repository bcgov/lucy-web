import {MigrationInterface, QueryRunner} from 'typeorm';

export class CreateBlowBy1703285389562 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<any> {
        await queryRunner.query(`
            CREATE TABLE "blow_by" (
                "id" SERIAL NOT NULL,
                "blow_by_time" character varying NULL,
                "watercraft_complexity" character varying NULL,
                "reported_to_rapp" boolean NOT NULL DEFAULT false,
                CONSTRAINT "PK_b6a2e2bb3be67b05b8a2c4f6a4" PRIMARY KEY ("id")
            )
        `);
    }

   public async down(queryRunner: QueryRunner): Promise<any> {
       await queryRunner.query(`DROP TABLE "blow_by"`);
   }

}
