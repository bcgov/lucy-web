import {MigrationInterface, QueryRunner} from 'typeorm';
import { WatercraftRiskAssessmentSchema, ObserverWorkflowSchema, HighRiskAssessmentSchema } from '../database-schema';
import { AppDBMigrator } from '../applicationSchemaInterface';


export class CreateMusselAppDatabase1572582003161 extends AppDBMigrator implements MigrationInterface {

    waterCraftRiskAssessmentSchema: WatercraftRiskAssessmentSchema;
    observerWorkflowSchema: ObserverWorkflowSchema;
    highRiskAssessmentSchema: HighRiskAssessmentSchema;
    /**
     * Setup
     */
    setup() {
        // Adding Water craft risk assessment init schema to migrator
        this.waterCraftRiskAssessmentSchema = new WatercraftRiskAssessmentSchema();
        this.observerWorkflowSchema = new ObserverWorkflowSchema();
        this.highRiskAssessmentSchema = new HighRiskAssessmentSchema();

        // Creating table
        this.addSchemaInitVersion(this.observerWorkflowSchema);
        this.addSchemaInitVersion(this.highRiskAssessmentSchema);
        this.addSchemaInitVersion(this.waterCraftRiskAssessmentSchema);
        // Alter table with version
        this.addSchemaVersion(this.waterCraftRiskAssessmentSchema, 'workflow');
    }

    public async up(queryRunner: QueryRunner): Promise<any> {
        // Start Log
        this.log('[START]', 'UP');
        // Running all up migration files
        await this.runQuerySqlFiles(this.upMigrations(), queryRunner);
        this.log('[END]', 'UP');
    }

    public async down(queryRunner: QueryRunner): Promise<any> {
        this.log('[RUN]', 'DOWN');
        await this.runQuerySqlFiles(this.downMigrations(), queryRunner);
        await queryRunner.query(this.waterCraftRiskAssessmentSchema.dropTable());
        await queryRunner.query(this.highRiskAssessmentSchema.dropTable());
        await queryRunner.query(this.observerWorkflowSchema.dropTable());
    }

}
