// ** SpeciesTreatmentController ** //

import { RecordController } from '../generic.data.models';
import { SpeciesTreatment } from '../../models';
import { SpeciesTreatmentSchema } from '../../database-schema';


/**
 * @description Data Model Controller Class for SpeciesTreatmentSchema and SpeciesTreatment
 */
export class SpeciesTreatmentController extends RecordController<SpeciesTreatment> {
	/**
	* @description Getter for shared instance
	*/
	public static get shared(): SpeciesTreatmentController {
		return this.sharedInstance<SpeciesTreatment>(SpeciesTreatment, SpeciesTreatmentSchema) as SpeciesTreatmentController;
	}
}