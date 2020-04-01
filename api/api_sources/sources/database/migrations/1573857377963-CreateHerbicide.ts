import {MigrationInterface, QueryRunner} from 'typeorm';
import { AppDBMigrator } from '../applicationSchemaInterface';
import { HerbicideSchema } from '../database-schema';

export class CreateHerbicide1573857377963  extends AppDBMigrator implements MigrationInterface {
    herbicideSchema: HerbicideSchema;
    /**
     * Setup
     */
    setup() {
        // Adding Herbicide init schema to migrator
        this.herbicideSchema = new HerbicideSchema();
        this.addSchemaInitVersion(this.herbicideSchema);
        this.addDataImportMigration(this.herbicideSchema, 'init');
    }

    /**
     * UP: Create DB method
     */
    public async up(queryRunner: QueryRunner): Promise<any> {
         // Start Log
         this.log('[START]', 'UP');
         // Running all up migration files
         await this.runQuerySqlFiles(this.upMigrations(), queryRunner);
         await this.runSQLFileAsync(this.importMigrations(), queryRunner);
         this.log('[END]', 'UP');
    }

    /**
     * Down: Revert
     */
    public async down(queryRunner: QueryRunner): Promise<any> {
        this.log('[STAR]', 'DOWN');
        await queryRunner.query(this.herbicideSchema.dropTable());
        this.log('[END]', 'DOWN');
    }

}
