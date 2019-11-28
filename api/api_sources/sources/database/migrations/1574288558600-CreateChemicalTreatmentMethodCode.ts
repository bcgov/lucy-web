import {MigrationInterface, QueryRunner} from 'typeorm';
import { ChemicalTreatmentMethodCodeSchema } from '../database-schema';
import { AppDBMigrator } from '../applicationSchemaInterface';

export class CreateChemicalTreatmentMethodCode1574288558600 extends AppDBMigrator implements MigrationInterface {

    chemicalTreatmentMethodCodeSchema: ChemicalTreatmentMethodCodeSchema;

    /**
     * Setup
     */
    setup() {
        // Adding chemical treatment method code init schema to migrator
        this.chemicalTreatmentMethodCodeSchema = new ChemicalTreatmentMethodCodeSchema();
        this.addSchemaInitVersion(this.chemicalTreatmentMethodCodeSchema);
        this.addDataImportMigration(this.chemicalTreatmentMethodCodeSchema, 'init');
    }

    /**
     * UP: Create DB method
     */
    public async up(queryRunner: QueryRunner): Promise<any> {
        // Start Log
        this.log('[START]', 'UP');
        // Running all up migration files
        await this.runQuerySqlFiles(this.upMigrations(), queryRunner);
        await this.runSQLFileAsync(this.importMigrations(), queryRunner);
        this.log('[END]', 'UP');
   }

   /**
    * Down: Revert
    */
   public async down(queryRunner: QueryRunner): Promise<any> {
    this.log('[STAR]', 'DOWN');
    await queryRunner.query(this.chemicalTreatmentMethodCodeSchema.dropTable());
    this.log('[END]', 'DOWN');
}

}
