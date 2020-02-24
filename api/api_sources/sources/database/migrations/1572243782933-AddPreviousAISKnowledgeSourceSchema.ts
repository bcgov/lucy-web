import {MigrationInterface, QueryRunner} from 'typeorm';
import { AppDBMigrator } from '../applicationSchemaInterface';
import { PreviousAISKnowledgeSourceSchema } from '../database-schema';

export class AddPreviousAISKnowledgeSourceSchema1572243782933 extends AppDBMigrator implements MigrationInterface {

    previousAISKnowledgeSourceSchema: PreviousAISKnowledgeSourceSchema;

    /**
     * Setup
     */
    setup() {
        this.previousAISKnowledgeSourceSchema = new PreviousAISKnowledgeSourceSchema();
        this.addSchemaInitVersion(this.previousAISKnowledgeSourceSchema);
        this.addDataImportMigration(this.previousAISKnowledgeSourceSchema, 'init');
    }

    public async up(queryRunner: QueryRunner): Promise<any> {
        // Start Log
        this.log('[START]', 'UP');
        await this.runQuerySqlFiles(this.upMigrations(), queryRunner);
        this.log('[END]', 'UP');
    }

    public async down(queryRunner: QueryRunner): Promise<any> {
        this.log('[START]', 'DOWN');
        await queryRunner.query(this.previousAISKnowledgeSourceSchema.dropTable());
        this.log('[END]', 'DOWN');
    }

}
