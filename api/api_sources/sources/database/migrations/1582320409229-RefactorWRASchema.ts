import {MigrationInterface, QueryRunner} from 'typeorm';
import { AppDBMigrator } from '../applicationSchemaInterface';
import { WatercraftRiskAssessmentSchema } from '../database-schema';

export class RefactorWRASchema1582320409229 extends AppDBMigrator implements MigrationInterface {

    waterCraftRiskAssessmentSchema: WatercraftRiskAssessmentSchema;

    setup() {
        this.waterCraftRiskAssessmentSchema = WatercraftRiskAssessmentSchema.shared;

        // add version
        this.addSchemaVersion(this.waterCraftRiskAssessmentSchema, 'refactorTextFieldsToDropdowns');
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
