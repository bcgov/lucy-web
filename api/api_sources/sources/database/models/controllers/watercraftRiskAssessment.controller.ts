// ** WatercraftRiskAssessmentController ** //

import { RecordController } from '../generic.data.models';
import { WatercraftRiskAssessment} from '../watercraftRiskAssessment';
import { WatercraftRiskAssessmentSchema } from '../../database-schema';


/**
 * @description Data Model Controller Class for WatercraftRiskAssessmentSchema and WatercraftRiskAssessment
 */
export class WatercraftRiskAssessmentController extends RecordController<WatercraftRiskAssessment> {
	/**
	* @description Getter for shared instance
	*/
	public static get shared(): WatercraftRiskAssessmentController {
		return this.sharedInstance<WatercraftRiskAssessment>(WatercraftRiskAssessment, WatercraftRiskAssessmentSchema) as WatercraftRiskAssessmentController;
	}

	public async all(query?: any): Promise<WatercraftRiskAssessment[]> {
		const options = query || {};
		options.relations = ['createdBy'];
		return await this.repo.find(options) as WatercraftRiskAssessment[];
	}

	get exportKeyMapper(): {[key: string]: string} {
		return {
			workflow: 'shift'
		};
	}

	get exportKeyPriorities(): {[key: string]: number} {
        return {
			id: 5,
			createdBy: 4,
			workflow: 3,
			timestamp: 2
        };
    }

	processForExport(data: WatercraftRiskAssessment): any {
		const temp: any = {...super.processForExport(data)};
		delete temp.displayLabel;
		let result: any = {};
		result.id = temp.id;
		result.workflow = temp.workflow;
		result.createdBy = temp.createdBy;
		result.timestamp = temp.timestamp;
		delete temp.workflow;
		delete temp.createdBy;
		delete temp.timestamp;
		delete temp.id;
		if (temp.highRiskAssessment === null) {
			delete temp.highRiskAssessment;
		}
		result = { ...result, ...temp};
		// Next handle journey details
		const previousJourney: any[] = [];
		const destinationJourney: any[] = [];
		for (const item of data.journeys) {
			let details: any = {};
			if (item.waterBody && item.waterBody !== null) {
				details = {
					lakeName: item.waterBody.name,
					country: item.waterBody.country,
					province: item.waterBody.province,
					city: item.waterBody.closest
				};
			} else if (item.otherWaterBody) {
				details.other = item.otherWaterBody;
			}
			if (item.journeyType === 1) {
				if (item.numberOfDaysOut && item.numberOfDaysOut !== NaN) {
					details.numberOfDaysOut = `${item.numberOfDaysOut} days out`;
				}
				// Previous journey
				previousJourney.push(details);
			} else {
				// Destination Journey
				destinationJourney.push(details);
			}
		}
		delete result.journeys;
		result.previousJourneyDetails = previousJourney;
		result.destinationJourneyDetails = destinationJourney;
		return result;
	}
}
// ----------------
