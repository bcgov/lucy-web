import {MigrationInterface, QueryRunner} from 'typeorm';
import { AppDBMigrator } from '../applicationSchemaInterface';
import { WindDirectionCodesSchema } from '../database-schema';

export class WindDirectionCodes1574281032452 extends AppDBMigrator implements MigrationInterface {

    windDirectionCodesSchema: WindDirectionCodesSchema;

    /**
     * Setup
     */
    setup() {
        // Adding wind direction init schema to migrator
        this.windDirectionCodesSchema = new WindDirectionCodesSchema();
        this.addSchemaInitVersion(this.windDirectionCodesSchema);
        this.addDataImportMigration(this.windDirectionCodesSchema, 'init');
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
       await queryRunner.query(`DROP TABLE IF EXISTS wind_direction_codes`);
       await queryRunner.query(this.windDirectionCodesSchema.dropTable());
       this.log('[END]', 'DOWN');
   }

}
