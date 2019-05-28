import {MigrationInterface, QueryRunner} from "typeorm";
import { DatabaseMigrationHelper} from '../migration.helpers';

export class UserSessionCreate1557796183879 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<any> {

        // Schema
        await queryRunner.query(`CREATE TABLE user_sessions (
            id SERIAL PRIMARY KEY,
            last_login_at TIMESTAMP NULL,
            token VARCHAR (5000) NULL,
            token_expiry TIMESTAMP NULL,
            token_lifetime INT NULL,
            last_active_at TIMESTAMP NULL,
            user_id INT NULL,
            delete_at TIMESTAMP NULL
        );`);

        // Creating timestamp column
        await queryRunner.query(DatabaseMigrationHelper.shared.createTimestampsColumns('user_sessions'));

        // Foreign Key
        await queryRunner.query(`ALTER TABLE user_sessions
        ADD CONSTRAINT FK_2019051d15h34m FOREIGN KEY (user_id)
        REFERENCES users(id)
        ON DELETE CASCADE;`);
        
    }

    public async down(queryRunner: QueryRunner): Promise<any> {
        await queryRunner.query(`DROP TABLE IF EXISTS user_sessions;`);
    }

}
