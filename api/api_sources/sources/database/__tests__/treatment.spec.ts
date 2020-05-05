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
 * File: treatment.spec.ts
 * Project: lucy
 * File Created: Monday, 12th August 2019 11:05:15 am
 * Author: pushan
 * -----
 * Last Modified: Monday, 12th August 2019 11:05:23 am
 * Modified By: pushan
 * -----
 */
/**
 * Imports
 */
import { expect, should } from 'chai';
import { commonTestSetupAction, commonTestTearDownAction } from '../../test-helpers/testHelpers';
import {
    mechanicalTreatmentFactory,
    destroyMechanicalTreatment,
    mechanicalTreatmentCreateSpecFactory,
    userFactory,
    mechanicalTreatmentUpdateSpecFactory,
    mechanicalMethodCodeFactory,
    mechanicalDisposalMethodCodeFactory,
    mechanicalSoilDisturbanceCodeFactory,
    mechanicalRootRemovalCodeFactory,
    mechanicalTreatmentIssuesCodeFactory,
    pesticideEmployerCodeFactory,
    chemicalTreatmentMethodCodeFactory,
    speciesAgencyCodeFactory,
    windDirectionCodeFactory,
    herbicideCodeFactory,
    observationFactory
} from '../factory';
import {
    MechanicalTreatmentController,
    MechanicalTreatment,
    User,
    UserDataController,
    MechanicalTreatmentUpdateSpec,
    ObservationController,
    Observation,
    MechanicalMethodCode,
    MechanicalDisposalMethodCode,
    MechanicalSoilDisturbanceCode,
    MechanicalRootRemovalCode,
    MechanicalTreatmentIssueCode,
    PesticideEmployerCode,
    ChemicalTreatmentMethodCode,
    WindDirectionCodes,
    Herbicide,
    SpeciesAgencyCode
} from '../models';
import {
    Destroy,
    ModelFactory,
    ModelSpecFactory
} from '../factory/helper';

