import {MigrationInterface, QueryRunner} from "typeorm";
import { DatabaseMigrationHelper } from '../migration.helpers';
import { DefaultSessionActivityCodes} from '../initial-data';
import { SessionActivitySchema, SessionActivityCodeSchema, UserSessionSchema} from '../database-schema'

export class UserSessionActivity1559071433925 extends SessionActivitySchema implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<any> {
        // Creating table session_activity_codes
        await queryRunner.query(`CREATE TABLE ${SessionActivityCodeSchema.schema.name} (
            ${SessionActivityCodeSchema.schema.columns.id} SERIAL PRIMARY KEY,
            ${SessionActivityCodeSchema.schema.columns.code} VARCHAR (100) NULL UNIQUE,
            ${SessionActivityCodeSchema.schema.columns.description} VARCHAR (500) NULL
        );`);
        // Creating timestamp column
        await queryRunner.query(`${SessionActivityCodeSchema.shared.createTimestampsColumn()}`);

        // Creating comments
        await queryRunner.query(`${SessionActivityCodeSchema.shared.createComments()}`);

        // Put default values
        for (const code of DefaultSessionActivityCodes) {
            await queryRunner.query(DatabaseMigrationHelper.shared.insertJSONInDB('session_activity_code',code));
        }

        // Create table Session activity
        // Schema
        await queryRunner.query(`CREATE TABLE ${this.table.name} (
            ${this.table.columnsDefinition.id.name} SERIAL PRIMARY KEY,
            ${this.table.columnsDefinition.refSessionId.name} INT NOT NULL,
            ${this.table.columnsDefinition.refActivityCode.name} INT NOT NULL,
            ${this.table.columnsDefinition.info.name} VARCHAR(500) NULL
        );`);

         // Creating timestamp column
         await queryRunner.query(`${this.createTimestampsColumn()}`);

         // Create comments
         await queryRunner.query(`${this.createComments()}`);

        // Foreign Key -> session
        await queryRunner.query(`ALTER TABLE ${this.table.name}
        ADD CONSTRAINT FK_2019052812h36m FOREIGN KEY (${this.table.columns.refSessionId})
        REFERENCES ${UserSessionSchema.schema.name}(${UserSessionSchema.schema.columns.id})
        ON DELETE CASCADE;`);

        // Foreign Key -> activity codes
        await queryRunner.query(`ALTER TABLE ${this.table.name}
        ADD CONSTRAINT FK_2019052812h38m FOREIGN KEY (${this.table.columnsDefinition.refActivityCode.name})
        REFERENCES ${SessionActivityCodeSchema.schema.name}(${SessionActivityCodeSchema.schema.columnsDefinition.id.name})
        ON DELETE CASCADE;`);
    }

    public async down(queryRunner: QueryRunner): Promise<any> {
        await queryRunner.query(this.dropTable());
        await queryRunner.query(SessionActivityCodeSchema.shared.dropTable());
    }

}
