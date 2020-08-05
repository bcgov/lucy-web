/**
 * Imports
 */

import { should, expect } from 'chai';
import { commonTestSetupAction, commonTestTearDownAction, testModel } from '../../test-helpers/testHelpers';
import {
    WatercraftRiskAssessment,
    WatercraftRiskAssessmentController,
    ObserverWorkflow,
    ObserverWorkflowController,
    WatercraftJourney,
    WatercraftJourneyController,
    AdultMusselsLocation,
    AdultMusselsLocationController,
    PreviousAISKnowledgeSource,
    PreviousAISKnowledgeSourceController,
    PreviousInspectionSource,
    PreviousInspectionSourceController
} from '../models';
import { ModelFactory, Destroyer } from '../factory';
import { WatercraftRiskAssessmentSchema, ObserverWorkflowSchema } from '../database-schema';
import { WaterBody } from '../models/waterBody';
import { WaterBodyController } from '../models/controllers/waterBody.controller';

describe('Mussel app db element tests', () => {
    before(async () => {
        await commonTestSetupAction();
    });
    after(async () => {
        await commonTestTearDownAction();
        return;
    });

    it('should create water craft risk assessment model', async () => {
        const w: WatercraftRiskAssessment = await ModelFactory(WatercraftRiskAssessmentController.shared)();
        should().exist(w);
        testModel(w, WatercraftRiskAssessmentSchema.shared);
        should().exist(w.countryOfResidence);
        should().exist(w.provinceOfResidence);
        // Fetch data
        const ft = await WatercraftRiskAssessmentController.shared.findById(w.watercraft_risk_assessment_id);
        should().exist(ft);
        expect(ft.watercraft_risk_assessment_id).to.be.equal(w.watercraft_risk_assessment_id);
        testModel(ft, WatercraftRiskAssessmentSchema.shared);
        await Destroyer(WatercraftRiskAssessmentController.shared)(w);
    });

    it('should fetch water body', async () => {
        const waterBody: WaterBody = await WaterBodyController.shared.random();
        should().exist(waterBody);
        should().exist(waterBody.water_body_id);
    });

    it('should fetch adult mussel location', async () => {
        const adultMusselLocation: AdultMusselsLocation = await AdultMusselsLocationController.shared.random();
        should().exist(adultMusselLocation);
        should().exist(adultMusselLocation.adult_mussels_location_code_id);
    });

    it('should fetch previous AIS knowledge source', async () => {
        const prevAISKnowledgeSource: PreviousAISKnowledgeSource = await PreviousAISKnowledgeSourceController.shared.random();
        should().exist(prevAISKnowledgeSource);
        should().exist(prevAISKnowledgeSource.previous_ais_knowledge_source_code_id);
    });

    it('should fetch previous inspection source', async () => {
        const prevInspectionSource: PreviousInspectionSource = await PreviousInspectionSourceController.shared.random();
        should().exist(prevInspectionSource);
        should().exist(prevInspectionSource.previous_inspection_source_code_id);
    });

    it('should create and fetch workflow', async() => {
        const o: ObserverWorkflow = await ModelFactory(ObserverWorkflowController.shared)();
        should().exist(o);
        const fetch: ObserverWorkflow = await ObserverWorkflowController.shared.findById(o.observer_workflow_id);
        should().exist(fetch);
        should().exist(fetch.observer_workflow_id);
        expect(fetch.observer_workflow_id).to.be.equal(o.observer_workflow_id);
        testModel(fetch, ObserverWorkflowSchema.shared);
        await Destroyer(ObserverWorkflowController.shared)(o);
    });

    it('should create / fetch WatercraftJourney', async () => {
        const wj: WatercraftJourney = await ModelFactory(WatercraftJourneyController.shared)();
        should().exist(wj);
        const f: WatercraftJourney = await WatercraftJourneyController.shared.findById(wj.watercraft_journey_id);
        should().exist(f);
        should().exist(f.waterBody);
    });

    it('should load relation workflow for WatercraftRiskAssessment', async () => {
        const w: WatercraftRiskAssessment = await ModelFactory(WatercraftRiskAssessmentController.shared)();
        should().exist(w.workflow);
        const f: WatercraftRiskAssessment = await WatercraftRiskAssessmentController.shared.findById(w.watercraft_risk_assessment_id);
        should().exist(f.workflow);
        expect(f.workflow.observer_workflow_id).to.be.equal(w.workflow.observer_workflow_id);
    });

    it('should export data for WatercraftRiskAssessment', async () => {
        const w: WatercraftRiskAssessment = await ModelFactory(WatercraftRiskAssessmentController.shared)();
        should().exist(w);
        const exportedData: any[] = await WatercraftRiskAssessmentController.shared.export() as any[];
        should().exist(exportedData);
        for (const item of exportedData) {
            for (const prop in item) {
                if (item.hasOwnProperty(prop)) {
                    const type = typeof item[prop];
                    if (item[prop] !== null) {
                        expect ( type !== 'object' && type !== 'function' ).to.be.equal(true);
                    }
                }
            }
        }
    });
});

// -------------------------------
