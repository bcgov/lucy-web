import { expect, should } from 'chai';
import { commonTestSetupAction, commonTestTearDownAction } from '../../test-helpers/testHelpers';
import {
    MechanicalMethodCode,
    MechanicalMethodCodeController,
    MechanicalDisposalMethodCode,
    MechanicalDisposalMethodCodeController,
    MechanicalSoilDisturbanceCode,
    MechanicalSoilDisturbanceCodeController
} from '../models';

describe('Treatment Code Test', () => {
    before(async () => {
        await commonTestSetupAction();
    });
    after(async () => {
        await commonTestTearDownAction();
        return;
    });

    it('should fetch mechanical disposal code', async () => {
        const mt: MechanicalDisposalMethodCode = await MechanicalDisposalMethodCodeController.shared.findById(1);
        should().exist(mt);
        expect(mt.mechanical_disposal_method_code_id).to.be.equal(1);
    });

    it('should fetch mechanical method code', async () => {
        const mm: MechanicalMethodCode = await MechanicalMethodCodeController.shared.findById(1);
        should().exist(mm);
    });

    it('should fetch mechanical soil disturbance code', async () => {
        const sdc: MechanicalSoilDisturbanceCode = await MechanicalSoilDisturbanceCodeController.shared.findById(2);
        should().exist(sdc);
        expect(sdc.mechanical_soil_disturbance_code_id).to.be.equal(2);
        const random: MechanicalSoilDisturbanceCode = await MechanicalSoilDisturbanceCodeController.shared.random();
        should().exist(random);
    });
});
