//
// Model Factory Class
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

// TODO: Check usage and delete

/**
 * Imports
 */
import { getConnection, Connection } from 'typeorm';
import { BaseModel } from '../../database/models/baseModel';

/**
 * @description Closure to get object
 */
type getData = (() => object);

/**
 * @description Factory class for data model
 */
export class DataModelFactory<T extends BaseModel> {
    private connection: Connection;
    private target: any;
    constructor(target: any) {
        const connection = getConnection();
        if (connection && connection.isConnected) {
            this.connection = connection;
        }
    }

    async generate(cb: getData): Promise<T> {
        const info = cb();
        const item = await this.target.findOneOrCreate(this.connection, info) as T;
        return item;
    }
}
// --------------------------------------------------------------------------------------------
