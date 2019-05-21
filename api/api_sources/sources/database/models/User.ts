/**
 * User Model
 */

 // Lib Import
//import * as bcryptjs from  'bcryptjs';
import {Column, Entity, PrimaryGeneratedColumn, Unique, OneToMany} from "typeorm";

// Local Import
import { BaseModel } from './BaseModel';
import { UserSession } from './UserSession';
import { LoadData} from './BaseModel';



export enum UserRole {
    Admin = 'admin',
    SuperAdmin = 'superUser'
}

export interface UserData {
    firstName: string,
    lastName: string,
    email: string,
    type: string,
    password?: string
}

@Entity({
    name: 'users'
})
@Unique(['email'])
export class User extends BaseModel implements LoadData<UserData>{
    
    @PrimaryGeneratedColumn()
    id: number

    @Column()
    email: string

    @Column({ 
        name: 'first_name',
        nullable: true 
    })
    firstName: string

    @Column({ 
        name: 'last_name',
        nullable: true 
    })
    lastName: string

    

    @OneToMany(type => UserSession, session => session.user)
    sessions: Promise<UserSession[]>


    loadMap(input: UserData) {
        this.firstName = input.firstName;
        this.lastName = input.lastName;
        this.email = input.email;
        //
    }
}
