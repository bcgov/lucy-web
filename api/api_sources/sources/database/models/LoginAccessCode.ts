import {Column, Entity, PrimaryGeneratedColumn} from "typeorm";

// Local Import
import { BaseModel } from './BaseModel';
import { DataModelController } from '../DataModelController'

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
    name: 'login_access_codes'
})
export class LoginAccessCode extends BaseModel {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({
        name: 'code'
    })
    code: string;

    @Column({
        name: 'role'
    })
    role: string;

    @Column({
        name: 'description'
    })
    description: string;

    public static get controller(): DataModelController<LoginAccessCode> {
        return new DataModelController<LoginAccessCode>(this);
    }
}