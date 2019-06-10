import {MigrationInterface, QueryRunner} from "typeorm";
import { DatabaseMigrationHelper} from '../migration.helpers';
import { DefaultLoginAccessCodes } from '../initial-data';
import { RolesCodeTableSchema} from '../database-schema'

export class LoginAccessCodeCreate1557785001021 extends RolesCodeTableSchema implements MigrationInterface {
    
    
    public async up(queryRunner: QueryRunner): Promise<any> {
        // Creating table
        // Schema 
        await queryRunner.query(`CREATE TABLE ${this.table.name} (
            ${this.table.columns.id} SERIAL PRIMARY KEY,
            ${this.table.columns.code} VARCHAR (100)  NOT NULL UNIQUE,
            ${this.table.columns.role} VARCHAR(100) NOT NULL,
            ${this.table.columns.description} VARCHAR(500) NULL
        );`);

        // Creating timestamp column
        await queryRunner.query(this.createTimestampsColumn());

        // Creating comments
        await queryRunner.query(this.createComments());
    
        // Put default values
        for (const code of DefaultLoginAccessCodes) {
            await queryRunner.query(DatabaseMigrationHelper.shared.insertJSONInDB(this.table.name,code));
        }
        
    }

    public async down(queryRunner: QueryRunner): Promise<any> {
        await queryRunner.query(this.dropTable());
    }

}
