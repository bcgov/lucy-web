// ** ChemicalTreatmentEmployeeController ** //

import { RecordController } from '../generic.data.models';
import { ChemicalTreatmentEmployee } from '../chemicalTreatmentEmployee';
import { ChemicalTreatmentEmployeeSchema } from '../../database-schema';


/**
 * @description Data Model Controller Class for ChemicalTreatmentEmployeeSchema and ChemicalTreatmentEmployee
 */
export class ChemicalTreatmentEmployeeController extends RecordController<ChemicalTreatmentEmployee> {
	/**
	* @description Getter for shared instance
	*/
	public static get shared(): ChemicalTreatmentEmployeeController {
		return this.sharedInstance<ChemicalTreatmentEmployee>(ChemicalTreatmentEmployee, ChemicalTreatmentEmployeeSchema) as ChemicalTreatmentEmployeeController;
	}
}
// ----------------
