import {MigrationInterface, QueryRunner} from 'typeorm';
import {
    WatercraftRiskAssessmentSchema,
    ObserverWorkflowSchema,
    HighRiskAssessmentSchema,
    AdultMusselsLocationSchema,
    PreviousAISKnowledgeSourceSchema,
    PreviousInspectionSourceSchema,
    CountrySchema,
    CountryProvinceSchema,
    MajorCitySchema,

} from '../database-schema';
import { AppDBMigrator } from '../applicationSchemaInterface';


export class MusselAppDatabase1572894977602 extends AppDBMigrator implements MigrationInterface {

    waterCraftRiskAssessmentSchema: WatercraftRiskAssessmentSchema;
    observerWorkflowSchema: ObserverWorkflowSchema;
    highRiskAssessmentSchema: HighRiskAssessmentSchema;
    adultMusselsLocationSchema: AdultMusselsLocationSchema;
    previousAISKnowledgeSourceSchema: PreviousAISKnowledgeSourceSchema;
    previousInspectionSourceSchema: PreviousInspectionSourceSchema;
    countrySchema: CountrySchema;
    majorCitiesSchema: MajorCitySchema;
    countryProvinceSchema: CountryProvinceSchema;
    /**
     * Setup
     */
    setup() {
        // Adding Water craft risk assessment init schema to migrator
        this.adultMusselsLocationSchema = new AdultMusselsLocationSchema();
        this.previousAISKnowledgeSourceSchema = new PreviousAISKnowledgeSourceSchema();
        this.previousInspectionSourceSchema = new PreviousInspectionSourceSchema();
        this.countrySchema = new CountrySchema();
        this.majorCitiesSchema = new MajorCitySchema();
        this.countryProvinceSchema = new CountryProvinceSchema();
        this.waterCraftRiskAssessmentSchema = new WatercraftRiskAssessmentSchema();
        this.observerWorkflowSchema = new ObserverWorkflowSchema();
        this.highRiskAssessmentSchema = new HighRiskAssessmentSchema();

        // Create Country table
        this.addSchemaInitVersion(this.countrySchema);
        // Add populate country table sql file
        this.addUpMigration(this.countrySchema.className, 'CountrySchema-init.sql');

        // Create Major Cities table
        this.addSchemaInitVersion(this.majorCitiesSchema);
        this.addUpMigration(this.majorCitiesSchema.className, 'MajorCitySchema-init.sql');

        // Create Country province table
        this.addSchemaInitVersion(this.countryProvinceSchema);
        // Run Constraint sql script
        this.addUpMigration(this.countryProvinceSchema.className, 'CountryProvinceConstraints.sql');
        // Populate with schema import
        this.addDataImportMigration(this.countryProvinceSchema, 'init');

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
        this.log('[START]', 'DOWN');
        await this.runQuerySqlFiles(this.downMigrations(), queryRunner);
        await queryRunner.query(this.waterCraftRiskAssessmentSchema.dropTable());
        await queryRunner.query(this.highRiskAssessmentSchema.dropTable());
        await queryRunner.query(this.adultMusselsLocationSchema.dropTable());
        await queryRunner.query(this.previousInspectionSourceSchema.dropTable());
        await queryRunner.query(this.previousAISKnowledgeSourceSchema.dropTable());
        await queryRunner.query(this.observerWorkflowSchema.dropTable());
        await queryRunner.query(this.countryProvinceSchema.dropTable());
        await queryRunner.query(this.countrySchema.dropTable());
        await queryRunner.query(this.majorCitiesSchema.dropTable());
        await queryRunner.query('DROP TABLE IF EXISTS adult_mussels_location');
        await queryRunner.query('DROP TABLE IF EXISTS previous_ais_knowledge_source');
        await queryRunner.query('DROP TABLE IF EXISTS previous_inspection_source');
        this.log('[END]', 'DOWN');
    }

}
