// ** MajorCityController ** //

import { RecordController } from '../generic.data.models';
import { MajorCity } from '../majorCity';
import { MajorCitySchema } from '../../database-schema';


/**
 * @description Data Model Controller Class for MajorCitySchema and MajorCity
 */
export class MajorCityController extends RecordController<MajorCity> {
	/**
	* @description Getter for shared instance
	*/
	public static get shared(): MajorCityController {
		return this.sharedInstance<MajorCity>(MajorCity, MajorCitySchema) as MajorCityController;
	}
}
// ----------------
