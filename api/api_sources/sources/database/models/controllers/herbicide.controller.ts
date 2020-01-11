// ** HerbicideController ** //

import { RecordController } from '../generic.data.models';
import { Herbicide} from '../../models';
import { HerbicideSchema } from '../../database-schema';


/**
 * @description Data Model Controller Class for HerbicideSchema and Herbicide
 */
export class HerbicideController extends RecordController<Herbicide> {
	/**
	* @description Getter for shared instance
	*/
	public static get shared(): HerbicideController {
		return this.sharedInstance<Herbicide>(Herbicide, HerbicideSchema) as HerbicideController;
	}
}
// ----------------
