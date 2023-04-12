
/**
 * Imports
 */
import { RouteHandler, Route, SecureRouteController, HTTPMethod } from '../../../core';
import { AdultMusselsLocationController } from '../../../../database/models/adultMusselsLocation';
import { PreviousAISKnowledgeSourceController } from '../../../../database/models/previousAISKnowledgeSource';
import { PreviousInspectionSourceController } from '../../../../database/models/previousInspectionSource';
import { CountryProvinceController } from '../../../../database/models';
/**
 * Require
 * @description Importing json constant
 */
const InspectorList = require('../../../../../resources/jsons/musselsApp/MusselInspectors.json');
const OtherInspections = require('../../../../../resources/jsons/musselsApp/MusselOtherInspections.json');
const Stations = require('../../../../../resources/jsons/musselsApp/MusselStationNames.json');
const WatercraftList = require('../../../../../resources/jsons/musselsApp/MusselWatercrafts.json');
const DecontaminationOrderReasons = require('../../../../../resources/jsons/musselsApp/DecontaminationOrderReasons.json');
const DaysOutOfWater = require('../../../../../resources/jsons/musselsApp/DaysOutOfWater.json');
const K9InspectionResults = require('../../../../../resources/jsons/musselsApp/K9InspectionResults.json');
const DaysSincePreviousInspection = require('../../../../../resources/jsons/musselsApp/DaysSincePreviousInspection.json');

/**
 * @description Route Controller for Mussel app constants
 */
export class MusselsAppCodesRouteController extends SecureRouteController<any> {
    static get shared(): MusselsAppCodesRouteController {
        return this.sharedInstance<MusselsAppCodesRouteController>() as MusselsAppCodesRouteController;
    }
    constructor() {
        super();
    }

    processList(list: any[], key: string) {
        return list.map(item => item[key]);
    }

    async data() {
        // Standard code
        const inspectorList: any[] = this.processList(InspectorList as any[], 'Inspectors');
        const otherInspection: any[] = this.processList(OtherInspections as any[], 'Other_Inspections');
        const stations: any[] = this.processList(Stations as any[], 'Station_Name');
        const watercraftList: any[] = this.processList(WatercraftList as any[], 'Watercraft');
        const decontaminationOrderReasonList: any[] = this.processList(DecontaminationOrderReasons as any[], 'Decontamination_Order_Reasons');
        const daysOutOfWaterList: any[] = this.processList(DaysOutOfWater as any[], 'Days_Out_Of_Water');
        const k9InspectionResults: any[] = this.processList(K9InspectionResults as any[], 'K9_Inspection_Results');
        const daysSincePreviousInspectionList: any[] = this.processList(DaysSincePreviousInspection as any[], 'Days_Since_Previous_Inspection');

        // Code tables
        const adultMusselsLocation: any[] = await AdultMusselsLocationController.shared.all();
        const previousAISKnowledgeSource: any[] = await PreviousAISKnowledgeSourceController.shared.all();
        const previousInspectionSource: any[] = await PreviousInspectionSourceController.shared.all();
        const countryProvince: any[] = await CountryProvinceController.shared.all();
        return {
            observers: inspectorList,
            otherObservations: otherInspection,
            stations: stations,
            watercraftList: watercraftList,
            decontaminationOrderReasons: decontaminationOrderReasonList,
            daysOutOfWater: daysOutOfWaterList,
            k9InspectionResults: k9InspectionResults,
            daysSincePreviousInspection: daysSincePreviousInspectionList,
            adultMusselsLocation,
            previousAISKnowledgeSource,
            previousInspectionSource,
            countryProvince
        };
    }

    @Route({
        path: '#/',
        description: 'API to fetch all mussels app codes',
        method: HTTPMethod.get,
        responses: {
            200: {
                description: 'Success',
                schema: {
                    type: 'object'
                }
            }
        }
    })
    get code(): RouteHandler {
        return this.routeConfig<any>(`${this.className}: codes`, async () => [200, await this.data()]);
    }
}


// ------------------------
