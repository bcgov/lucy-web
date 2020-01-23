// ** WatercraftJourneyController ** //

import { RecordController } from '../generic.data.models';
import { WatercraftJourney} from '../../models';
import { WatercraftJourneySchema } from '../../database-schema';


/**
 * @description Data Model Controller Class for WatercraftJourneySchema and WatercraftJourney
 */
export class WatercraftJourneyController extends RecordController<WatercraftJourney> {
	/**
	* @description Getter for shared instance
	*/
	public static get shared(): WatercraftJourneyController {
		return this.sharedInstance<WatercraftJourney>(WatercraftJourney, WatercraftJourneySchema) as WatercraftJourneyController;
	}
}
// ----------------