describe('Treatment Test', () => {
    before(async () => {
        await commonTestSetupAction();
        // console.dir(MechanicalTreatmentController.shared.schemaObject.table.columnsDefinition);
        // console.dir(ObservationController.shared.schemaObject.table.columnsDefinition);
    });
    after(async () => {
        await commonTestTearDownAction();
        return;
    });

    // Test0: Test Code Factory
    it('should create code factories', async () => {
        const mm: MechanicalMethodCode = await mechanicalMethodCodeFactory();
        should().exist(mm);
        should().exist(mm.mechanical_method_code_id);
        const mdc: MechanicalDisposalMethodCode = await mechanicalDisposalMethodCodeFactory();
        should().exist(mdc);
        should().exist(mdc.mechanical_disposal_method_code_id);
        const sdc: MechanicalSoilDisturbanceCode = await mechanicalSoilDisturbanceCodeFactory();
        should().exist(sdc);
        const rrc: MechanicalRootRemovalCode = await mechanicalRootRemovalCodeFactory();
        should().exist(rrc);
        const issue: MechanicalTreatmentIssueCode = await mechanicalTreatmentIssuesCodeFactory();
        should().exist(issue);
        const pestEmp: PesticideEmployerCode = await pesticideEmployerCodeFactory();
        should().exist(pestEmp);
        const ctm: ChemicalTreatmentMethodCode = await chemicalTreatmentMethodCodeFactory();
        should().exist(ctm);
        const wdc: WindDirectionCodes = await windDirectionCodeFactory();
        should().exist(wdc);
        const hc: Herbicide = await herbicideCodeFactory();
        should().exist(hc);
        should().exist(hc.herbicide_id);
        const sac: SpeciesAgencyCode = await speciesAgencyCodeFactory();
        should().exist(sac);
    });

    // Test1: Create Treatment fro factory
    it('should create mechanical treatment from factory', async () => {
        const f = await ModelFactory(MechanicalTreatmentController.shared)();
        should().exist(f);
        const mt: MechanicalTreatment = await MechanicalTreatmentController.shared.findById(f.mechanical_treatment_id);
        should().exist(mt);
        should().exist(mt.speciesAgency);
        should().exist(mt.mechanicalMethod);
        should().exist(mt.mechanicalDisposalMethod);
        should().exist(mt.soilDisturbance);
        should().exist(mt.rootRemoval);
        should().exist(mt.issue);
        should().exist(mt.providerContractor);
        expect(mt.speciesAgency.species_agency_code_id).to.be.equal(f.speciesAgency.species_agency_code_id);
        expect(mt.mechanicalMethod.mechanical_method_code_id).to.be.equal(f.mechanicalMethod.mechanical_method_code_id);
        expect(mt.mechanicalDisposalMethod.mechanical_disposal_method_code_id).to.be.equal(f.mechanicalDisposalMethod.mechanical_disposal_method_code_id);
        expect(mt.soilDisturbance.mechanical_soil_disturbance_code_id).to.be.equal(f.soilDisturbance.mechanical_soil_disturbance_code_id);
        expect(mt.rootRemoval.mechanical_root_removal_code_id).to.be.equal(f.rootRemoval.mechanical_root_removal_code_id);
        expect(mt.issue.mechanical_treatment_issue_code_id).to.be.equal(f.issue.mechanical_treatment_issue_code_id);
        expect(mt.providerContractor.treatment_provider_contractor_id).to.be.equal(f.providerContractor.treatment_provider_contractor_id);
        await destroyMechanicalTreatment(f);
    });

    // Test2: Create Treatment with specification
    it('should create mechanical treatment with spec', async () => {
        const f = await mechanicalTreatmentCreateSpecFactory();
        const user = await userFactory();
        const obj = await MechanicalTreatmentController.shared.createNewObject(f, user);
        const mt = await MechanicalTreatmentController.shared.findById(obj.mechanical_treatment_id);
        should().exist(mt);
        await destroyMechanicalTreatment(obj);
    });

    // Test4: Create Treatment with specification
    it('should update mechanical treatment with spec', async () => {
        const f = await mechanicalTreatmentFactory();
        const user = await userFactory();
        const newObs = await observationFactory();
        const spec: MechanicalTreatmentUpdateSpec = await mechanicalTreatmentUpdateSpecFactory();
        spec.observations = [newObs];
        await MechanicalTreatmentController.shared.updateObject(f, spec, user);
        const mt = await MechanicalTreatmentController.shared.findById(f.mechanical_treatment_id);
        should().exist(mt);
        should().exist(mt.observations);
        const updatedObservation = mt.observations.find(observation => observation.observation_id === newObs.observation_id);
        should().exist(updatedObservation);
        await destroyMechanicalTreatment(f);
        await Destroy<User, UserDataController>(UserDataController.shared)(user);
    });

    // Test5: Fetch Mechanical Treatments of observation
    it('should fetch MechanicalTreatment for observation with promise', async () => {
        const f = await mechanicalTreatmentFactory();
        should().exist(f);
        const obs = f.observations[0];
        should().exist(obs);
        let list: MechanicalTreatment[] = await obs.mechanicalTreatmentsFetcher;
        list = list.filter( t => t.mechanical_treatment_id === f.mechanical_treatment_id);
        expect(list.length).to.be.equal(1);
        await destroyMechanicalTreatment(f);
    });

    // Test6: Fetch Mechanical Treatments of observation
    it('should fetch MechanicalTreatment for observation through prop', async () => {
        const f = await mechanicalTreatmentFactory();
        should().exist(f);
        const obs = f.observations[0];
        const fetchObs: Observation = await ObservationController.shared.findById(obs.observation_id);
        should().exist(fetchObs);
        let list: MechanicalTreatment[] = fetchObs.mechanicalTreatments || [];
        list = list.filter( t => t.mechanical_treatment_id === f.mechanical_treatment_id);
        expect(list.length).to.be.equal(1);
        await destroyMechanicalTreatment(f);
    });

    it('should fetch treatment all', async () => {
        const f = await mechanicalTreatmentFactory();
        should().exist(f);
        const mtArray: MechanicalTreatment[] = await MechanicalTreatmentController.shared.all({});
        should().exist(mtArray);
        expect(mtArray.length).to.be.greaterThan(0);
        await destroyMechanicalTreatment(f);
    });

    it('should create mechanical treatment with spaceGeom factory', async () => {
        const mt: MechanicalTreatment = await ModelFactory(MechanicalTreatmentController.shared)();
        should().exist(mt);
        should().exist(mt.spaceGeom);
        const f: MechanicalTreatment = await MechanicalTreatmentController.shared.findById(mt.mechanical_treatment_id);
        should().exist(f);
        should().exist(f.spaceGeom);
        expect(f.spaceGeom.space_geom_id).to.be.equal(mt.spaceGeom.space_geom_id);
    });

    it('should create mechanical treatment with spaceGeom spec factory', async () => {
        const mt: any = await ModelSpecFactory(MechanicalTreatmentController.shared)();
        should().exist(mt);
        should().exist(mt.spaceGeom);
    });
});
// ----------------------------------------------------------------------------------------
