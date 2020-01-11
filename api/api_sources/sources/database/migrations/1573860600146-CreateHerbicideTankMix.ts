import {MigrationInterface, QueryRunner} from 'typeorm';
import { AppDBMigrator } from '../applicationSchemaInterface';
import { HerbicideTankMixSchema } from '../database-schema';

export class CreateHerbicideTankMix1573860600146 extends AppDBMigrator implements MigrationInterface {

    herbicideSchema: HerbicideTankMixSchema;
    /**
     * Setup
     */
    setup() {
        // Adding Herbicide init schema to migrator
        this.herbicideSchema = new HerbicideTankMixSchema();
        this.addSchemaInitVersion(this.herbicideSchema);
    }

    /**
     * UP: Create DB method
     */
    public async up(queryRunner: QueryRunner): Promise<any> {
         // Start Log
         this.log('[START]', 'UP');
         // Running all up migration files
         await this.runQuerySqlFiles(this.upMigrations(), queryRunner);
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
