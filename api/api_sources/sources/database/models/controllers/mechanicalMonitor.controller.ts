// ** MechanicalMonitorController ** //

import { RecordController } from '../generic.data.models';
import { MechanicalMonitor} from '../../models';
import { MechanicalMonitorSchema } from '../../database-schema';


/**
 * @description Data Model Controller Class for MechanicalMonitorSchema and MechanicalMonitor
 */
export class MechanicalMonitorController extends RecordController<MechanicalMonitor> {
	/**
	* @description Getter for shared instance
	*/
	public static get shared(): MechanicalMonitorController {
		return this.sharedInstance<MechanicalMonitor>(MechanicalMonitor, MechanicalMonitorSchema) as MechanicalMonitorController;
	}
}
// ----------------
