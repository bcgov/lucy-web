import {Column, Entity, PrimaryGeneratedColumn} from "typeorm";

// Local Import
import { BaseModel } from './BaseModel';
import { DataModelController } from '../DataModelController';
import { LoginAccessTableSchema} from '../database-schema'

/**
 * LoginAccessCodeValues
 * Value for different Access codes
 */
export enum LoginAccessCodeValue {
    admin = 'ADM',
    viewer  = 'DAV',
    editor = 'DAE',
    superUser = 'SUP'
}

@Entity({
    name: LoginAccessTableSchema.schema.name
})
export class LoginAccessCode extends BaseModel {
    @PrimaryGeneratedColumn()
    login_access_code_id: number;

    @Column({
        name: LoginAccessTableSchema.schema.columns.code
    })
    code: string;

    @Column({
        name: LoginAccessTableSchema.schema.columns.role
    })
    role: string;

    @Column({
        name: LoginAccessTableSchema.schema.columns.description
    })
    description: string;
}

export class LoginAccessCodeController extends DataModelController<LoginAccessCode> {

    private static instance: LoginAccessCodeController

    public static get shared(): LoginAccessCodeController {
        return this.instance || (this.instance = new this());
    }

    constructor() {
        super(LoginAccessCode, LoginAccessTableSchema);
    }

    async getCode(code: LoginAccessCodeValue): Promise<LoginAccessCode> {
        return this.fetchOne({code: code})
    }
}

