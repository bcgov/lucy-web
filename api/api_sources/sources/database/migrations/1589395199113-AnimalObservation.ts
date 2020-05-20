import {MigrationInterface, QueryRunner} from 'typeorm';
import { AppDBMigrator } from '../applicationSchemaInterface';
import { AnimalSpeciesSchema, LifeStageCodeSchema, BehaviourCodeSchema, AnimalObservationSchema } from '../database-schema';

export class AnimalObservationCode1589395199113 extends AppDBMigrator implements MigrationInterface {
    animalSpeciesSchema: AnimalSpeciesSchema;
    lifeStageCodeSchema: LifeStageCodeSchema;
    behaviourCodeSchema: BehaviourCodeSchema;
    animalObservationSchema: AnimalObservationSchema;

    /**
     * Setup
     */
    setup() {
        this.animalSpeciesSchema = new AnimalSpeciesSchema();
        this.lifeStageCodeSchema = new LifeStageCodeSchema();
        this.behaviourCodeSchema = new BehaviourCodeSchema();
        this.animalObservationSchema = new AnimalObservationSchema();

        this.addSchemaInitVersion(this.animalSpeciesSchema);
        this.addSchemaInitVersion(this.lifeStageCodeSchema);
        this.addSchemaInitVersion(this.behaviourCodeSchema);
        this.addSchemaInitVersion(this.animalObservationSchema);

        this.addDataImportMigration(this.animalSpeciesSchema, 'init');
        this.addDataImportMigration(this.lifeStageCodeSchema, 'init');
        this.addDataImportMigration(this.behaviourCodeSchema, 'init');
    }

    public async up(queryRunner: QueryRunner): Promise<any> {
        this.log('[START]', 'UP');
        await this.runQuerySqlFiles(this.upMigrations(), queryRunner);
        await this.runQuerySqlFiles(this.importMigrations(), queryRunner);
        this.log('[END]', 'UP');
    }

    public async down(queryRunner: QueryRunner): Promise<any> {
        this.log('[START]', 'UP');
        await queryRunner.query(this.animalObservationSchema.dropTable());
        await queryRunner.query(this.animalSpeciesSchema.dropTable());
        await queryRunner.query(this.lifeStageCodeSchema.dropTable());
        await queryRunner.query(this.behaviourCodeSchema.dropTable());
        this.log('[END]', 'UP');
    }

}
