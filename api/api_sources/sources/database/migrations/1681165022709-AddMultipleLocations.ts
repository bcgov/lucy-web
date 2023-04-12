import { MigrationInterface, QueryRunner } from 'typeorm';
import { AppDBMigrator } from '../applicationSchemaInterface';
import { HighRiskAssessmentSchema } from '../database-schema';


export class AddMultipleLocations1681165022709 extends AppDBMigrator implements MigrationInterface {
    highRiskAssessment: HighRiskAssessmentSchema;

    setup() {
        this.highRiskAssessment = new HighRiskAssessmentSchema();
        this.addSchemaVersion(this.highRiskAssessment, 'addMultipleLocations');
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
