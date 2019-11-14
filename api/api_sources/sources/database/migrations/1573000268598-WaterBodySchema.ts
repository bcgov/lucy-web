import {MigrationInterface, QueryRunner} from 'typeorm';
import { AppDBMigrator } from '../applicationSchemaInterface';
import { WaterBodySchema } from '../database-schema';

export class WaterBodySchema1573000268598 extends AppDBMigrator implements MigrationInterface {
    waterBodySchema: WaterBodySchema;

    /**
     * Setup
     */
    setup() {
        // Adding Water craft risk assessment init schema to migrator
        this.waterBodySchema = new WaterBodySchema();
        this.addSchemaInitVersion(this.waterBodySchema);
        this.addDataImportMigration(this.waterBodySchema, 'init');
    }

    /**
     * UP: Create DB method
     */
    public async up(queryRunner: QueryRunner): Promise<any> {
         // Start Log
         this.log('[START]', 'UP');
         // Running all up migration files
         await this.runQuerySqlFiles(this.upMigrations(), queryRunner);
         await this.runSQLFileAsync(this.importMigrations(), queryRunner);
         this.log('[END]', 'UP');
    }

    /**
     * Down: Revert
     */
    public async down(queryRunner: QueryRunner): Promise<any> {
        this.log('[STAR]', 'DOWN');
        await queryRunner.query(this.waterBodySchema.dropTable());
        this.log('[END]', 'DOWN');
    }

}
