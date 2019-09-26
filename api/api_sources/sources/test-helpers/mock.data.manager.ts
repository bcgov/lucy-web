//
// Mock Data Support for test
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
// Created by Pushan Mitra on 2019-06-10.
/**
 * Imports
 */
import * as _ from 'underscore';
import {User, UserSession, SessionActivity} from '../database/models';
import { userFactory, sessionFactory, sessionActivityFactory} from '../database/factory';
import { appLogger, Logger } from '../server/logger';

// ----------------------------------------------------
/**
 * @description MaxItem create per model
 */
const MaxItem = 10;

/**
 * @description Create model object
 */
type CreateBlock = (id: number) => any;

/**
 * @description Interface to create mock data
 */
interface DataCreator {
    createData(): Promise<void>;
}

/**
 * @description Generic mock data creator class
 */
class EntityData<T> implements DataCreator {
    list: T[];
    logger: Logger = appLogger();

    get maxItems(): number {
        return MaxItem;
    }
    async createData() {
        for (let i = 0; i < this.maxItems; i++) {
            this.list.push(await this.createBlock(i) as T);
        }
    }

    get createBlock(): CreateBlock {
        return async () => {
            throw Error('should override by subclasses');
        };
    }
}

/**
 * @description Mock data creator for user model
 */
export class UserEntityData extends EntityData<User> {
    get createBlock(): CreateBlock {
        return async (id: number) => {
            try {
                const user: User = await userFactory(undefined, true, id);
                return user;
            } catch (excp) {
                this.logger.error(`UserEntityData | createBlock | ${excp}`);
                return null;
            }
        };
    }
}


/**
 * @description Mock data creator for user-session model
 */
export class UserSessionEntityData extends EntityData<UserSession> {
    get createBlock(): CreateBlock {
        return async (id: number) => {
            const session = await sessionFactory(undefined, true, id);
            return session;
        };
    }
}

/**
 * @description Mock data creator for session activity model
 */
export class SessionActivityData extends EntityData<SessionActivity> {
    get createBlock(): CreateBlock {
        return async (id: number) => {
            const session = await sessionActivityFactory(undefined, true, id);
            return session;
        };
    }
}


/**
 * @description MockData Manger for testing
 * @export class MockDataManager
 */
export class MemoryDataManager {
    // Shared instance
    static  _shared: MemoryDataManager;

    // Global data map
    globalDataMap: any = {};

    // Constructor
    constructor() {
    }

    /**
     * @description Getter for shared instance
     */
    static get shared(): MemoryDataManager {
        return this._shared || (this._shared = new MemoryDataManager());
    }

    /**
     * @description Save in data-map
     * @param any data
     * @param string key
     * @param string schema DB-Name of schema
     */
    save(data: any, key: string, schema: string) {
        const map = this.globalDataMap[schema] || {};
        // Checking for update
        if (data[key] && map[data[key]]) {
            // Update
            map[data[key]] = data;
            this.globalDataMap[schema] = map;
            return;
        }
        // Create
        const count = Object.keys(map).length;
        const next = count + 1;
        data[key] = next;
        map[next] = data;
        this.globalDataMap[schema] = map;
    }

    /**
     * @description Remove object from data-map
     * @param any data
     * @param string key
     * @param string schema DB-Name of schema
     */
    remove(data: any, key: string , schema: string) {
        const map = this.globalDataMap[schema] || {};
        const id = data[key];
       if (map[id]) {
           delete map[id];
       }
       this.globalDataMap[schema] = map;
    }

    /**
     * @description Find data in map
     * @param number key
     * @param string className Schema name
     */
    findByKey(key: number, className: string) {
        const map = this.globalDataMap[className] || {};
        return map[key];
    }

    /**
     * @description Find object in data-map matching query
     * @param string className
     * @param any query Query object
     */
    findQuery(className: string, query?: any): any[] {
        const map: any = this.globalDataMap[className] || {};
        const returns: any[] = _.filter(map, (value: any) => {
            let pass = false;
            _.each(query, (qVal, qKey) => {
                if (qVal === value[qKey]) {
                    pass = true;
                } else {
                    pass = false;
                }
            });
            return pass;
        });
        return returns;
    }
}
// -----------------------------------------------------------------------------------------------------------

