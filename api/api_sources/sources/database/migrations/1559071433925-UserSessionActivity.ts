import {MigrationInterface, QueryRunner} from "typeorm";
import { DatabaseMigrationHelper } from '../migration.helpers';
import { DefaultSessionActivityCodes} from '../initial-data'

export class UserSessionActivity1559071433925 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<any> {
        // Creating table session_activity_codes
        await queryRunner.query(`CREATE TABLE session_activity_codes (
            id SERIAL PRIMARY KEY,
            code VARCHAR (100) NULL,
            description VARCHAR (500) NULL
        );`);

        // Creating timestamp column
        await queryRunner.query(DatabaseMigrationHelper.shared.createTimestampsColumns('session_activity_codes'));

        // Put default values
        for (const code of DefaultSessionActivityCodes) {
            await queryRunner.query(DatabaseMigrationHelper.shared.insertJSONInDB('session_activity_codes',code));
        }


        // Create table Session activity
        // Schema
        await queryRunner.query(`CREATE TABLE user_session_activities (
            id SERIAL PRIMARY KEY,
            session_id INT NOT NULL,
            session_activity_code INT NOT NULL,
            info VARCHAR(500) NULL
        );`);

         // Creating timestamp column
         await queryRunner.query(DatabaseMigrationHelper.shared.createTimestampsColumns('user_session_activities'));

        // Foreign Key -> session
        await queryRunner.query(`ALTER TABLE user_session_activities
        ADD CONSTRAINT FK_2019052812h36m FOREIGN KEY (session_id)
        REFERENCES user_sessions(id)
        ON DELETE CASCADE;`);

        // Foreign Key -> activity codes
        await queryRunner.query(`ALTER TABLE user_session_activities
        ADD CONSTRAINT FK_2019052812h38m FOREIGN KEY (session_activity_code)
        REFERENCES session_activity_codes(id)
        ON DELETE CASCADE;`);
    }

    public async down(queryRunner: QueryRunner): Promise<any> {
        await queryRunner.query(`DROP TABLE IF EXISTS user_session_activities;`);
        await queryRunner.query(`DROP TABLE IF EXISTS session_activity_codes;`);
    }

}
