import * as csv from 'csvtojson' 
import { Connection} from 'typeorm'
import { LoggerBase} from '../server/logger'
import * as path from 'path';
import { UserData, LoadData, BaseModel, User} from './models'
import { SharedDBManager } from './index';

const seedFileAdmin = 'Admin-Sheet1.csv'
const seedFolderPath = '../../../../seeds/'
declare const __dirname: any;

const getFilePath = (fileName: string) => {
    return path.resolve(__dirname + seedFolderPath, seedFileAdmin)
}



class Seeder<D, T extends BaseModel> extends LoggerBase {

    async seed(seedFileName: string, entity: any, uniqueKey: string): Promise<void> {
        const seedAdminPath = getFilePath(seedFileAdmin);
        Seeder.logger.info(`Will seed from file: ${seedAdminPath}`);
        const seeds: D[] = await csv().fromFile(seedAdminPath);
        for (const d of seeds) {
            try {
                SeedManager.logger.info(`Seed ${seedFileName} Value: ${JSON.stringify(d)}`);
                let query: object = {}
                query[uniqueKey] = d[uniqueKey]
                const conn: Connection = SharedDBManager.connection
                //const repo = conn.getRepository(entity);
                const existing: T = await entity.fetchOne(conn, query) as T
                if (!existing) {
                    SeedManager.logger.info('Will Create new Item');
                    const newObj = new entity()
                    const newItem: T = newObj as T
                    const newLoad: LoadData<D> = newObj as LoadData<D>
                    newLoad.loadMap(d);
                    newItem.loadData(d);
                }
            } catch(err) {
                SeedManager.logger.info(`Error while seeding ${seedFileName} => ${err}`)
            }
        }
    }
}

export class SeedManager extends LoggerBase {
    private static instance: SeedManager;

    public static get shared(): SeedManager {
        return this.instance || (this.instance = new this());
    }
    
    constructor() {
        super()
    }

    get connection(): Connection {
        return SharedDBManager.connection
    }

    async seedAdmin(): Promise<void> {
        const seeder: Seeder<UserData, User> = new Seeder<UserData, User>()
        await seeder.seed(seedFileAdmin, User, 'email')
        return
    }
}
