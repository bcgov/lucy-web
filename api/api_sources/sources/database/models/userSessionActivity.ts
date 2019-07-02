//
// SessionActivityCode DataModel
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
// Created by Pushan Mitra on 2019-05-21.
/**
 * Imports
 */
import {Entity, Column, ManyToOne, Unique, JoinColumn, PrimaryGeneratedColumn} from 'typeorm';
import { SessionActivityCodeSchema, SessionActivitySchema, UserSessionSchema} from '../database-schema';
import { BaseModel } from './baseModel';
import { DataModelController } from '../data.model.controller';
import { UserSession } from './user.session';

/**
 * @description Enum values to represent session activities code
 * @export enum SessionActivityCodeValues
 */
export enum SessionActivityCodeValues {
    dataEdit = 'DE',
    dataAdd = 'DA',
    dataDelete = 'DD',
    report = 'RP',
    other = 'OTHER'
}

/**
 * @description Entity model class for SessionActivityCode
 * @export class SessionActivityCode
 */
@Entity({
    name: SessionActivityCodeSchema.schema.name
})
@Unique([SessionActivityCodeSchema.schema.columns.code])
export class SessionActivityCode extends BaseModel {
    /**
     * Columns
     */
    @PrimaryGeneratedColumn()
    session_activity_id: number;

    @Column()
    code: string;

    @Column()
    description: string;
}

/**
 * @description Data Model Controller for SessionActivityCode
 * @export class SessionActivityCodeController
 */
export class SessionActivityCodeController extends DataModelController<SessionActivityCode> {
    /**
     * @description Getter for shared instance
     */
    public static get shared():  SessionActivityCodeController {
        return this.sharedInstance<SessionActivityCode>(SessionActivityCode, SessionActivityCodeSchema) as SessionActivityCodeController;
    }
    /**
     * @description Getter for SessionActivityCode model for given code value from server
     * @method code
     * @param SessionActivityCodeValues code
     * @returns Promise<SessionActivityCode>
     */
    async code(code: SessionActivityCodeValues): Promise<SessionActivityCode> {
        const query: {[key: string]: string} = {};
        query[`${SessionActivityCodeSchema.schema.columns.code}`] = code;
        const codeValue = await this.fetchOne(query) || new this.entity();
        codeValue.code = code;
        return codeValue;
    }
}

/**
 * @description Entity model class for SessionActivity
 * @export class SessionActivity
 */
@Entity({
    name: SessionActivitySchema.schema.name
})
export class SessionActivity extends BaseModel {
    @PrimaryGeneratedColumn()
    activity_id: number;

    @Column()
    info: string;

    // Relationship
    // Session
    @ManyToOne( type => UserSession, session => session.activities, { eager: true})
    @JoinColumn({
        name: SessionActivitySchema.schema.columns.refSessionId,
        referencedColumnName: UserSessionSchema.schema.columns.id
    })
    session: UserSession;

    // Activity code
    @ManyToOne( type => SessionActivityCode, { eager : true})
    @JoinColumn({
        name: SessionActivitySchema.schema.columns.refActivityCode,
        referencedColumnName: SessionActivityCodeSchema.schema.columns.id
    })
    code: SessionActivityCode;
}

/**
 * @description Data Model Controller for SessionActivityCode
 * @export class SessionActivityCodeController
 */
export class SessionActivityController extends DataModelController<SessionActivity> {
    /**
     * @description Getter for shared instance
     */
    public static get shared(): SessionActivityController {
        return this.sharedInstance<SessionActivity>(SessionActivity, SessionActivitySchema);
    }
}
// ----------------------------------------------------------------------------------------------------------------
