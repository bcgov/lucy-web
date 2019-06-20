import {MigrationInterface, QueryRunner} from 'typeorm';
import { UserMessagesSchema, UserSchema } from '../database-schema';

export class UserMessageCreate1560098448360 extends UserMessagesSchema implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<any> {
        await queryRunner.query(`CREATE TABLE ${this.table.name} (
            ${this.table.columns.id} SERIAL PRIMARY KEY,
            ${this.table.columns.title} VARCHAR(200) NULL,
            ${this.table.columns.body} VARCHAR(500) NULL,
            ${this.table.columns.type} SMALLINT NOT NULL DEFAULT 0,
            ${this.table.columns.status} SMALLINT NOT NULL DEFAULT 0,
            ${this.table.columns.refReceiverId} INT NULL REFERENCES ${UserSchema.schema.name}(${UserSchema.schema.columns.id}) ON DELETE CASCADE,
            ${this.table.columns.refCreatorId} INT NULL REFERENCES ${UserSchema.schema.name}(${UserSchema.schema.columns.id}) ON DELETE SET NULL
        );`);
    }

    public async down(queryRunner: QueryRunner): Promise<any> {
        await queryRunner.query(this.dropTable());
    }

}
