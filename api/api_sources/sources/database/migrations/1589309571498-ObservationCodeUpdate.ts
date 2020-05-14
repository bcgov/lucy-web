import {MigrationInterface, QueryRunner} from 'typeorm';
import { SoilTextureCodeSchema, getSQLFileData, SpecificUseCodeSchema } from '../database-schema';
import { AppDBMigrator } from '../applicationSchemaInterface';

export class ObservationCodeUpdate1589309571498 extends AppDBMigrator implements MigrationInterface {

    soilTextureSchema: SoilTextureCodeSchema;
    specificUseCodeSchema: SpecificUseCodeSchema;

    setup() {
        this.soilTextureSchema = new SoilTextureCodeSchema();
        this.specificUseCodeSchema = new SpecificUseCodeSchema();
    }

    public async up(queryRunner: QueryRunner): Promise<any> {
        this.log('[START]', 'UP');
        await queryRunner.query(getSQLFileData('SoilTextureCodeData-none.up.sql', this.soilTextureSchema.className));
        await queryRunner.query(getSQLFileData('SpecificUseCodeData-none.up.sql', this.specificUseCodeSchema.className));
        this.log('[END]', 'UP');
    }

    public async down(queryRunner: QueryRunner): Promise<any> {
        this.log('[START]', 'DOWN');
        await queryRunner.query(getSQLFileData('SoilTextureCodeData-none.down.sql', this.soilTextureSchema.className));
        await queryRunner.query(getSQLFileData('SpecificUseCodeData-none.down.sql', this.specificUseCodeSchema.className));
        this.log('[END]', 'DOWN');
    }

}
