//
// UserSession DataModel
//
// Copyright © 2019 Province of British Columbia
//
// Licensed under the Apache License, Version 2.0 (the "License");
// you may not use this file except in compliance with the License.
// You may obtain a copy of the License at
//
// http://www.apache.org/licenses/LICENSE-2.0
//
// Unless required by applicable law or agreed to in writing, software
// distributed under the License is distributed on an "AS IS" BASIS,
// WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
// See the License for the specific language governing permissions and
// limitations under the License.
//
// Created by Pushan Mitra on 2019-05-10.
/**
 * Imports
 */
import {Entity, Column, ManyToOne, Unique, JoinColumn, PrimaryGeneratedColumn, OneToMany} from 'typeorm';
import { BaseModel } from './baseModel';
import { User } from './user';
import { SessionActivity } from './session.activity';
import { DataModelController } from '../data.model.controller';
import { UserSchema, UserSessionSchema} from '../database-schema';

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
        name: UserSessionSchema.columns.token,
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
        name: UserSessionSchema.columns.user,
        referencedColumnName: UserSchema.id
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
    /**
     * @description Getter for shared instance
     */
    public static get shared(): UserSessionDataController {
        return this.sharedInstance<UserSession>(UserSession, UserSessionSchema) as UserSessionDataController;
    }
}

// ----------------------------------------------------------
