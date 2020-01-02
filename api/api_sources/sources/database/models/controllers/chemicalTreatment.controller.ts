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

	async findById(id: number): Promise<ChemicalTreatment> {
		const items: ChemicalTreatment[] = await this.repo.find({ where: { chemical_treatment_id: id}, relations: ['secondApplicator']}) as ChemicalTreatment[];
		const item: ChemicalTreatment = items[0];
		return item;
	}

	/**
     * @description Method to get all object filtered by query
     * @param object query
     */
    async all(query?: object): Promise<ChemicalTreatment[]> {

        const items: ChemicalTreatment[] = await this.repo.find({ where: query, relations: ['secondApplicator']}) as ChemicalTreatment[];
        return items;
    }
}
// ----------------
