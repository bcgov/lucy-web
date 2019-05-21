import {MigrationInterface, QueryRunner} from "typeorm";
import { DatabaseMigrationHelper} from '../migration.helpers';
import { DefaultLoginAccessCodes } from '../initial-data';

export class LoginAccessCodeCreate1557785001021 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<any> {
        // Creating table
        await queryRunner.query(`CREATE TABLE login_access_codes (
            id SERIAL PRIMARY KEY,
            code VARCHAR (100) NOT NULL,
            role VARCHAR(100) NOT NULL,
            description VARCHAR(500) NULL
        );`);

        // Creating timestamp column
        await queryRunner.query(DatabaseMigrationHelper.shared.createTimestampsColumns('login_access_codes'));

        // Put default values
        for (const code of DefaultLoginAccessCodes) {
            await queryRunner.query(DatabaseMigrationHelper.shared.insertJSONInDB('login_access_codes',code));
        }
        
    }

    public async down(queryRunner: QueryRunner): Promise<any> {
        await queryRunner.query(`DROP TABLE IF EXISTS login_access_codes;`);
    }

}
