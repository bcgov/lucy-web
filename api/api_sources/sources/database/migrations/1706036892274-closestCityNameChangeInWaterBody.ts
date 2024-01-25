import { MigrationInterface, QueryRunner } from 'typeorm';

export class closestCityNameChangeInWaterBody1706036892274 implements MigrationInterface {
    public async up(queryRunner: QueryRunner): Promise<any> {
        await queryRunner.query(`UPDATE "water_body" SET "closest_city" = CONCAT('e.g. ', "closest_city")`);
    }

    public async down(queryRunner: QueryRunner): Promise<any> {
        await queryRunner.query(`UPDATE "water_body" SET "closest_city" = SUBSTRING("closest_city", 6)`);
    }
}
