// Model File
import {Column, Entity, PrimaryGeneratedColumn} from "typeorm";

// Local Import
import { BaseModel } from './baseModel';
import { DataModelController } from '../data.model.controller';
import { RolesCodeTableSchema} from '../database-schema';

/**
 * LoginAccessCodeValues
 * Value for different Access codes
 */
export enum RolesCodeValue {
    admin = 'ADM',
    viewer  = 'DAV',
    editor = 'DAE',
    superUser = 'SUP'
}

@Entity({
    name: RolesCodeTableSchema.schema.name
})
export class RolesCode extends BaseModel {
    @PrimaryGeneratedColumn()
    role_code_id: number;

    @Column({
        name: RolesCodeTableSchema.schema.columns.code
    })
    code: string;

    @Column({
        name: RolesCodeTableSchema.schema.columns.role
    })
    role: string;

    @Column({
        name: RolesCodeTableSchema.schema.columns.description
    })
    description: string;

    get roleCode(): RolesCodeValue {
        return this.code as RolesCodeValue;
    }
}

export class RoleCodeController extends DataModelController<RolesCode> {

    private static instance: RoleCodeController

    public static get shared(): RoleCodeController {
        return this.instance || (this.instance = new this());
    }

    constructor() {
        super(RolesCode, RolesCodeTableSchema);
    }

    async getCode(code: RolesCodeValue): Promise<RolesCode> {
        return this.fetchOne({code: code})
    }
}

