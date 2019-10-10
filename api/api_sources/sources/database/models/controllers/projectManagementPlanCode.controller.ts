// ** ProjectManagementPlanCodeController **//

import { RecordController } from '../generic.data.models';
import { ProjectManagementPlanCode} from '../projectManagementPlan.code';
import { ProjectManagementPlanCodeSchema } from '../../database-schema';


/**
 * @description Data Model Controller Class for ProjectManagementPlanCodeSchema and ProjectManagementPlanCode
 */
export class ProjectManagementPlanCodeController extends RecordController<ProjectManagementPlanCode> {
	/**
	* @description Getter for shared instance
	*/
	public static get shared(): ProjectManagementPlanCodeController {
		return this.sharedInstance<ProjectManagementPlanCode>(ProjectManagementPlanCode, ProjectManagementPlanCodeSchema) as ProjectManagementPlanCodeController;
	}
}
// ----------------
