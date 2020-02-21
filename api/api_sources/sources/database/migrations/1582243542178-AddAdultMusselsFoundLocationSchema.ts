import {MigrationInterface, QueryRunner} from 'typeorm';
import { AppDBMigrator } from '../applicationSchemaInterface';
import { AdultMusselsFoundLocationSchema } from '../database-schema';

export class AddAdultMusselsFoundLocationSchema1582243542178 extends AppDBMigrator implements MigrationInterface {

    adultMusselsFoundLocationSchema: AdultMusselsFoundLocationSchema;

    /**
     * Setup
     */
    setup() {
        this.adultMusselsFoundLocationSchema = new AdultMusselsFoundLocationSchema();
        this.addSchemaInitVersion(this.adultMusselsFoundLocationSchema);
    }

    public async up(queryRunner: QueryRunner): Promise<any> {
        // Start Log
        this.log('[START]', 'UP');
        await this.runQuerySqlFiles(this.upMigrations(), queryRunner);
        this.log('[END]', 'UP');
    }

    public async down(queryRunner: QueryRunner): Promise<any> {
        this.log('[START]', 'DOWN');
        await queryRunner.query(this.adultMusselsFoundLocationSchema.dropTable());
        this.log('[END]', 'DOWN');
    }

}
