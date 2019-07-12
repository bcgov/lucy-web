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
import { CreateDateColumn, UpdateDateColumn} from 'typeorm';
import { BaseTableSchema } from '../applicationSchemaInterface';
// import {  ModelProperty, PropertyType } from '../../libs/core-model';

/**
 * @description BaseModel class for all application data models. This class provides column definition of timestamps columns
 * @export class BaseModel
 */
export abstract class BaseModel  {
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
}

/**
 * @description Generic interface to manage Seed data load of model classes
 * @export interface LoadData
 */
export interface LoadData<T> {
    loadMap(input: T): void;
}
// ----------------------------------------------------------------------------------------------------------------

