// UserSessionActivity.ts

import {Entity, Column, ManyToOne, Unique, JoinColumn, PrimaryGeneratedColumn} from 'typeorm';
import { SessionActivityCodeSchema, SessionActivitySchema, UserSessionSchema} from '../database-schema';
import { BaseModel } from './baseModel';
import { DataModelController } from '../data.model.controller';
import { UserSession } from './user.session';

export enum SessionActivityCodeValues {
    dataEdit = 'DE',
    dataAdd = 'DA',
    dataDelete = 'DD',
    report = 'RP',
    other = 'OTHER'
}

@Entity({
    name: SessionActivityCodeSchema.schema.name
})
@Unique([SessionActivityCodeSchema.schema.columns.code])
export class SessionActivityCode extends BaseModel {
    @PrimaryGeneratedColumn()
    session_activity_id: number;

    @Column()
    code: string;

    @Column()
    description: string;
}

export class SessionActivityCodeController extends DataModelController<SessionActivityCode> {
    public static get shared():  SessionActivityCodeController {
        return this.sharedInstance<SessionActivityCode>(SessionActivityCode, SessionActivityCodeSchema) as SessionActivityCodeController;
    }
    async code(code: SessionActivityCodeValues): Promise<SessionActivityCode> {
        const query: {[key: string]: string} = {};
        query[`${SessionActivityCodeSchema.schema.columns.code}`] = code;
        const codeValue = await this.fetchOne(query) || new this.entity();
        codeValue.code = code;
        return codeValue;
    }
}



@Entity({
    name: SessionActivitySchema.schema.name
})
export class SessionActivity extends BaseModel {
    @PrimaryGeneratedColumn()
    activity_id: number;

    @Column()
    info: string

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
    code: SessionActivityCode
}

export class SessionActivityController extends DataModelController<SessionActivity> {
    public static get shared(): SessionActivityController {
        return this.sharedInstance<SessionActivity>(SessionActivity, SessionActivitySchema);
    }
}