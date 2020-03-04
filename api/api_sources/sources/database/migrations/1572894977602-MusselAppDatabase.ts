import {MigrationInterface, QueryRunner} from 'typeorm';
import { WatercraftRiskAssessmentSchema,
         ObserverWorkflowSchema,
         HighRiskAssessmentSchema,
         AdultMusselsLocationSchema,
         PreviousAISKnowledgeSourceSchema,
         PreviousInspectionSourceSchema } from '../database-schema';
import { AppDBMigrator } from '../applicationSchemaInterface';


export class MusselAppDatabase1572894977602 extends AppDBMigrator implements MigrationInterface {

    waterCraftRiskAssessmentSchema: WatercraftRiskAssessmentSchema;
    observerWorkflowSchema: ObserverWorkflowSchema;
    highRiskAssessmentSchema: HighRiskAssessmentSchema;
    adultMusselsLocationSchema: AdultMusselsLocationSchema;
    previousAISKnowledgeSourceSchema: PreviousAISKnowledgeSourceSchema;
    previousInspectionSourceSchema: PreviousInspectionSourceSchema;
    /**
     * Setup
     */
    setup() {
        // Adding Water craft risk assessment init schema to migrator
        this.adultMusselsLocationSchema = new AdultMusselsLocationSchema();
        this.previousAISKnowledgeSourceSchema = new PreviousAISKnowledgeSourceSchema();
        this.previousInspectionSourceSchema = new PreviousInspectionSourceSchema();
        this.waterCraftRiskAssessmentSchema = new WatercraftRiskAssessmentSchema();
        this.observerWorkflowSchema = new ObserverWorkflowSchema();
        this.highRiskAssessmentSchema = new HighRiskAssessmentSchema();

        // Creating table
        this.addSchemaInitVersion(this.observerWorkflowSchema);
        this.addSchemaInitVersion(this.adultMusselsLocationSchema);
        this.addDataImportMigration(this.adultMusselsLocationSchema, 'init');
        this.addSchemaInitVersion(this.previousAISKnowledgeSourceSchema);
        this.addDataImportMigration(this.previousAISKnowledgeSourceSchema, 'init');
        this.addSchemaInitVersion(this.previousInspectionSourceSchema);
        this.addDataImportMigration(this.previousInspectionSourceSchema, 'init');
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
        await this.runQuerySqlFiles(this.importMigrations(), queryRunner);
        this.log('[END]', 'UP');
    }

    public async down(queryRunner: QueryRunner): Promise<any> {
        this.log('[RUN]', 'DOWN');
        await this.runQuerySqlFiles(this.downMigrations(), queryRunner);
        await queryRunner.query(this.waterCraftRiskAssessmentSchema.dropTable());
        await queryRunner.query(this.highRiskAssessmentSchema.dropTable());
        await queryRunner.query(this.adultMusselsLocationSchema.dropTable());
        await queryRunner.query(this.previousInspectionSourceSchema.dropTable());
        await queryRunner.query(this.previousAISKnowledgeSourceSchema.dropTable());
        await queryRunner.query(this.observerWorkflowSchema.dropTable());
    }

}
