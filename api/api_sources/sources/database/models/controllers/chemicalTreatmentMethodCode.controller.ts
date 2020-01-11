// ** ChemicalTreatmentMethodCodeController ** //

import { RecordController } from '../generic.data.models';
import { ChemicalTreatmentMethodCode} from '../../models';
import { ChemicalTreatmentMethodCodeSchema } from '../../database-schema';


/**
 * @description Data Model Controller Class for ChemicalTreatmentMethodCodeSchema and ChemicalTreatmentMethodCode
 */
export class ChemicalTreatmentMethodCodeController extends RecordController<ChemicalTreatmentMethodCode> {
	/**
	* @description Getter for shared instance
	*/
	public static get shared(): ChemicalTreatmentMethodCodeController {
		return this.sharedInstance<ChemicalTreatmentMethodCode>(ChemicalTreatmentMethodCode, ChemicalTreatmentMethodCodeSchema) as ChemicalTreatmentMethodCodeController;
	}
}
// ----------------
