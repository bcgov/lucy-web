import {MigrationInterface, QueryRunner} from 'typeorm';
import { SeedSchema } from '../database-schema';
import { AppDBMigrator } from '../applicationSchemaInterface';

export class SeedSchema1588201708197 extends AppDBMigrator implements MigrationInterface {

    seedSchema: SeedSchema;

    setup() {
        this.seedSchema = new SeedSchema();
        this.addSchemaInitVersion(this.seedSchema);
    }

    public async up(queryRunner: QueryRunner): Promise<any> {
        this.log('[START]', 'UP');
        await this.runQuerySqlFiles(this.upMigrations(), queryRunner);
        this.log('[END]', 'UP');
    }

    public async down(queryRunner: QueryRunner): Promise<any> {
        this.log('[START]', 'DOWN');
        await this.runQuerySqlFiles(this.downMigrations(), queryRunner);
        await queryRunner.query(this.seedSchema.dropTable());
        this.log('[END]', 'DOWN');
    }

}
