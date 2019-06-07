import {MigrationInterface, QueryRunner} from "typeorm";
import { UserSessionSchema, UserSchema} from '../database-schema'

export class UserSessionCreate1557796183879 extends UserSessionSchema implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<any> {

        // Schema
        await queryRunner.query(`CREATE TABLE ${this.table.name} (
            ${this.table.columns.id} SERIAL PRIMARY KEY,
            ${this.table.columns.lastLoginAt} TIMESTAMP NULL,
            ${this.table.columns.token} VARCHAR (5000) NULL,
            ${this.table.columns.tokenExpiry} TIMESTAMP NULL,
            ${this.table.columns.tokenLifetime} INT NULL,
            ${this.table.columns.lastActiveAt} TIMESTAMP NULL,
            ${this.table.columns.refUserId} INT NULL
        );`);

        // Creating timestamp column
        await queryRunner.query(this.createTimestampsColumn());

        // Creating comments
        await queryRunner.query(this.createComments());

        // Foreign Key
        await queryRunner.query(`ALTER TABLE ${this.table.name}
        ADD CONSTRAINT FK_2019051d15h34m FOREIGN KEY (${this.table.columns.refUserId})
        REFERENCES ${UserSchema.schema.name}(${UserSchema.schema.columns.id})
        ON DELETE CASCADE;`);

        // Alter user table to add foreign key ref to user table
        await queryRunner.query(`ALTER TABLE ${UserSchema.schema.name}
        ADD CONSTRAINT FK_20190606d9h38m FOREIGN KEY (${UserSchema.schema.columns.refCurrentSession})
        REFERENCES ${this.table.name}(${this.table.columns.id})
        ON DELETE SET NULL;`);
        
    }

    public async down(queryRunner: QueryRunner): Promise<any> {
        await queryRunner.query(`ALTER TABLE ${UserSchema.schema.name} DROP CONSTRAINT FK_20190606d9h38m`);
        await queryRunner.query(this.dropTable());
    }

}
