import {MigrationInterface, QueryRunner} from 'typeorm';
import { AppDBMigrator } from '../applicationSchemaInterface';
import { SpeciesTreatmentSchema } from '../database-schema';

export class CreateSpeciesTreatment1574106157222 extends AppDBMigrator implements MigrationInterface {

    speciesTreatmentSchema: SpeciesTreatmentSchema;

    /**
     * Setup
     */
    setup() {
        // Adding Herbicide init schema to migrator
        this.speciesTreatmentSchema = new SpeciesTreatmentSchema();
        this.addSchemaInitVersion(this.speciesTreatmentSchema);
    }

    /**
     * UP: Create DB method
     */
    public async up(queryRunner: QueryRunner): Promise<any> {
         // Start Log
         this.log('[START]', 'UP');
         // Running all up migration files
         await this.runQuerySqlFiles(this.upMigrations(), queryRunner);
         this.log('[END]', 'UP');
    }

    /**
     * Down: Revert
     */
    public async down(queryRunner: QueryRunner): Promise<any> {
        this.log('[STAR]', 'DOWN');
        await queryRunner.query(this.speciesTreatmentSchema.dropTable());
        this.log('[END]', 'DOWN');
    }

}
