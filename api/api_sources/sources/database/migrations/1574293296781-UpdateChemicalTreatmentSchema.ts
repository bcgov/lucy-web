import {MigrationInterface, QueryRunner} from 'typeorm';
import { AppDBMigrator } from '../applicationSchemaInterface';
import { ChemicalTreatmentSchema } from '../database-schema';

export class UpdateChemicalTreatmentSchema1574293296781 extends AppDBMigrator implements MigrationInterface {

    schema: ChemicalTreatmentSchema;
    /**
     * Schemas
     */
    setup() {
        this.schema = new ChemicalTreatmentSchema();
        this.addSchemaVersion(this.schema, 'codes');
        this.addSchemaVersion(this.schema, 'addCommentsColumn');
        this.addSchemaVersion(this.schema, 'addMixDeliveryRateColumn');
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
