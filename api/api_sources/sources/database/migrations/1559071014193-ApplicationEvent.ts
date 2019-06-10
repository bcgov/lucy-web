import {MigrationInterface, QueryRunner} from "typeorm";
import { ApplicationEventSchema, UserSessionSchema} from '../database-schema'

export class ApplicationEvent1559071014193 extends ApplicationEventSchema implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<any> {
        // Creating table
        await queryRunner.query(`CREATE TABLE ${this.table.name} (
            ${this.table.columns.id} SERIAL PRIMARY KEY,
            ${this.table.columns.type} INT NOT NULL,
            ${this.table.columns.source} VARCHAR(200) NULL,
            ${this.table.columns.refSessionId} INT NULL,
            ${this.table.columns.note} VARCHAR(500)
        );`);

        // Creating timestamp column
        await queryRunner.query(this.createTimestampsColumn());

        // Creating comments
        await queryRunner.query(this.createComments());

        // Foreign key -> session
        await queryRunner.query(`ALTER TABLE ${this.table.name}
        ADD CONSTRAINT FK_2019052812h49m FOREIGN KEY (${this.table.columns.refSessionId})
        REFERENCES ${UserSessionSchema.schema.name}(${UserSessionSchema.schema.columns.id})
        ON DELETE SET NULL;`);

    }

    public async down(queryRunner: QueryRunner): Promise<any> {
        await queryRunner.query(this.dropTable());
    }

}
