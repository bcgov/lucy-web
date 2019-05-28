import {Entity, Column, PrimaryGeneratedColumn, ManyToOne, Unique, JoinColumn} from "typeorm";
import { BaseModel } from "./BaseModel";
import { User } from './User';
import { DataModelController } from '../DataModelController'

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
    @JoinColumn({
        name: 'user_id',
        referencedColumnName: 'id'
    })
    user: User;

    public static get controller(): DataModelController<UserSession> {
        return new DataModelController<UserSession>(this);
    }

}
