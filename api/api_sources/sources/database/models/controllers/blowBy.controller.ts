// ** BlowByController ** //

import { RecordController } from '../generic.data.models';
import { BlowBy} from '../../models';
import { BlowBySchema } from '../../database-schema';

// ** BlowByController ** //


/**
 * @description Data Model Controller Class for BlowBySchema and BlowBy
 */
export class BlowByController extends RecordController<BlowBy> {
	/**
	* @description Getter for shared instance
	*/
	public static get shared(): BlowByController {
		return this.sharedInstance<BlowBy>(BlowBy, BlowBySchema) as BlowByController;
	}

	public async all(query?: any): Promise<BlowBy[]> {
		const options = query || {};
		options.relations = ['observerWorkflowId'];
		return await this.repo.find(options) as BlowBy[];
	}

	get exportKeyPriorities(): {[key: string]: number} {
		const basePriority = 1000;
		const topPriority = 100;
		return {
			id: basePriority + topPriority,
			observerWorkflowId: (basePriority + topPriority - 10),
			blowByTime: (basePriority + topPriority - 50),
			watercraftComplexity: (basePriority + topPriority - 60),
			reportedToRapp: (basePriority + topPriority - 70),
		};
	}

	processForExport(data: BlowBy): any {
		const result: any = {};
		Object.keys(data).forEach((key) => {
			if (this.exportKeyMapper[key]) {
				result[this.exportKeyMapper[key]] = data[key];
			}
		});
		return result;
	}
}
// ----------------
