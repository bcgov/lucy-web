import { expect, should } from 'chai';
import { commonTestSetupAction, commonTestTearDownAction } from '../../test-helpers/testHelpers';
import {
    MechanicalMethodCode,
    MechanicalMethodCodeController,
    MechanicalDisposalMethodCode,
    MechanicalDisposalMethodCodeController,
    MechanicalSoilDisturbanceCode,
    MechanicalSoilDisturbanceCodeController,
    MechanicalRootRemovalCode,
    MechanicalRootRemovalCodeController,
    MechanicalTreatmentIssueCode,
    MechanicalTreatmentIssueCodeController
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

    it('should fetch mechanical root removal code', async () => {
        const rrc: MechanicalRootRemovalCode = await MechanicalRootRemovalCodeController.shared.findById(2);
        should().exist(rrc);
        const random = await MechanicalRootRemovalCodeController.shared.random();
        should().exist(random);
    });

    it('should fetch mechanical treatment issues code', async () => {
        const tic: MechanicalTreatmentIssueCode = await MechanicalTreatmentIssueCodeController.shared.findById(2);
        should().exist(tic);
        const random = await MechanicalTreatmentIssueCodeController.shared.random();
        should().exist(random);
    });
});
