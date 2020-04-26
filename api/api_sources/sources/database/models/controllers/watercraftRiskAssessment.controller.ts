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
			workflow: 'shift',
			highRiskArea: 'highRiskWhirlingDisease',
			decontaminationReference: 'recordOfDecontaminationNumber'
		};
	}

	get exportKeyPriorities(): {[key: string]: number} {
		const priorityShift = 97;
        return {
			id: 99,
			createdBy: 98,
			timestamp: 95,
			timeOfInspection: 95,
			stationName: priorityShift,
			shiftDate: priorityShift,
			shiftStartTime: priorityShift,
			shiftEndTime: priorityShift,
			k9OnShift: priorityShift,
			motorizedBlowBys: priorityShift,
			nonMotorizedBlowBys: priorityShift,
			shiftStartComment: priorityShift,
			shiftEndComment: priorityShift,
			passportHolder: 89,
			passportNumber: 88,
			launchedOutsideBC: 87,
			decontaminationPerformed: 86,
			decontaminationReference: 85,
			provinceOfResidence: 85,
			countryOfResidence: 83,
			nonMotorized: 82,
			simple: 81,
			complex: 80,
			veryComplex: 79,
			numberOfPeopleInParty: 78,
			commerciallyHauled: 77,
			previousAISKnowledge: 76,
			previousAISKnowledgeSource: 75,
			previousInspection: 74,
			previousInspectionSource: 73,
			previousInspectionDays: 72,
			previousJourneyDetails: 71,
			previousDryStorage: 70,
			unknownPreviousWaterBody: 69,
			commercialManufacturerAsPreviousWaterBody: 68,
			destinationJourneyDetails: 67,
			destinationDryStorage: 66,
			unknownDestinationWaterBody: 65,
			commercialManufacturerAsDestinationWaterBody: 64,
			marineSpeciesFound: 63,
			aquaticPlantsFound: 62,
			marineMusselFound: 61,
			adultDreissenidaeFound: 60,
			highRiskArea: 59,
			highRiskAIS: 58,
			generalComment: -1
        };
    }

	processForExport(data: WatercraftRiskAssessment): any {
		const temp: any = {...super.processForExport(data)};
		delete temp.displayLabel;
		let result: any = {};
		result.id = temp.id;
		result.createdBy = temp.createdBy;
		result.timestamp = temp.timestamp;
		delete temp.workflow;
		delete temp.createdBy;
		delete temp.timestamp;
		delete temp.id;
		if (temp.highRiskAssessment === null) {
			delete temp.highRiskAssessment;
		}

		// Handle Shift Details
		const workflow = data.workflow;
		result.stationName = workflow.station;
		result.shiftDate = `${workflow.date}`;
		result.shiftStartTime = `${workflow.startTime}`;
		result.shiftEndTime = `${workflow.endTime}`;
		result.k9OnShift = `${workflow.k9OnShift}`;
		result.motorizedBlowBys = workflow.motorizedBlowBys;
		result.nonMotorizedBlowBys = workflow.nonMotorizedBlowBys;
		result.shiftStartComment = workflow.shiftStartComment;
		result.shiftEndComment = workflow.shiftEndComment;

		// Get time
		const date = new Date(data.timestamp);
		const timeString = `${date.getHours()}:${date.getMinutes()}:${date.getSeconds()}`;
		result.timeOfInspection = timeString;

		// Creating final result
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
				if (item.numberOfDaysOut && item.numberOfDaysOut > 0) {
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
