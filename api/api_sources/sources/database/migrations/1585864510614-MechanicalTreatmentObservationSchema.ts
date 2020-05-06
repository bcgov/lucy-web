import {MigrationInterface, QueryRunner} from 'typeorm';
import { MechanicalTreatmentSchema, MechanicalTreatmentObservationSchema } from '../database-schema';
import { AppDBMigrator } from '../applicationSchemaInterface';

export class MechanicalTreatmentObservationSchema1585864510614 extends AppDBMigrator implements MigrationInterface {

    mechanicalTreatmentSchema: MechanicalTreatmentSchema;
    mechanicalTreatmentObservationSchema: MechanicalTreatmentObservationSchema;
    /**
     * Setup
     */
    setup() {
        // Adding Water craft risk assessment init schema to migrator
        this.mechanicalTreatmentSchema = new MechanicalTreatmentSchema();
        this.mechanicalTreatmentObservationSchema = new MechanicalTreatmentObservationSchema();

        // Modifying existing table
        this.addSchemaVersion(this.mechanicalTreatmentSchema, 'observations');

        // Creating table
        this.addSchemaInitVersion(this.mechanicalTreatmentObservationSchema);
    }

    public async up(queryRunner: QueryRunner): Promise<any> {
        this.log('[START]', 'UP');
        // Running all up migration files
        await this.runQuerySqlFiles(this.upMigrations(), queryRunner);
        this.log('[END]', 'UP');
    }

    public async down(queryRunner: QueryRunner): Promise<any> {
        this.log('[STAR]', 'DOWN');
        await queryRunner.query(`DELETE FROM mechanical_treatment`);
        await this.runQuerySqlFiles(this.downMigrations(), queryRunner);
        await queryRunner.query(this.mechanicalTreatmentObservationSchema.dropTable());
        this.log('[END]', 'DOWN');
    }

}
