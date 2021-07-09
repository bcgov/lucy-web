import {MigrationInterface, QueryRunner} from 'typeorm';
import { AppDBMigrator } from '../applicationSchemaInterface';
import { WatercraftRiskAssessmentSchema } from '../database-schema';

export class WatercraftRiskAssessmentUpdateInspectionTime1625599791000 extends AppDBMigrator implements MigrationInterface {
    watercraftRiskAssessment: WatercraftRiskAssessmentSchema;

    setup() {
        this.watercraftRiskAssessment = new WatercraftRiskAssessmentSchema();
        this.addSchemaVersion(this.watercraftRiskAssessment, 'inspectionTime');
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
