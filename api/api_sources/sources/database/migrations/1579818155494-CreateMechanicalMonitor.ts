import {MigrationInterface, QueryRunner} from 'typeorm';
import { AppDBMigrator } from '../applicationSchemaInterface';
import { MechanicalMonitorSchema } from '../database-schema';

export class CreateMechanicalMonitor1579818155494 extends AppDBMigrator implements MigrationInterface {

    mechanicalMonitorSchema: MechanicalMonitorSchema;

    /**
     * Setup
     */
    setup() {
        this.mechanicalMonitorSchema = new MechanicalMonitorSchema();
        this.addSchemaInitVersion(this.mechanicalMonitorSchema);
    }

    public async up(queryRunner: QueryRunner): Promise<any> {
        // Start Log
        this.log('[START]', 'UP');
        await this.runQuerySqlFiles(this.upMigrations(), queryRunner);
        this.log('[END]', 'UP');
    }

    public async down(queryRunner: QueryRunner): Promise<any> {
        this.log('[START]', 'DOWN');
        await queryRunner.query(this.mechanicalMonitorSchema.dropTable());
        this.log('[END]', 'DOWN');
    }

}
