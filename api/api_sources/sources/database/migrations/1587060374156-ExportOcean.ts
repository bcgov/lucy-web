import {MigrationInterface, QueryRunner} from 'typeorm';
import { AppDBMigrator } from '../applicationSchemaInterface';
import { WaterBodySchema } from '../database-schema';

export class ExportOcean1587060374156 extends AppDBMigrator implements MigrationInterface {
    waterBodySchema: WaterBodySchema;
    /**
     * Setup
     */
    setup() {
        this.waterBodySchema = new WaterBodySchema();
        this.addDataImportMigration(this.waterBodySchema, 'ocean');
    }

    public async up(queryRunner: QueryRunner): Promise<any> {
        // Start Log
        this.log('[START]', 'UP');
        // Running all up migration files
        await this.runQuerySqlFiles(this.importMigrations(), queryRunner);
        this.log('[END]', 'UP');
    }

    public async down(queryRunner: QueryRunner): Promise<any> {
        this.log('[START]', 'DOWN');
        this.log('[END]', 'DOWN');
    }

}
