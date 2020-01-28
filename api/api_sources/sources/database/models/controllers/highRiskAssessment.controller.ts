// ** HighRiskAssessmentController ** //

import { RecordController } from '../generic.data.models';
import { HighRiskAssessment} from '../../models';
import { HighRiskAssessmentSchema } from '../../database-schema';


/**
 * @description Data Model Controller Class for HighRiskAssessmentSchema and HighRiskAssessment
 */
export class HighRiskAssessmentController extends RecordController<HighRiskAssessment> {
	/**
	* @description Getter for shared instance
	*/
	public static get shared(): HighRiskAssessmentController {
		return this.sharedInstance<HighRiskAssessment>(HighRiskAssessment, HighRiskAssessmentSchema) as HighRiskAssessmentController;
	}
}
// ----------------
