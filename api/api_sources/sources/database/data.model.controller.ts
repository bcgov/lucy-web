//
// Base Data Model Controller
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
// Created by Pushan Mitra on 2019-05-20.
/**
 * Imports
 */
import {
    Connection,
    getConnection,
    ObjectLiteral
} from 'typeorm';
import { SharedDBManager} from './dataBaseManager';
import {
    BaseDataController,
    BaseDataModelController
} from '../libs/core-database';
// import { ModelFactory } from './factory';


export type DataController = BaseDataController;

/**
 * @description Base DataModelController. This class provides -
 *  1. Creation of generic share instance of each subclass
 *  2. Interaction with database
 *  3. Generic in nature associated with model and schema
 * @export class DataModelController<T>
 */
export class DataModelController<T extends ObjectLiteral> extends BaseDataModelController<T> {
    /**
     * @description Getter of db connection
     * @getter connection Connection
     */
    get connection(): Connection {
        return SharedDBManager.connection || getConnection();
    }

    /*factory(): Promise<T> {
        return ModelFactory(this, this.dependencies)();
    }*/
}
// --------------------------------------------------------------------------------------------
