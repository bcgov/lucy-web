/*
 * Copyright © 2019 Province of British Columbia
 * Licensed under the Apache License, Version 2.0 (the "License")
 * You may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 * **
 * http://www.apache.org/licenses/LICENSE-2.0
 * **
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 * File: treatmentProvide.spec.ts
 * Project: lucy
 * File Created: Tuesday, 3rd September 2019 11:45:07 am
 * Author: pushan
 * -----
 * Last Modified: Tuesday, 3rd September 2019 11:45:13 am
 * Modified By: pushan
 * -----
 */
import { should, expect } from 'chai';
import { commonTestSetupAction, commonTestTearDownAction } from '../../test-helpers/testHelpers';
import {
    TreatmentProviderContractor,
    TreatmentProviderContractorController
} from '../models';

describe('Test Treatment provider contractor model', () => {
    const controller: TreatmentProviderContractorController = TreatmentProviderContractorController.shared;
    before(async () => {
        await commonTestSetupAction();
    });
    after(async () => {
        await commonTestTearDownAction();
        return;
    });
    it('should fetch existing model', async () => {
        const m: TreatmentProviderContractor = await controller.findById(2);
        should().exist(m);
        expect(m.treatment_provider_contractor_id).to.be.equal(2);
    });
    it('should fetch all treatment providers', async () => {
        const all: TreatmentProviderContractor[] = await controller.all();
        should().exist(all);
        expect(all.length).to.be.greaterThan(0);
    });
    it('should return random', async () => {
        const random: TreatmentProviderContractor = await controller.random();
        should().exist(random);
    });
});
// --------------------------------------------------------------
