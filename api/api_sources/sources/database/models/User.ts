/**
 * User Model
 */

 // Lib Import
//import * as bcryptjs from  'bcryptjs';
import {Column, Entity, PrimaryGeneratedColumn, Unique, OneToMany, ManyToOne, JoinColumn} from "typeorm";

// Local Import
import { BaseModel, LoadData } from './BaseModel';
import { UserSession } from './UserSession';
import { LoginAccessCode } from './LoginAccessCode';
import { DataModelController } from '../DataModelController'



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
    name: 'users'
})
@Unique(['email'])
export class User extends BaseModel implements LoadData<UserData>{
    
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    email: string;

    @Column({ 
        name: 'first_name',
        nullable: true 
    })
    firstName: string;

    @Column({ 
        name: 'last_name',
        nullable: true 
    })
    lastName: string;

    

    @ManyToOne(type => LoginAccessCode, { eager: true} )
    @JoinColumn({
        name: 'login_access_code',
        referencedColumnName: 'id'
    })
    accessCode: LoginAccessCode;


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
