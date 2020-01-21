import {MigrationInterface, QueryRunner} from 'typeorm';
import { AppDBMigrator } from '../applicationSchemaInterface';
import { MechanicalMonitorSchema } from '../database-schema';

export class CreateMechanicalMonitor1579567436660 extends AppDBMigrator implements MigrationInterface {

    mechanicalMonitorSchema: MechanicalMonitorSchema;

    /**
     * Setup
     */
    setup() {
        // Adding wind direction init schema to migrator
        this.mechanicalMonitorSchema = new MechanicalMonitorSchema();
        this.addSchemaInitVersion(this.mechanicalMonitorSchema);
        this.addDataImportMigration(this.mechanicalMonitorSchema, 'init');
    }

    public async up(queryRunner: QueryRunner): Promise<any> {
        // Start Log
        this.log('[START]', 'UP');
        // Running all up migration files
        await this.runQuerySqlFiles(this.upMigrations(), queryRunner);
        await this.runSQLFileAsync(this.importMigrations(), queryRunner);
        this.log('[END]', 'UP');
    }

    public async down(queryRunner: QueryRunner): Promise<any> {
        this.log('[START]', 'DOWN');
        await queryRunner.query(`DROP TABLE IF EXISTS mechanical_monitor`);
        await queryRunner.query(this.mechanicalMonitorSchema.dropTable());
        this.log('[END]', 'DOWN');
    }

}
