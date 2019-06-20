import {Entity, Column, ManyToOne, Unique, JoinColumn, PrimaryGeneratedColumn, OneToMany} from 'typeorm';
import { BaseModel } from './baseModel';
import { User } from './user';
import { SessionActivity } from './userSessionActivity';
import { DataModelController } from '../data.model.controller';
import { UserSchema, UserSessionSchema} from '../database-schema'

/**
 * @description Model class to hold and handle user session data
 * @export class UserSession
 */
@Entity({
    name: UserSessionSchema.schema.name
})
@Unique([UserSessionSchema.schema.columns.token])
export class UserSession extends BaseModel {
    @PrimaryGeneratedColumn()
    session_id: number;

    @Column({
        name: UserSessionSchema.schema.columns.lastLoginAt,
        nullable: true
    })
    lastLoginAt: Date;


    @Column({
        nullable: true
    })
    token: string;

    @Column({
        name: UserSessionSchema.schema.columns.tokenExpiry,
        nullable: true
    })
    tokenExpiry: Date;

    @Column({
        name: UserSessionSchema.schema.columns.tokenLifetime,
        nullable: true
    })
    tokenLifeTime: number;

    @Column({
        name: UserSessionSchema.schema.columns.lastActiveAt,
        nullable: true
    })
    lastActiveAt: Date;

    /**
     * Relationship
     */
    // User
    @ManyToOne(type => User, user => user.sessions, { eager: true})
    @JoinColumn({
        name: UserSessionSchema.schema.columns.refUserId,
        referencedColumnName: UserSchema.schema.columns.id
    })
    user: User;

    // Activities
    @OneToMany(type => SessionActivity, activity => activity.session)
    activities: Promise<SessionActivity[]>;

}

/**
 * @description Data Model Controller for session data
 * @export class UserSessionDataController
 */
export class UserSessionDataController extends DataModelController<UserSession> {
    public static get shared(): UserSessionDataController {
        return this.sharedInstance<UserSession>(UserSession, UserSessionSchema);
    }
}

// ----------------------------------------------------------
