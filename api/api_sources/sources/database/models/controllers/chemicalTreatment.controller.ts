// ** DataModel controller of ChemicalTreatment **
import { RecordController } from '../generic.data.models';
import { ChemicalTreatment } from '../chemicalTreatment';
import { ChemicalTreatmentSchema } from '../../database-schema';
// import { HerbicideTankMix } from '../herbicideTankMix';
// import { HerbicideTankMixController } from './herbicideTankMix.controller';
// import { ObservationChemicalTreatment } from '../observationChemicalTreatment';
// import { ObservationChemicalTreatmentController } from './observationChemicalTreatment.controller';

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
		const items: ChemicalTreatment[] = await this.repo.find({ where: { chemical_treatment_id: id}}) as ChemicalTreatment[];
		const item: ChemicalTreatment = items[0];
		// if (item) {
		// 	// fetch all tank mixes associated with the chemical treatment
		// 	const tms = await item.tankMixesFetcher || [];
		// 	const newItems: HerbicideTankMix[] = [];
		// 	if (tms.length > 0) {
		// 		const newTms = await tms.map(async (tm) => {
		// 			return HerbicideTankMixController.shared.findById(tm.herbicide_tank_mix_id);
		// 		});
		// 		for (let i = 0; i < newTms.length; i++) {
		// 			const tmFull = await newTms[i];
		// 			// delete(tmFull.chemicalTreatment);
		// 			newItems.push(tmFull);
		// 		}
		// 		item.tankMixes = newItems;
		// 	}

		// 	// fetch all observationChemicalTreatments associated with the treatment
		// 	const octs = await item.observationChemicalTreatmentsFetcher || [];
		// 	const newOcts: ObservationChemicalTreatment[] = [];
		// 	if (octs.length > 0) {
		// 		const newOct = await octs.map(async (oct) => {
		// 			return ObservationChemicalTreatmentController.shared.findById(oct.observation_chemical_treatment_id);
		// 		});
		// 		for (let i = 0; i < newOct.length; i++) {
		// 			const octFull = await newOct[i];
		// 			// delete(octFull.chemicalTreatment);
		// 			newOcts.push(octFull);
		// 		}
		// 		item.speciesObservations = newOcts;
		// 	}
		// }
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
