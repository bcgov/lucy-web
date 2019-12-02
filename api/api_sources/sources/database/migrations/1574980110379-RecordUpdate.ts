import {MigrationInterface, QueryRunner} from 'typeorm';
import { AppDBMigrator } from '../applicationSchemaInterface';
import { ObservationSchema, MechanicalTreatmentSchema } from '../database-schema';

/**
 * Migration Class
 */
export class RecordUpdate1574980110379 extends AppDBMigrator implements MigrationInterface {

    observationSchema: ObservationSchema;
    mechanicalTreatmentSchema: MechanicalTreatmentSchema;
    /**
     * Schemas
     */
    setup() {
        // Add observation schema update sql files
        this.observationSchema = new ObservationSchema();
        this.mechanicalTreatmentSchema = MechanicalTreatmentSchema.shared;

        // Adding space geom version
        this.addSchemaVersion(this.observationSchema, 'spaceGeom');
        this.addSchemaVersion(this.mechanicalTreatmentSchema, 'spaceGeom');
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
