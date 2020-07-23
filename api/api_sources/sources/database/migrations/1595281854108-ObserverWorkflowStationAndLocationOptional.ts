import {MigrationInterface, QueryRunner} from 'typeorm';
import { AppDBMigrator } from '../applicationSchemaInterface';
import { ObserverWorkflowSchema } from '../database-schema';


export class ObserverWorkflowStationAndLocationOptional1595281854108 extends AppDBMigrator implements MigrationInterface {
    observerWorkflow: ObserverWorkflowSchema;

    setup() {
        this.observerWorkflow = new ObserverWorkflowSchema();
        this.addSchemaVersion(this.observerWorkflow, 'temporaryApiChanges');
    }

    public async up(queryRunner: QueryRunner): Promise<any> {
        // Start Log
        this.log('[START]', 'UP');
        // Running all up migration files
        await this.runQuerySqlFiles(this.upMigrations(), queryRunner);
        this.log('[END]', 'UP');
    }

    public async down(queryRunner: QueryRunner): Promise<any> {
        this.log('[STAR]', 'DOWN');
        await this.runQuerySqlFiles(this.downMigrations(), queryRunner);
        this.log('[END]', 'DOWN');
    }

}
