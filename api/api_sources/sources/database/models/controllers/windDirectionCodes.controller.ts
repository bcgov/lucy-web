// ** WindDirectionCodesController ** //

import { RecordController } from '../generic.data.models';
import { WindDirectionCodes} from '../../models';
import { WindDirectionCodesSchema } from '../../database-schema';


/**
 * @description Data Model Controller Class for WindDirectionCodesSchema and WindDirectionCodes
 */
export class WindDirectionCodesController extends RecordController<WindDirectionCodes> {
	/**
	* @description Getter for shared instance
	*/
	public static get shared(): WindDirectionCodesController {
		return this.sharedInstance<WindDirectionCodes>(WindDirectionCodes, WindDirectionCodesSchema) as WindDirectionCodesController;
	}
}
// ----------------
