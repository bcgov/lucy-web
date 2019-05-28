import {MigrationInterface, QueryRunner} from "typeorm";
import { DatabaseMigrationHelper } from '../migration.helpers';

export class ApplicationEvent1559071014193 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<any> {
        // Creating table
        await queryRunner.query(`CREATE TABLE application_events (
            id SERIAL PRIMARY KEY,
            type INT NOT NULL,
            source VARCHAR(200) NULL,
            session_id INT NULL,
            note VARCHAR(500)
        );`);

        // Creating timestamp column
        await queryRunner.query(DatabaseMigrationHelper.shared.createTimestampsColumns('application_events'));

        // Foreign key -> session
        await queryRunner.query(`ALTER TABLE application_events
        ADD CONSTRAINT FK_2019052812h49m FOREIGN KEY (session_id)
        REFERENCES user_sessions(id)
        ON DELETE CASCADE;`);

    }

    public async down(queryRunner: QueryRunner): Promise<any> {
        await queryRunner.query(`DROP TABLE IF EXISTS application_events;`);
    }

}
