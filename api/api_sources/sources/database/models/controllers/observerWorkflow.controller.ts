// ** ObserverWorkflowController ** //

import { RecordController } from '../generic.data.models';
import { ObserverWorkflow} from '../observerWorkflow';
import { ObserverWorkflowSchema } from '../../database-schema';


/**
 * @description Data Model Controller Class for ObserverWorkflowSchema and ObserverWorkflow
 */
export class ObserverWorkflowController extends RecordController<ObserverWorkflow> {
	/**
	* @description Getter for shared instance
	*/
	public static get shared(): ObserverWorkflowController {
		return this.sharedInstance<ObserverWorkflow>(ObserverWorkflow, ObserverWorkflowSchema) as ObserverWorkflowController;
	}

	processForExport(data: ObserverWorkflow) {
		const result = super.processForExport(data);
		delete result.displayLabel;
		return result;
	}
}
// ----------------
