// ** HerbicideTankMixController ** //

import { RecordController } from '../generic.data.models';
import { HerbicideTankMix} from '../../models';
import { HerbicideTankMixSchema } from '../../database-schema';


/**
 * @description Data Model Controller Class for HerbicideTankMixSchema and HerbicideTankMix
 */
export class HerbicideTankMixController extends RecordController<HerbicideTankMix> {
	/**
	* @description Getter for shared instance
	*/
	public static get shared(): HerbicideTankMixController {
		return this.sharedInstance<HerbicideTankMix>(HerbicideTankMix, HerbicideTankMixSchema) as HerbicideTankMixController;
	}

	/**
	 * @description Getter for specific tank mix by tank_mix_id
	 * @param id herbicide_tank_mix_id
	 */
	async findById(id: number): Promise<HerbicideTankMix> {
		const items: HerbicideTankMix[] = await this.repo.find({
			where: { herbicide_tank_mix_id: id}
		}) as HerbicideTankMix[];
        return items[0];
	}

	/**
	 * @description Getter for all tank mixes for specific chemical treatment by chemical_treatment_id
	 * @param ct_id chemical_treatment_id
	 */
	async findTankMixesForChemicalTreatment(ct_id: number): Promise<HerbicideTankMix[]> {
		const items: HerbicideTankMix[] = await this.repo.find({
			where: {chemical_treatment_id: ct_id}
		}) as HerbicideTankMix[];
		return items;
	}
}
// ----------------
