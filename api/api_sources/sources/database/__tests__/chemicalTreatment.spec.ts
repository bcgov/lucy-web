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
import {
    commonTestSetupAction,
    commonTestTearDownAction,
    testModel
} from '../../test-helpers/testHelpers';
import {
    ChemicalTreatment,
    ChemicalTreatmentController,
    PesticideEmployerCode,
    PesticideEmployerCodeController,
    ProjectManagementPlanCode,
    ProjectManagementPlanCodeController,
    ChemicalTreatmentEmployee,
    ChemicalTreatmentSpec,
    Herbicide,
    HerbicideController,
    ObservationChemicalTreatment,
    ObservationChemicalTreatmentSpec,
    ObservationChemicalTreatmentController,
    HerbicideTankMixController,
    HerbicideTankMix
} from '../models';
import { ModelFactory, Destroyer, ModelSpecFactory, userFactory } from '../factory';
import { ChemicalTreatmentEmployeeController } from '../models/controllers/chemicalTreatmentEmployee.controller';
import {
    PesticideEmployerCodeSchema,
    ProjectManagementPlanCodeSchema,
    ChemicalTreatmentEmployeeSchema,
    ChemicalTreatmentSchema,
    HerbicideSchema,
    HerbicideTankMixSchema,
    ObservationChemicalTreatmentSchema,
} from '../database-schema';

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
        testModel(code, PesticideEmployerCodeSchema.shared);
    });

    it('should fetch pmp codes', async () => {
        const code: ProjectManagementPlanCode = await ProjectManagementPlanCodeController.shared.random();
        testModel(code, ProjectManagementPlanCodeSchema.shared);
    });

    it('should fetch chemical treatment employee', async () => {
        const code: ChemicalTreatmentEmployee = await ChemicalTreatmentEmployeeController.shared.random();
        testModel(code, ChemicalTreatmentEmployeeSchema.shared);
    });

    it('should create/fetch chemical treatment Object', async () => {
        const obj: ChemicalTreatment = await ModelFactory(ChemicalTreatmentController.shared)();
        testModel(obj, ChemicalTreatmentSchema.shared);
        const ch = await ChemicalTreatmentController.shared.findById(obj.chemical_treatment_id);
        should().exist(ch);
        testModel(ch, ChemicalTreatmentSchema.shared);
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

    it('should create Herbicide schema', () => {
        const schema: HerbicideSchema = new HerbicideSchema();
        should().exist(schema);
        should().exist(schema.table.columnsDefinition.compositeName);
    });

    it('should fetch herbicide from database', async () => {
        const herbicide: Herbicide = await HerbicideController.shared.findById(1);
        should().exist(herbicide);
        expect(herbicide.herbicide_id).to.be.equal(1);
        const random = await HerbicideController.shared.random();
        should().exist(random);
    });

    it('should create HerbicideTankMixSchema', () => {
        const htms = new HerbicideTankMixSchema();
        should().exist(htms);
    });

    it('should create/fetch HerbicideTankMix Object', async () => {
        const obj: HerbicideTankMix = await ModelFactory(HerbicideTankMixController.shared)();
        should().exist(obj);
        testModel(obj, HerbicideTankMixSchema.shared);
    });

    it('should create HerbicideTankMix Object', async() => {
        const htmObj: HerbicideTankMix = await ModelFactory(HerbicideTankMixController.shared)();
        const htm: HerbicideTankMix = await HerbicideTankMixController.shared.findById(htmObj.herbicide_tank_mix_id);
        expect(htm.herbicide_tank_mix_id).to.be.equal(htmObj.herbicide_tank_mix_id);
        expect(htm.applicationRate).to.be.equal(htmObj.applicationRate);
        expect(htm.dilutionRate).to.be.equal(htmObj.dilutionRate);
        await Destroyer(HerbicideTankMixController.shared)(htm);
    });

    it('should create SpeciesTreatmentSchema', () => {
        const sts = new ObservationChemicalTreatmentSchema();
        should().exist(sts);
    });

    it('should create/fetch SpeciesTreatment Object', async () => {
        const obj: ObservationChemicalTreatment = await ModelFactory(ObservationChemicalTreatmentController.shared)();
        testModel(obj, ObservationChemicalTreatmentSchema.shared);
        const st = await ObservationChemicalTreatmentController.shared.findById(obj.observation_chemical_treatment_id);
        should().exist(st);
        testModel(st, ObservationChemicalTreatmentSchema.shared);
        await Destroyer(ObservationChemicalTreatmentController.shared)(obj);
    });

    it('should create ObservationChemicalTreatment Object', async () => {
        const obj: ObservationChemicalTreatmentSpec = await ModelSpecFactory(ObservationChemicalTreatmentController.shared)();
        const stObj: ObservationChemicalTreatment = await ObservationChemicalTreatmentController.shared.createNewObject(obj, await userFactory());
        const st: ObservationChemicalTreatment = await ObservationChemicalTreatmentController.shared.findById(stObj.observation_chemical_treatment_id);
        expect(st.observation.observation_id).to.be.equal(stObj.observation.observation_id);
        await Destroyer(ObservationChemicalTreatmentController.shared)(st);
    });

});

// ------------------------------------------------------------
