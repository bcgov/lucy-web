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

	processExportData(data: WatercraftRiskAssessment): any {
		const r: any = {...data};
		delete r.displayLabel;
		delete r.workflow;
		// Next handle journey details
		const newItems: any[] = [];
		for (const item of data.journeys) {
			newItems.push({
				type: item.journeyType,
				lakeName: item.waterBody.name,
				country: item.waterBody.country,
				province: item.waterBody.province,
				city: item.waterBody.closest
			});
		}
		r.journeys = newItems;
		return r;
	}
}
// ----------------
