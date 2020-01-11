// ** ObservationChemicalTreatmentController ** //

import { RecordController } from '../generic.data.models';
import { ObservationChemicalTreatment} from '../../models';
import { ObservationChemicalTreatmentSchema } from '../../database-schema';


/**
 * @description Data Model Controller Class for ObservationChemicalTreatmentSchema and ObservationChemicalTreatment
 */
export class ObservationChemicalTreatmentController extends RecordController<ObservationChemicalTreatment> {
	/**
	* @description Getter for shared instance
	*/
	public static get shared(): ObservationChemicalTreatmentController {
		return this.sharedInstance<ObservationChemicalTreatment>(ObservationChemicalTreatment, ObservationChemicalTreatmentSchema) as ObservationChemicalTreatmentController;
	}

	/**
	 * @description Getter for specific observationChemicalTreatment by observation_chemical_treatment_id
	 * @param id observation_chemical_treatment_id
	 */
	async findById(id: number): Promise<ObservationChemicalTreatment> {
		const items: ObservationChemicalTreatment[] = await this.repo.find({
			where: { observation_chemical_treatment_id: id}
		}) as ObservationChemicalTreatment[];
        return items[0];
	}

	/**
	 * @description Getter for all observation chemical treatments for specific chemical treatment by chemical_treatment_id
	 * @param ct_id chemical_treatment_id
	 */
	async findTankMixesForChemicalTreatment(ct_id: number): Promise<ObservationChemicalTreatment[]> {
		const items: ObservationChemicalTreatment[] = await this.repo.find({
			where: {chemical_treatment_id: ct_id}
		}) as ObservationChemicalTreatment[];
		return items;
	}
}
// ----------------
