/*
 * Copyright © 2019 Province of British Columbia
 * Licensed under the Apache License, Version 2.0 (the "License")
 * You may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 * **
 * http://www.apache.org/licenses/LICENSE-2.0
 * **
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 * File: generic.data.controllers.ts
 * Project: lucy
 * File Created: Thursday, 12th September 2019 10:00:30 am
 * Author: pushan (you@you.you)
 * -----
 * Last Modified: Thursday, 12th September 2019 10:00:35 am
 * Modified By: pushan (you@you.you>)
 * -----
 */
/**
 * Imports
 */
import {
    Column,
    ManyToOne,
    JoinColumn,
    ObjectLiteral
} from 'typeorm';
import { BaseModel } from './baseModel';
import { User } from './user';
import {  ModelProperty, PropertyType } from '../../libs/core-model';
import {
    RecordTableSchema,
    CodeTableSchema
} from '../database-schema/base.record.schema';
import { UserSchema } from '../database-schema';
import { DataModelController } from '../data.model.controller';

/**
 * @description Base class for record
 */
export abstract class Record extends BaseModel {
    @ManyToOne( type => User, {eager : false})
    @JoinColumn({
        name: RecordTableSchema.auditColumns.createdBy,
        referencedColumnName: UserSchema.schema.columns.id
    })
    createdBy: User;

    @ManyToOne( type => User, { eager: false})
    @JoinColumn({
        name: RecordTableSchema.auditColumns.updatedBy,
        referencedColumnName: UserSchema.schema.columns.id
    })
    updatedBy: User;
}

export abstract class ApplicationCode extends Record {
    @Column({ name: CodeTableSchema.codeColumns.description, nullable: true })
    @ModelProperty({type: PropertyType.string})
    description: string;

    @Column({ name: CodeTableSchema.codeColumns.activeIndicator, nullable: false})
    @ModelProperty({type: PropertyType.boolean})
    activeIndicator: boolean;
}

export class RecordController<T extends Record> extends DataModelController<T> {
    async createNewObject(spec: any, creator: User, ...other: any[]): Promise<T> {
        await this.checkRelationship(spec, creator, this.className);
        const newObj: T = this.newObject(spec);
        newObj.createdBy = creator;
        newObj.updatedBy = creator;
        try {
            await this.saveInDB(newObj);
            // const obj = await this.handleRelationship(spec, creator);
            return newObj;
        } catch (excp) {
            throw excp;
        }
    }

    async updateObject(existing: T, update: ObjectLiteral, modifier: User): Promise<T> {
        await this.checkRelationship(update, modifier, this.className);
        existing.updatedBy = modifier;
        await this.updateObj<ObjectLiteral>(existing, update);
        return existing;
    }
}

// ------------------------------------------------------------------------------------------

