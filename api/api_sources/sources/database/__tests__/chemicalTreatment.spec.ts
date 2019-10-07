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
 * File: chemicalTreatment.spec.ts
 * Project: lucy
 * File Created: Monday, 7th October 2019 10:12:09 am
 * Author: pushan
 * -----
 * Last Modified: Monday, 7th October 2019 10:12:14 am
 * Modified By: pushan
 * -----
 */
import { expect, should } from 'chai';
import { commonTestSetupAction, commonTestTearDownAction } from '../../test-helpers/testHelpers';
import { ChemicalTreatment, ChemicalTreatmentController } from '../models';
import { ModelFactory, Destroyer } from '../factory';

// ** Test Function
describe('Test Chemical Treatment', () => {
    before(async () => {
        await commonTestSetupAction();
    });
    after(async () => {
        await commonTestTearDownAction();
        return;
    });

    it('should create chemical treatment Object', async () => {
        const obj: ChemicalTreatment = await ModelFactory(ChemicalTreatmentController.shared)();
        should().exist(obj);
        should().exist(obj.chemical_treatment_id);
        expect(typeof obj.chemical_treatment_id).to.be.equal(typeof 1);
        const ch = await ChemicalTreatmentController.shared.findById(obj.chemical_treatment_id);
        should().exist(ch);
        expect(ch.chemical_treatment_id).to.be.equal(obj.chemical_treatment_id);
        expect(ch.speciesAgency);
        await Destroyer(ChemicalTreatmentController.shared)(obj);
    });
});

// ------------------------------------------------------------
