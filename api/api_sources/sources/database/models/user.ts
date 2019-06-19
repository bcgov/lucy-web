/**
 * User Model
 */

 // Lib Import
//import * as bcryptjs from  'bcryptjs';
import {Column, Entity, OneToMany,  JoinTable, PrimaryGeneratedColumn, ManyToMany} from "typeorm";

// Local Import
import { BaseModel, LoadData } from './baseModel';
import { UserSession, UserSessionDataController } from './user.session';
import { RolesCode } from './appRolesCode';
import { DataModelController } from '../data.model.controller';
import { UserSchema, RolesCodeTableSchema} from '../database-schema';
import { UserMessage } from "./userMessage";


export enum UserRole {
    Admin = 'admin',
    SuperAdmin = 'superUser'
}

export enum AccountStatus {
    active = 1,
    inactive = 0,
    suspended = 2
}

export interface UserData {
    firstName: string;
    lastName: string;
    email: string;
    accessCode: number;
}

@Entity({
    name: UserSchema.schema.name
})
export class User extends BaseModel implements LoadData<UserData> {
    // Props
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

    @Column({
        name: UserSchema.schema.columns.preferredUsername,
        nullable: true
    })
    preferredUsername: string;

    @Column({
        name: UserSchema.schema.columns.refCurrentSession,
        nullable: true,
    })
    currentSessionId?: number;

    @Column({
        name: UserSchema.schema.columns.accountStatus
    })
    accountStatus: number;


    @ManyToMany(type => RolesCode, { eager: true} )
    @JoinTable({
        name: 'user_role',
        joinColumn: {
            name: 'ref_user_id',
            referencedColumnName: UserSchema.schema.columns.id
        },
        inverseJoinColumn: {
            name: 'ref_access_role_id',
            referencedColumnName: RolesCodeTableSchema.schema.columns.id
        }
    })
    roles: RolesCode[];


    @OneToMany(type => UserSession, session => session.user)
    sessions: Promise<UserSession[]>;


    @OneToMany(type => UserMessage, message => message.receiver)
    messages: Promise<UserMessage[]>;

    loadMap(input: UserData) {
        this.firstName = input.firstName;
        this.lastName = input.lastName;
        this.email = input.email;
        //
    }
}

export class UserDataController extends DataModelController<User> {
    public static get shared(): UserDataController {
        return this.sharedInstance<User>(User, UserSchema) as UserDataController;
    }

    public async getCurrentSession(user: User): Promise<UserSession> {
        const session: UserSession = await UserSessionDataController.shared.findById((user.currentSessionId || -1));
        return session;
    }

    public async setCurrentSession(user: User, session: UserSession): Promise<void> {
        user.currentSessionId = session.session_id;
        await this.saveInDB(user);
    }

    public async removeSession(user: User): Promise<void> {
        user.currentSessionId = undefined;
        this.saveInDB(user);
    }
}
