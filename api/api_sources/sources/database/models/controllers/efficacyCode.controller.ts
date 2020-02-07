// ** EfficacyCodeController ** //

import { RecordController } from '../generic.data.models';
import { EfficacyCode } from '../efficacyCode';
import { EfficacyCodeSchema } from '../../database-schema';


/**
 * @description Data Model Controller Class for EfficacyCodeSchema and EfficacyCode
 */
export class EfficacyCodeController extends RecordController<EfficacyCode> {
	/**
	* @description Getter for shared instance
	*/
	public static get shared(): EfficacyCodeController {
		return this.sharedInstance<EfficacyCode>(EfficacyCode, EfficacyCodeSchema) as EfficacyCodeController;
	}
}
// ----------------
