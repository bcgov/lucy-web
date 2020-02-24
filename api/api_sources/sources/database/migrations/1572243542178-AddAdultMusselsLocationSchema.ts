import {MigrationInterface, QueryRunner} from 'typeorm';
import { AppDBMigrator } from '../applicationSchemaInterface';
import { AdultMusselsLocationSchema } from '../database-schema';

export class AddAdultMusselsLocationSchema1572243542178 extends AppDBMigrator implements MigrationInterface {

    adultMusselsLocationSchema: AdultMusselsLocationSchema;

    /**
     * Setup
     */
    setup() {
        this.adultMusselsLocationSchema = new AdultMusselsLocationSchema();
        this.addSchemaInitVersion(this.adultMusselsLocationSchema);
        this.addDataImportMigration(this.adultMusselsLocationSchema, 'init');
    }

    public async up(queryRunner: QueryRunner): Promise<any> {
        // Start Log
        this.log('[START]', 'UP');
        await this.runQuerySqlFiles(this.upMigrations(), queryRunner);
        this.log('[END]', 'UP');
    }

    public async down(queryRunner: QueryRunner): Promise<any> {
        this.log('[START]', 'DOWN');
        await queryRunner.query(this.adultMusselsLocationSchema.dropTable());
        this.log('[END]', 'DOWN');
    }

}
