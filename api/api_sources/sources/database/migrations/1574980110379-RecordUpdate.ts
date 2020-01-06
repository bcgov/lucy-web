import {MigrationInterface, QueryRunner} from 'typeorm';
import { AppDBMigrator } from '../applicationSchemaInterface';
import { ObservationSchema, MechanicalTreatmentSchema, ChemicalTreatmentSchema } from '../database-schema';

/**
 * Migration Class
 */
export class RecordUpdate1574980110379 extends AppDBMigrator implements MigrationInterface {

    observationSchema: ObservationSchema;
    mechanicalTreatmentSchema: MechanicalTreatmentSchema;
    chemicalTreatmentSchema: ChemicalTreatmentSchema;
    /**
     * Schemas
     */
    setup() {
        // Add observation schema update sql files
        this.observationSchema = ObservationSchema.shared;
        this.mechanicalTreatmentSchema = MechanicalTreatmentSchema.shared;
        this.chemicalTreatmentSchema = ChemicalTreatmentSchema.shared;

        // Adding space geom version
        this.addSchemaVersion(this.observationSchema, 'spaceGeom');
        this.addSchemaVersion(this.mechanicalTreatmentSchema, 'spaceGeom');
        this.addSchemaVersion(this.chemicalTreatmentSchema, 'spaceGeom');
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
