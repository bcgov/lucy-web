import {MigrationInterface, QueryRunner} from "typeorm";
import { RequestAccessTableSchema, RolesCodeTableSchema, UserSchema} from '../database-schema'

export class RequestAccessCreate1559696717385 extends RequestAccessTableSchema implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<any> {
        await queryRunner.query(`CREATE TABLE ${this.table.name} (
            ${this.table.columns.id} SERIAL PRIMARY KEY,
            ${this.table.columns.requestNote} VARCHAR(500) NULL,
            ${this.table.columns.refRequestType} INT NOT NULL,
            ${this.table.columns.refRequester} INT NOT NULL,
            ${this.table.columns.refApprover} INT NULL,
            ${this.table.columns.status} INT NULL,
            ${this.table.columns.approverNote} VARCHAR(500) NULL
        );`);

        // Create timestamp
        await queryRunner.query(this.createTimestampsColumn());

        // Create comments
        await queryRunner.query(this.createComments());

        // Add Foreign Keys
        // 1. Request type
        await queryRunner.query(`ALTER TABLE ${this.table.name}
        ADD CONSTRAINT FK_201906056h25m FOREIGN KEY (${this.table.columns.refRequestType})
        REFERENCES ${RolesCodeTableSchema.schema.name}(${RolesCodeTableSchema.schema.columns.id})
        ON DELETE CASCADE;`);
        // 2. Requester
        await queryRunner.query(`ALTER TABLE ${this.table.name}
        ADD CONSTRAINT FK_201906056h28m FOREIGN KEY (${this.table.columns.refRequester})
        REFERENCES ${UserSchema.schema.name}(${UserSchema.schema.columns.id})
        ON DELETE CASCADE;`);
        // 3. Approver 
        await queryRunner.query(`ALTER TABLE ${this.table.name}
        ADD CONSTRAINT FK_201906056h30m FOREIGN KEY (${this.table.columns.refApprover})
        REFERENCES ${UserSchema.schema.name}(${UserSchema.schema.columns.id})
        ON DELETE SET NULL;`);

    }

    public async down(queryRunner: QueryRunner): Promise<any> {
        await queryRunner.query(this.dropTable());
    }

}
