// ** AnimalObservationController ** //

import { RecordController } from '../generic.data.models';
import { AnimalObservation} from '../../models';
import { AnimalObservationSchema } from '../../database-schema';


/**
 * @description Data Model Controller Class for AnimalObservationSchema and AnimalObservation
 */
export class AnimalObservationController extends RecordController<AnimalObservation> {
	/**
	* @description Getter for shared instance
	*/
	public static get shared(): AnimalObservationController {
		return this.sharedInstance<AnimalObservation>(AnimalObservation, AnimalObservationSchema) as AnimalObservationController;
	}
}
// ----------------
