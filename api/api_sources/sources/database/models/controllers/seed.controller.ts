import { DataModelController } from '../../data.model.controller';
import { Seed } from '../seed';
import { SeedSchema } from '../../database-schema';

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
}
