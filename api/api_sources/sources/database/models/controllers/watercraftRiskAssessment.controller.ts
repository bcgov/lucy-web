// ** WatercraftRiskAssessmentController ** //

import { RecordController } from '../generic.data.models';
import { WatercraftRiskAssessment} from '../watercraftRiskAssessment';
import { WatercraftRiskAssessmentSchema } from '../../database-schema';


/**
 * @description Data Model Controller Class for WatercraftRiskAssessmentSchema and WatercraftRiskAssessment
 */
export class WatercraftRiskAssessmentController extends RecordController<WatercraftRiskAssessment> {
	/**
	* @description Getter for shared instance
	*/
	public static get shared(): WatercraftRiskAssessmentController {
		return this.sharedInstance<WatercraftRiskAssessment>(WatercraftRiskAssessment, WatercraftRiskAssessmentSchema) as WatercraftRiskAssessmentController;
	}
}
// ----------------
