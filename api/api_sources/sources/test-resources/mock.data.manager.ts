/**
 * Mock Data Manager
 */
import {User, UserSession, SessionActivity} from '../database/models';
import { userFactory, sessionFactory, sessionActivityFactory} from '../database/factory';
import { appLogger, Logger } from '../server/logger';

// ----------------------------------------------------
const MaxItem = 10;

type CreateBlock = (id: number) => any;

interface DataCreator {
    createData(): Promise<void>;
}

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



export class UserSessionEntityData extends EntityData<UserSession> {
    get createBlock(): CreateBlock {
        return async (id: number) => {
            const session = await sessionFactory(undefined, true, id);
            return session;
        };
    }
}

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
    static  _shared: MemoryDataManager;
    globalDataMap: object = {};

    constructor() {
    }
    static get shared(): MemoryDataManager {
        return this._shared || (this._shared = new MemoryDataManager());
    }

    save(data: any, key: string, schema: string) {
        const map = this.globalDataMap[schema] || {};
        // Checking for update
        if (data[key] && map[data[key]]) {
            // Update
            map[data[key]] = data;
            this.globalDataMap = map;
            return;
        }
        // Create
        const count = Object.keys(map).length;
        const next = count + 1;
        data[key] = next;
        map[next] = data;
        this.globalDataMap[schema] = map;
    }

    remove(data: any, key: string , schema: string) {
        const map = this.globalDataMap[schema] || {};
        const id = data[key];
       if (map[id]) {
           delete map[id];
       }
       this.globalDataMap[schema] = map;
    }

    findByKey(key: number, className: string) {
        const map = this.globalDataMap[className] || {};
        return map[key];
    }

    findQuery(className: string, query?: object): any[] {
        const map: object = this.globalDataMap[className] || {};
        const returns: any[] = [];
        for (const k in map) {
            if (map.hasOwnProperty(k)) {
                const val = map[k];
                if (query) {
                    for (const kk in query) {
                        if (query.hasOwnProperty(kk) && val.hasOwnProperty(kk)) {
                            const queryVal = query[kk];
                            if (queryVal === val[kk]) {
                                returns.push(val);
                                break;
                            }
                        }
                    }
                } else {
                    returns.push(val);
                }
            }
        }
        return returns;
    }
}

// ----------------------------------------------------
