import {MigrationInterface, QueryRunner} from 'typeorm';
import { AppDBMigrator } from '../applicationSchemaInterface';
import { ChemicalTreatmentSchema, ChemicalTreatmentMethodCodeSchema, WindDirectionCodesSchema } from '../database-schema';

export class UpdateChemicalTreatmentSchema1574293296781 extends AppDBMigrator implements MigrationInterface {

    /**
     * Schemas
     */
    chemicalTreatmentMethodCodeSchema: ChemicalTreatmentMethodCodeSchema = new ChemicalTreatmentMethodCodeSchema();
    windDirectionCodesSchema: WindDirectionCodesSchema = new WindDirectionCodesSchema();
    chemicalTreatmentSchema: ChemicalTreatmentSchema = new ChemicalTreatmentSchema();

    public async up(queryRunner: QueryRunner): Promise<any> {

    }

    public async down(queryRunner: QueryRunner): Promise<any> {
    }

}
