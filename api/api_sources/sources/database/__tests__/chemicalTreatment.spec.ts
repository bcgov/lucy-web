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
import {
    ChemicalTreatment,
    ChemicalTreatmentController,
    PesticideEmployerCode,
    PesticideEmployerCodeController,
    ProjectManagementPlanCode,
    ProjectManagementPlanCodeController,
    ChemicalTreatmentEmployee,
    ChemicalTreatmentSpec
} from '../models';
import { ModelFactory, Destroyer, ModelSpecFactory, userFactory } from '../factory';
import { ChemicalTreatmentEmployeeController } from '../models/controllers/chemicalTreatmentEmployee.controller';

// ** Test Function
describe('Test Chemical Treatment', () => {
    before(async () => {
        await commonTestSetupAction();
    });
    after(async () => {
        await commonTestTearDownAction();
        return;
    });

    it('should fetch pesticide employer codes', async () => {
        // Fetch Random
        const code: PesticideEmployerCode = await PesticideEmployerCodeController.shared.random();
        should().exist(code);
        should().exist(code.pesticide_employer_code_id);
        should().exist(code.businessName);
        should().exist(code.registrationNumber);
        should().exist(code.licenceExpiryDate);
    });

    it('should fetch pmp codes', async () => {
        const code: ProjectManagementPlanCode = await ProjectManagementPlanCodeController.shared.random();
        should().exist(code);
        should().exist(code.project_management_plan_code_id);
        should().exist(code.pmpNumber);
        should().exist(code.description);
        should().exist(code.pmpHolder);
        should().exist(code.startDate);
        should().exist(code.endDate);
    });

    it('should fetch chemical treatment employee', async () => {
        const code: ChemicalTreatmentEmployee = await ChemicalTreatmentEmployeeController.shared.random();
        should().exist(code);
        should().exist(code.chemical_treatment_employee_id);
        should().exist(code.certificate);
        should().exist(code.firstName);
        should().exist(code.lastName);
    });

    it('should create/fetch chemical treatment Object', async () => {
        const obj: ChemicalTreatment = await ModelFactory(ChemicalTreatmentController.shared)();
        should().exist(obj);
        should().exist(obj.chemical_treatment_id);
        expect(typeof obj.chemical_treatment_id).to.be.equal(typeof 1);
        const ch = await ChemicalTreatmentController.shared.findById(obj.chemical_treatment_id);
        should().exist(ch);
        expect(ch.chemical_treatment_id).to.be.equal(obj.chemical_treatment_id);
        expect(ch.speciesAgency);
        expect(ch.pesticideEmployer);
        expect(ch.pmp);
        expect(ch.firstApplicator);
        expect(ch.secondApplicator);
        await Destroyer(ChemicalTreatmentController.shared)(obj);
    });

    it('should create chemical treatment Object', async () => {
        const obj: ChemicalTreatmentSpec = await ModelSpecFactory(ChemicalTreatmentController.shared)();
        obj.secondApplicator = await ChemicalTreatmentEmployeeController.shared.findById(3);
        const chObj: ChemicalTreatment = await ChemicalTreatmentController.shared.createNewObject(obj, await userFactory());
        const ch: ChemicalTreatment = await ChemicalTreatmentController.shared.findById(chObj.chemical_treatment_id);
        expect(ch.chemical_treatment_id).to.be.equal(chObj.chemical_treatment_id);
        expect(ch.firstApplicator.chemical_treatment_employee_id).to.be.equal(chObj.firstApplicator.chemical_treatment_employee_id);
        expect(ch.secondApplicator.chemical_treatment_employee_id).to.be.equal(chObj.secondApplicator.chemical_treatment_employee_id);
        await Destroyer(ChemicalTreatmentController.shared)(ch);
    });

});

// ------------------------------------------------------------
