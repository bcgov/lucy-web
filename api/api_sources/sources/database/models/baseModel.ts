//
// Base Data Model
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
// Created by Pushan Mitra on 2019-05-7.
/**
 * Imports
 */
import { CreateDateColumn, UpdateDateColumn, AfterLoad, AfterInsert, AfterUpdate} from 'typeorm';
import { BaseTableSchema } from '../applicationSchemaInterface';
import { ClassInfo } from '../../libs/core-model';
import { BaseSchema } from '../../libs/core-database';
import { valueAtKeyPath } from '../../libs/utilities';
// import {  ModelProperty, PropertyType } from '../../libs/core-model';

/**
 * @description BaseModel class for all application data models. This class provides column definition of timestamps columns
 * @export class BaseModel
 */
export abstract class BaseModel  {
    /**
     * Time Columns
     */
    @CreateDateColumn({
        name: BaseTableSchema.timestampColumns.createdAt,
        nullable: true,
        comment: 'Create Timestamp'
    })
    createdAt: Date;
    @UpdateDateColumn({
        name: BaseTableSchema.timestampColumns.updatedAt,
        comment: 'Update Timestamp',
        nullable: true
    })
    updatedAt: Date;

    /**
     * Common props
     */
    /**
     * @description Display label of the object
     */
    displayLabel = '';

    /**
     * @description ClassName
     */
    get className(): string {
        return this.constructor.name;
    }

    /**
     * Private Methods
     */
    /**
     * @description Update Display label
     */
    private _updateLabel(tag?: string) {

        // Checking display label of schema
        if (this.getClassInfo().schema) {
            const schema: BaseSchema = this.getClassInfo().schema.shareInstance;
            if (schema.table.displayLabelInfo) {
                let format: string = schema.table.displayLabelInfo.format;
                const keys: any[] = schema.table.displayLabelInfo.keys || [];
                for (const k of keys) {
                    const item = valueAtKeyPath(this, `${k}`) || '';
                    format = format.replace(`#(${k})`, item);
                }
                this.displayLabel = format;
                return;
            }
            // No Description setting id
            this.displayLabel = this[schema.table.id] ? `${this[schema.table.id]}` :  '-';
        }

        // Checking description of object
        if (this['description']) {
            this.displayLabel = this['description'];
        }
    }

    /**
     * Protected Method
     */
    /**
     * @description Place Holder Method. This method will be replaced by ModelDescription Decorator
     */
    protected getClassInfo(): ClassInfo {
        return {};
    }

    /**
     * DB Hooks
     */
    @AfterLoad()
    afterLoad() {
        this._updateLabel('al');
    }

    @AfterInsert()
    afterInsert() {
        this._updateLabel('ai');
    }

    @AfterUpdate()
    afterUpdate() {
        this._updateLabel('au');
    }
}

/**
 * @description Generic interface to manage Seed data load of model classes
 * @export interface LoadData
 */
export interface LoadData<T> {
    loadMap(input: T): void;
}
// ----------------------------------------------------------------------------------------------------------------

