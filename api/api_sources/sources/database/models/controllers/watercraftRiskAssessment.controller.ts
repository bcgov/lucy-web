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
			highRiskArea: 'highRiskWhirlingDisease',
			decontaminationReference: 'recordOfDecontaminationNumber',
			'highRiskAssessment.adultDreissenidaeMusselDetail': 'highRiskAssessment.adultDreissenidaeMusselLocation',
			'highRiskAssessment.decontaminationReference': 'highRiskAssessment.recordOfDecontaminationNumber'
		};
	}

	get exportKeyPriorities(): {[key: string]: number} {
		const basePriority = 1000;
		const topPriority = 100;
        return {
			id: basePriority + topPriority,
			createdBy: (basePriority + topPriority  - 10),
			stationName: (basePriority + topPriority - 40),
			shiftDate: (basePriority + topPriority - 50),
			shiftStartTime: (basePriority + topPriority - 60),
			shiftEndTime: (basePriority + topPriority - 70),
			k9OnShift: (basePriority  + topPriority - 80),
			motorizedBlowBys: (basePriority + topPriority - 90),
			nonMotorizedBlowBys: (basePriority + topPriority - 100),
			noBoatInspected: (basePriority + topPriority - 110),
			shiftStartComment: (basePriority - 120),
			shiftEndComment: (basePriority - 140),
			timestamp: (basePriority + - 145),
			passportHolder: (basePriority - 150),
			isNewPassportIssued: (basePriority - 155),
			passportNumber: (basePriority - 160),
			timeOfInspection: (basePriority - 165),
			launchedOutsideBC: (basePriority - 170),
			decontaminationPerformed: (basePriority - 180),
			decontaminationReference: (basePriority - 190),
			provinceOfResidence: (basePriority - 200),
			countryOfResidence: (basePriority - 210),
			nonMotorized: (basePriority - 220),
			simple: (basePriority - 230),
			complex: (basePriority - 240),
			veryComplex: (basePriority - 250),
			numberOfPeopleInParty: (basePriority - 260),
			commerciallyHauled: (basePriority - 270),
			previousAISKnowledge: (basePriority - 280),
			previousAISKnowledgeSource: (basePriority - 290),
			previousInspection: (basePriority - 300),
			previousInspectionSource: (basePriority - 310),
			previousInspectionDays: (basePriority - 320),
			previousJourneyDetails: (basePriority - 330),
			previousDryStorage: (basePriority - 340),
			previousMajorCity: (basePriority - 345),
			unknownPreviousWaterBody: (basePriority - 350),
			commercialManufacturerAsPreviousWaterBody: (basePriority - 360),
			destinationJourneyDetails: (basePriority - 370),
			destinationDryStorage: (basePriority - 380),
			destinationMajorCity: (basePriority - 385),
			unknownDestinationWaterBody: (basePriority - 390),
			commercialManufacturerAsDestinationWaterBody: (basePriority - 400),
			marineSpeciesFound: (basePriority - 410),
			aquaticPlantsFound: (basePriority - 420),
			marineMusselFound: (basePriority - 430),
			adultDreissenidaeFound: (basePriority - 440),
			highRiskArea: (basePriority - 450),
			highRiskAIS: (basePriority - 500),
			'highRiskAssessment.id': basePriority - 590,
			'highRiskAssessment.watercraftRegistration': basePriority - 591,
			'highRiskAssessment.cleanDrainDryAfterInspection': basePriority - 592,
			'highRiskAssessment.standingWaterPresent': basePriority - 593,
			'highRiskAssessment.standingWaterLocation': basePriority - 594,
			'highRiskAssessment.adultDreissenidaeMusselFound': basePriority - 595,
			'highRiskAssessment.adultDreissenidaeMusselDetail': basePriority - 596,
			'highRiskAssessment.decontaminationPerformed': basePriority - 597,
			'highRiskAssessment.decontaminationReference': basePriority - 598,
			'highRiskAssessment.decontaminationOrderIssued': basePriority - 599,
			'highRiskAssessment.decontaminationOrderNumber': basePriority - 600,
			'highRiskAssessment.quarantinePeriodIssued': basePriority - 601,
			'highRiskAssessment.sealIssued': basePriority - 602,
			'highRiskAssessment.sealNumber': basePriority - 603,
			'highRiskAssessment.otherInspectionFindings': basePriority - 604,
			'highRiskAssessment.generalComments': basePriority - 605,
			'highRiskAssessment.decontaminationOrderReason': basePriority - 606,
			'highRiskAssessment.dreissenidMusselsFoundPrevious': basePriority - 606,
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
		result.noBoatInspected = false;
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
					city: item.waterBody.closest,
					numberOfDaysOut: 'NA',
					other: 'NA'
				};
			} else if (item.otherWaterBody) {
				details = {
					lakeName: 'NA',
					country: 'NA',
					province: 'NA',
					city: 'NA',
					numberOfDaysOut: 'NA',
					other: item.otherWaterBody
				};
			}
			if (item.journeyType === 1) {
				if (item.numberOfDaysOut && item.numberOfDaysOut !== '') {
					details.numberOfDaysOut = `${item.numberOfDaysOut}`;
				} else {
					details.numberOfDaysOut = `NA`;
				}
				// Previous journey
				previousJourney.push(details);
			} else {
				// Destination Journey
				delete details.numberOfDaysOut;
				destinationJourney.push(details);
			}
		}
		delete result.journeys;
		result.previousJourneyDetails = previousJourney;
		result.destinationJourneyDetails = destinationJourney;
		delete result.workflow;
		delete result.shift;
		return result;
	}
}
// ----------------
