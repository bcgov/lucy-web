import { expect, should } from 'chai';
import { commonTestSetupAction, commonTestTearDownAction } from '../../test-helpers/testHelpers';
import { MechanicalMethodCode, MechanicalMethodCodeController } from '../models';
// import { SharedDBManager } from '../dataBaseManager';
import { MechanicalDisposalMethodCode, MechanicalDisposalMethodCodeController } from '../models';

describe('Treatment Code Test', () => {
    before(async () => {
        await commonTestSetupAction();
    });
    after(async () => {
        await commonTestTearDownAction();
        return;
    });

    it('should fetch codes', async () => {
        const mt: MechanicalDisposalMethodCode = await MechanicalDisposalMethodCodeController.shared.findById(1);
        should().exist(mt);
        expect(mt.mechanical_disposal_method_code_id).to.be.equal(1);
    });

    it('should fetch mm', async () => {
        const mm: MechanicalMethodCode = await MechanicalMethodCodeController.shared.findById(1);
        should().exist(mm);
    });
});
