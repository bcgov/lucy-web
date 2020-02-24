import {MigrationInterface, QueryRunner} from 'typeorm';
import { AppDBMigrator } from '../applicationSchemaInterface';
import { PreviousInspectionSourceSchema } from '../database-schema';

export class AddPreviousInspectionSourceSchema1572243763424 extends AppDBMigrator implements MigrationInterface {

    previousInspectionSourceSchema: PreviousInspectionSourceSchema;

    /**
     * Setup
     */
    setup() {
        this.previousInspectionSourceSchema = new PreviousInspectionSourceSchema();
        this.addSchemaInitVersion(this.previousInspectionSourceSchema);
        this.addDataImportMigration(this.previousInspectionSourceSchema, 'init');
    }

    public async up(queryRunner: QueryRunner): Promise<any> {
        // Start Log
        this.log('[START]', 'UP');
        await this.runQuerySqlFiles(this.upMigrations(), queryRunner);
        this.log('[END]', 'UP');
    }

    public async down(queryRunner: QueryRunner): Promise<any> {
        this.log('[START]', 'DOWN');
        await queryRunner.query(this.previousInspectionSourceSchema.dropTable());
        this.log('[END]', 'DOWN');
    }

}
