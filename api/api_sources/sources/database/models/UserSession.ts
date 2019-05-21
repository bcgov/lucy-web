import {Entity, Column, PrimaryGeneratedColumn, ManyToOne, Unique} from "typeorm";
import { BaseModel } from "./BaseModel";
import { User } from './User';

@Entity({
    name: 'user_sessions'
})
@Unique(['token'])
export class UserSession extends BaseModel {

    @PrimaryGeneratedColumn()
    id: number

    @Column({ 
        name: 'last_login_at',
        nullable: true 
    })
    lastLoginAt: Date;


    @Column({ 
        nullable: true 
    })
    token: string;

    @Column({ 
        name: 'token_expiry',
        nullable: true 
    })
    tokenExpiry: Date;

    @Column({ 
        name: 'token_lifetime',
        nullable: true 
    })
    tokenExpiryTime: number;

    @Column({ 
        name: 'last_active_at',
        nullable: true 
    })
    lastActiveAt: Date;

    /**
     * Relationship
     */
    @ManyToOne(type => User, user => user.sessions, { eager: true})
    user: User;

}
