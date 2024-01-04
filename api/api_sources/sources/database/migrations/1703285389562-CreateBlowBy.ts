import {MigrationInterface, QueryRunner} from 'typeorm';
import { AppDBMigrator } from '../applicationSchemaInterface';
import { BlowBySchema, ObserverWorkflowSchema } from '../database-schema';

export class CreateBlowBy1703888022971 extends AppDBMigrator implements MigrationInterface {
   blowBySchema: BlowBySchema;
   observerWorkflowSchema: ObserverWorkflowSchema;

   /**
    * Setup
    */
   setup() {
       // Adding BlowBy schema to migrator
       this.blowBySchema = new BlowBySchema();
       this.observerWorkflowSchema = new ObserverWorkflowSchema();

       // Create BlowBy table
       this.addSchemaInitVersion(this.blowBySchema);
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
       this.log('[START]', 'DOWN');
       await queryRunner.query(this.blowBySchema.dropTable());
       await queryRunner.query(this.observerWorkflowSchema.dropTable());
       this.log('[END]', 'DOWN');
   }

}
