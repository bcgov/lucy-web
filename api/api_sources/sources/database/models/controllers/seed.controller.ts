import { DataModelController } from '../../data.model.controller';
import { Seed } from '../seed';
import { SeedSchema } from '../../database-schema';
import { User } from '../user';

/**
 * @description Data Model controller for Seed table
 */
export class SeedController extends DataModelController<Seed> {
    /**
     * @description Getter for shared instance
     */
    public static get shared(): SeedController {
        return this.sharedInstance<Seed>(Seed, SeedSchema) as SeedController;
    }

    async createNewObject(spec: any, creator: User) {
        const newObj = this.newObject(spec);
        newObj.createdBy = creator;
        newObj.updatedBy = creator;
        try {
            await this.saveInDB(newObj);
            return newObj;
        } catch (excp) {
            throw excp;
        }
    }

}
