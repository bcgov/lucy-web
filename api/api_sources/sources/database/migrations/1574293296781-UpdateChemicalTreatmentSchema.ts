import {MigrationInterface, QueryRunner} from 'typeorm';
import { AppDBMigrator } from '../applicationSchemaInterface';

export class UpdateChemicalTreatmentSchema1574293296781 extends AppDBMigrator implements MigrationInterface {

    /**
     * Schemas
     */
    setup() {}

    public async up(queryRunner: QueryRunner): Promise<any> {

    }

    public async down(queryRunner: QueryRunner): Promise<any> {
    }

}
