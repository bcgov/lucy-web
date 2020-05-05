import {MigrationInterface, QueryRunner} from 'typeorm';
import { EfficacyCodeSchema } from '../database-schema';
import { AppDBMigrator } from '../applicationSchemaInterface';

export class CreateEfficacyCodes1579565524764 extends AppDBMigrator implements MigrationInterface {

    efficacyCodeSchema: EfficacyCodeSchema;

    /**
     * Setup
     */
    setup() {
        this.efficacyCodeSchema = new EfficacyCodeSchema();
        this.addSchemaInitVersion(this.efficacyCodeSchema);
        this.addDataImportMigration(this.efficacyCodeSchema, 'init');
    }

    public async up(queryRunner: QueryRunner): Promise<any> {
        // Start Log
        this.log('[START]', 'UP');
        // Running all up migration files
        await this.runQuerySqlFiles(this.upMigrations(), queryRunner);
        await this.runSQLFileAsync(this.importMigrations(), queryRunner);
        this.log('[END]', 'UP');
    }

    public async down(queryRunner: QueryRunner): Promise<any> {
        this.log('[START]', 'DOWN');
        await queryRunner.query(`DROP TABLE IF EXISTS efficacy_code`);
        await queryRunner.query(this.efficacyCodeSchema.dropTable());
        this.log('[END]', 'DOWN');
    }

}
