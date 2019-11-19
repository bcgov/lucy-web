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

	/*async findById(id: number): Promise<ObservationChemicalTreatment> {
		const options: FindManyOptions<ObservationChemicalTreatment> = {
			relations: this.schemaObject.table.relationalColumnKeys,
			where: { observation_chemical_treatment_id: id}
		};
		const items: ObservationChemicalTreatment[] = await this.repo.find(options) as ObservationChemicalTreatment[];
        return items[0];
	}*/
}
// ----------------
