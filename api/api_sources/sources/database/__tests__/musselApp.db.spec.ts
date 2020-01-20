/**
 * Imports
 */

import { should, expect } from 'chai';
import { commonTestSetupAction, commonTestTearDownAction, testModel } from '../../test-helpers/testHelpers';
import {
    WatercraftRiskAssessment,
    WatercraftRiskAssessmentController,
    ObserverWorkflow,
    ObserverWorkflowController
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
        // Fetch data
        const ft = await WatercraftRiskAssessmentController.shared.findById(w.watercraft_risk_assessment_id);
        should().exist(ft);
        expect(ft.watercraft_risk_assessment_id).to.be.equal(w.watercraft_risk_assessment_id);
        should().exist(ft.highRiskAssessmentForm);
        should().exist(ft.highRiskAssessmentForm['test']);
        should().exist(ft.lowRiskAssessmentForm);
        should().exist(ft.fullObservationForm);
        should().exist(ft.additionalInfo);
        await Destroyer(WatercraftRiskAssessmentController.shared)(w);
    });

    it('should fetch water body', async () => {
        const waterBody: WaterBody = await WaterBodyController.shared.random();
        should().exist(waterBody);
        should().exist(waterBody.water_body_id);
    });

    it('should create and fetch workflow', async() => {
        const o: ObserverWorkflow = await ModelFactory(ObserverWorkflowController.shared)();
        should().exist(o);
        const fetch: ObserverWorkflow = await ObserverWorkflowController.shared.findById(o.observer_workflow_id);
        should().exist(fetch);
        should().exist(fetch.observer_workflow_id);
        expect(fetch.observer_workflow_id).to.be.equal(o.observer_workflow_id);
        testModel(fetch, ObserverWorkflowSchema.shared);
    });

    it('should load relation workflow for WatercraftRiskAssessment', async () => {
        const w: WatercraftRiskAssessment = await ModelFactory(WatercraftRiskAssessmentController.shared)();
        should().exist(w.workflow);
        const f: WatercraftRiskAssessment = await WatercraftRiskAssessmentController.shared.findById(w.watercraft_risk_assessment_id);
        should().exist(f.workflow);
        expect(f.workflow.observer_workflow_id).to.be.equal(w.workflow.observer_workflow_id);
    });
});

// -------------------------------
