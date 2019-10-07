// ** DataModel controller of ChemicalTreatment **
import { RecordController } from '../generic.data.models';
import { ChemicalTreatment } from '../chemicalTreatment';
import { ChemicalTreatmentSchema } from '../../database-schema';

/**
 * @description Data Model Controller Class for ChemicalTreatmentSchema and ChemicalTreatment
 */
export class ChemicalTreatmentController extends RecordController<ChemicalTreatment> {
	/**
	* @description Getter for shared instance
	*/
	public static get shared(): ChemicalTreatmentController {
		return this.sharedInstance<ChemicalTreatment>(ChemicalTreatment, ChemicalTreatmentSchema) as ChemicalTreatmentController;
	}
}
// ----------------
