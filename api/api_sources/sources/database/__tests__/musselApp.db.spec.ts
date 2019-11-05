/**
 * Imports
 */

import { should, expect } from 'chai';
import { commonTestSetupAction, commonTestTearDownAction, testModel } from '../../test-helpers/testHelpers';
import { WatercraftRiskAssessment, WatercraftRiskAssessmentController } from '../models';
import { ModelFactory, Destroyer } from '../factory';
import { WatercraftRiskAssessmentSchema } from '../database-schema';

describe('Mussel app db element tests', () => {
    before(async () => {
        await commonTestSetupAction();
    });
    after(async () => {
        await commonTestTearDownAction();
        return;
    });

    it('should create water craft risk assessment model', async () => {
        const wcra: WatercraftRiskAssessment = await ModelFactory(WatercraftRiskAssessmentController.shared)();
        should().exist(wcra);
        testModel(wcra, WatercraftRiskAssessmentSchema.shared);
        // Fetch data
        const ft = await WatercraftRiskAssessmentController.shared.findById(wcra.watercraft_risk_assessment_id);
        should().exist(ft);
        expect(ft.watercraft_risk_assessment_id).to.be.equal(wcra.watercraft_risk_assessment_id);
        should().exist(ft.formData);
        should().exist(ft.formData['test']);
        await Destroyer(WatercraftRiskAssessmentController.shared)(wcra);
    });
});

// -------------------------------
