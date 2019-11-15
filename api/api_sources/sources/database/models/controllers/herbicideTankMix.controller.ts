// ** HerbicideTankMixController ** //

import { RecordController } from '../generic.data.models';
import { HerbicideTankMix} from '../../models';
import { HerbicideTankMixSchema } from '../../database-schema';


/**
 * @description Data Model Controller Class for HerbicideTankMixSchema and HerbicideTankMix
 */
export class HerbicideTankMixController extends RecordController<HerbicideTankMix> {
	/**
	* @description Getter for shared instance
	*/
	public static get shared(): HerbicideTankMixController {
		return this.sharedInstance<HerbicideTankMix>(HerbicideTankMix, HerbicideTankMixSchema) as HerbicideTankMixController;
	}
}
// ----------------
