import {MigrationInterface, QueryRunner} from "typeorm";
import { DatabaseMigrationHelper} from '../migration.helpers';
import { InitialAdmins } from '../initial-data'
import { UserSchema, RolesCodeTableSchema } from '../database-schema'

export class UserCreate1557785001092 extends UserSchema implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<any> {

        // Creating table
        await queryRunner.query(`CREATE TABLE ${this.table.name} (
            ${this.table.columns.id} SERIAL PRIMARY KEY,
            ${this.table.columns.firstName} VARCHAR (100) NULL,
            ${this.table.columns.lastName} VARCHAR (100) NULL,
            ${this.table.columns.email} VARCHAR (100) NOT NULL UNIQUE,
            ${this.table.columns.preferredUsername} VARCHAR (100) NULL,
            ${this.table.columns.loginType} SMALLINT NULL,
            ${this.table.columns.accountStatus} SMALLINT DEFAULT 0,
            ${this.table.columns.expiryDate} DATE NULL,
            ${this.table.columns.activation} SMALLINT NULL,
            ${this.table.columns.refCurrentSession} INT NULL
        );`);

        // Creating timestamp column
        await queryRunner.query(this.createTimestampsColumn());

        // Creating comments
        await queryRunner.query(this.createComments());

        // Create Join table for user and assigned role
        await queryRunner.query(`CREATE TABLE user_role (
            ref_user_id INT  REFERENCES ${this.table.name}(${this.table.columns.id}) ON DELETE CASCADE,
            ref_access_role_id INT REFERENCES ${RolesCodeTableSchema.schema.name}(${RolesCodeTableSchema.schema.columns.id}) ON DELETE CASCADE,
            PRIMARY KEY (ref_user_id, ref_access_role_id)
        );`);


        // Create Initial Admins
        for (const admin of InitialAdmins) {
            await queryRunner.query(DatabaseMigrationHelper.shared.insertJSONInDB(this.table.name, admin));
            if (admin.additionalInitDataInfo) {
                const roles = admin.additionalInitDataInfo.roles;
                // Get user id
                const result = await queryRunner.query(`SELECT user_id from ${this.table.name} WHERE ${this.table.columns.email} = '${admin.email}'`);
                if (result[0].user_id) {
                    for (const role of roles) {
                        // Create role
                        await queryRunner.query(`INSERT INTO user_role VALUES (${result[0].user_id}, ${role})`);
                        console.log(`Role is created for user [${result[0].user_id}, ${admin.email}] role: ${role}`);
                    }
                }
            }
        }
    }

    public async down(queryRunner: QueryRunner): Promise<any> {
        // await queryRunner.query(``);
        await queryRunner.query('DROP TABLE IF EXISTS user_role')
        await queryRunner.query(this.dropTable());
        
    }

}
