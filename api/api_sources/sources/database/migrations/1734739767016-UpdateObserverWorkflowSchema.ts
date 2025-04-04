import {MigrationInterface, QueryRunner} from 'typeorm';
import { AppDBMigrator } from '../applicationSchemaInterface';
import { ObserverWorkflowSchema } from '../database-schema';

export class UpdateObserverWorkflowSchema1734739767016 extends AppDBMigrator implements MigrationInterface {
    observerWorkflowSchema: ObserverWorkflowSchema;

    setup() {
        this.observerWorkflowSchema = new ObserverWorkflowSchema();
        this.addSchemaVersion(this.observerWorkflowSchema, 'stationInformation');
    }
    public upMigrations(): [string, string][] {
        return [
            ['ObserverWorkflowSchema-stationInformation-20241220.up.sql', 'ObserverWorkflowSchema']
        ];
    }
    public downMigrations(): [string, string][] {
        return [
            ['ObserverWorkflowSchema-stationInformation-20241220.down.sql', 'ObserverWorkflowSchema']
        ];
    }
    public async up(queryRunner: QueryRunner): Promise<any> {
        this.log('[START]', 'UP');
        await this.runQuerySqlFiles(this.upMigrations(), queryRunner);
        this.log('[END]', 'UP');
    }

    public async down(queryRunner: QueryRunner): Promise<any> {
        this.log('[START]', 'DOWN');
        await this.runQuerySqlFiles(this.downMigrations(), queryRunner);
        this.log('[END]', 'DOWN');
    }
}
