import {MigrationInterface, QueryRunner} from 'typeorm';
import { AppDBMigrator } from '../applicationSchemaInterface';
import { WaterBodySchema, WatercraftJourneySchema, CountrySchema, CountryProvinceSchema } from '../database-schema';

export class WaterBodySchema1573000268598 extends AppDBMigrator implements MigrationInterface {
    countrySchema: CountrySchema;
    countryProvinceSchema: CountryProvinceSchema;
    waterBodySchema: WaterBodySchema;
    watercraftJourneySchema: WatercraftJourneySchema;
    /**
     * Setup
     */
    setup() {
        // Adding Water craft risk assessment init schema to migrator
        this.countrySchema = new CountrySchema();
        this.countryProvinceSchema = new CountryProvinceSchema();
        this.waterBodySchema = new WaterBodySchema();
        this.watercraftJourneySchema = new WatercraftJourneySchema();
        // Create Country table
        this.addSchemaInitVersion(this.countrySchema);
        // Add populate country table sql file
        this.addUpMigration(this.countrySchema.className, 'CountrySchema-init.sql');

        // Create Country province table
        this.addSchemaInitVersion(this.countryProvinceSchema);
        // Run Constraint sql script
        this.addUpMigration(this.countryProvinceSchema.className, 'CountryProvinceConstraints.sql');
        // Populate with schema import
        this.addDataImportMigration(this.countryProvinceSchema, 'init');

        // Create Water body table
        this.addSchemaInitVersion(this.waterBodySchema);

        // Add FK ref
        this.addUpMigration(this.waterBodySchema.className, 'WaterBodyConstraint.sql');
        // Populate water-body table with schema import
        this.addDataImportMigration(this.waterBodySchema, 'init');

        // Create watercraft journey schema
        this.addSchemaInitVersion(this.watercraftJourneySchema);
    }

    /**
     * UP: Create DB method
     */
    public async up(queryRunner: QueryRunner): Promise<any> {
         // Start Log
         this.log('[START]', 'UP');
         // Running all up migration files
         await this.runQuerySqlFiles(this.upMigrations(), queryRunner);
         await this.runQuerySqlFiles(this.importMigrations(), queryRunner);
         this.log('[END]', 'UP');
    }

    /**
     * Down: Revert
     */
    public async down(queryRunner: QueryRunner): Promise<any> {
        this.log('[STAR]', 'DOWN');
        await queryRunner.query(this.watercraftJourneySchema.dropTable());
        await queryRunner.query(this.waterBodySchema.dropTable());
        await queryRunner.query(this.countryProvinceSchema.dropTable());
        await queryRunner.query(this.countrySchema.dropTable());
        this.log('[END]', 'DOWN');
    }

}
