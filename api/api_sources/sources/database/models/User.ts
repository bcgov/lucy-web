/**
 * User Model
 */

 // Lib Import
//import * as bcryptjs from  'bcryptjs';
import {Column, Entity, OneToMany,  JoinTable, PrimaryGeneratedColumn, ManyToMany} from "typeorm";

// Local Import
import { BaseModel, LoadData } from './BaseModel';
import { UserSession } from './UserSession';
import { LoginAccessCode } from './LoginAccessCode';
import { DataModelController } from '../DataModelController';
import { UserSchema, LoginAccessTableSchema} from '../database-schema'



export enum UserRole {
    Admin = 'admin',
    SuperAdmin = 'superUser'
}

export interface UserData {
    firstName: string,
    lastName: string,
    email: string,
    accessCode: number,
}

@Entity({
    name: UserSchema.schema.name
})
export class User extends BaseModel implements LoadData<UserData>{
    
    @PrimaryGeneratedColumn()
    user_id: number;

    @Column()
    email: string;

    @Column({ 
        name: UserSchema.schema.columns.firstName,
        nullable: true 
    })
    firstName: string;

    @Column({ 
        name: UserSchema.schema.columns.lastName,
        nullable: true 
    })
    lastName: string;

    

    @ManyToMany(type => LoginAccessCode, { eager: true} )
    @JoinTable({
        name: 'user_role',
        joinColumn: {
            name: 'ref_user_id',
            referencedColumnName: UserSchema.schema.columns.id
        },
        inverseJoinColumn: {
            name: 'ref_access_role_id',
            referencedColumnName: LoginAccessTableSchema.schema.columns.id
        }
    })
    accessCodes: LoginAccessCode[];


    @OneToMany(type => UserSession, session => session.user)
    sessions: Promise<UserSession[]>


    loadMap(input: UserData) {
        this.firstName = input.firstName;
        this.lastName = input.lastName;
        this.email = input.email;
        //
    }

    public static get controller(): DataModelController<User> {
        return new DataModelController<User>(this);
    }

}

export class UserDataController extends DataModelController<User> {
    public static get shared(): UserDataController {
        return this.sharedInstance<User>(User, UserSchema) as UserDataController;
    }
}
