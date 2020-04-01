// ** WaterBodyController ** //

import { RecordController } from '../generic.data.models';
import { WaterBody} from '../waterBody';
import { WaterBodySchema } from '../../database-schema';


/**
 * @description Data Model Controller Class for WaterBodySchema and WaterBody
 */
export class WaterBodyController extends RecordController<WaterBody> {
	/**
	* @description Getter for shared instance
	*/
	public static get shared(): WaterBodyController {
		return this.sharedInstance<WaterBody>(WaterBody, WaterBodySchema) as WaterBodyController;
	}
}
// ----------------
