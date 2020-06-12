import {MigrationInterface, QueryRunner} from 'typeorm';
import { AppDBMigrator } from '../applicationSchemaInterface';
import { WaterBodySchema } from '../database-schema';

export class WaterBodyJune20201591902653132 extends AppDBMigrator implements MigrationInterface {

    // WaterBodySchema Init
    waterBodySchema: WaterBodySchema;
    /**
     * Setup
     */
    setup() {
        this.waterBodySchema = new WaterBodySchema();
        this.addDataImportMigration(this.waterBodySchema, 'june2020');
    }

    public async up(queryRunner: QueryRunner): Promise<any> {
         // Start Log
         this.log('[START]', 'UP');
         // Insert New entry to country_province table
         // Prince Edward Island (PE)
         await queryRunner.query(`INSERT INTO country_province(province_code,country_code,description) VALUES ('PE','CAN','Prince Edward Island');`);
         // Running all up migration files
         await this.runQuerySqlFiles(this.importMigrations(), queryRunner);
         this.log('[END]', 'UP');
    }

    public async down(queryRunner: QueryRunner): Promise<any> {
        this.log('[START]', 'DOWN');
        this.log('[END]', 'DOWN');
    }

}
