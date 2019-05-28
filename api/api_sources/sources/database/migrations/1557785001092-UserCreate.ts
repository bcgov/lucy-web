import {MigrationInterface, QueryRunner} from "typeorm";
import { DatabaseMigrationHelper} from '../migration.helpers';
import { InitialAdmins } from '../initial-data'

export class UserCreate1557785001092 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<any> {

        // Creating table
        await queryRunner.query(`CREATE TABLE users (
            id SERIAL PRIMARY KEY,
            first_name VARCHAR (100) NULL,
            last_name VARCHAR (100) NULL,
            email VARCHAR (100) UNIQUE NOT NULL,
            preferred_username VARCHAR (100) NULL,
            login_type SMALLINT NULL,
            login_access_code INT NULL,
            expiry_date DATE NULL
        );`);

        // Creating timestamp column
        await queryRunner.query(DatabaseMigrationHelper.shared.createTimestampsColumns('users'));

        // Add Foreign Key ref
        await queryRunner.query(`ALTER TABLE users
        ADD CONSTRAINT FK_20190517d9h43m FOREIGN KEY (login_access_code)
        REFERENCES login_access_codes(id)
        ON DELETE SET NULL;`);

        // Create Initial Admins
        for (const admin of InitialAdmins) {
            await queryRunner.query(DatabaseMigrationHelper.shared.insertJSONInDB('users', admin));
        }
    }

    public async down(queryRunner: QueryRunner): Promise<any> {
        // await queryRunner.query(``);
        await queryRunner.query(`DROP TABLE IF EXISTS users;`);
    }

}
