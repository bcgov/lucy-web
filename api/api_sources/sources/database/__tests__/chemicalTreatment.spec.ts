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
    testModel,
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
    HerbicideTankMix,
    WindDirectionCodes,
    WindDirectionCodesController,
    ChemicalTreatmentMethodCode,
    ChemicalTreatmentMethodCodeController,
    UserDataController,
    User,
    ObservationChemicalTreatmentUpdateSpec,
    ChemicalTreatmentUpdateSpec,
} from '../models';
import {    ModelFactory,
            Destroyer,
            ModelSpecFactory,
            userFactory,
            chemicalTreatmentUpdateSpecFactory,
            observationChemicalTreatmentUpdateSpecFactory,
            chemicalTreatmentFactory,
            chemicalTreatmentCreateSpecFactory,
            destroyChemicalTreatment,
            Destroy,
        } from '../factory';
import { ChemicalTreatmentEmployeeController } from '../models/controllers/chemicalTreatmentEmployee.controller';
import {
    PesticideEmployerCodeSchema,
    ProjectManagementPlanCodeSchema,
    ChemicalTreatmentEmployeeSchema,
    ChemicalTreatmentSchema,
    HerbicideSchema,
    HerbicideTankMixSchema,
    ObservationChemicalTreatmentSchema,
    WindDirectionCodesSchema,
    ChemicalTreatmentMethodCodeSchema
} from '../database-schema';
import * as faker from 'faker';

// ** Test Function
describe('Test Chemical Treatment', () => {
    before(async () => {
        await commonTestSetupAction();
    });
    after(async () => {
        await commonTestTearDownAction();
        return;
    });
    // Test: Create Chemical Treatment from factory
    it('should create chemical treatment from factory', async () => {
        const f = await ModelFactory(ChemicalTreatmentController.shared)();
        should().exist(f);
        const ct: ChemicalTreatment = await ChemicalTreatmentController.shared.findById(f.chemical_treatment_id);
        should().exist(ct);
        should().exist(ct.date);
        should().exist(ct.primaryPaperFileReference);
        should().exist(ct.secondaryPaperFileReference);
        should().exist(ct.firstApplicator);
        should().exist(ct.secondApplicator);
        should().exist(ct.pup);
        should().exist(ct.temperature);
        should().exist(ct.humidity);
        should().exist(ct.windDirection);
        should().exist(ct.windSpeed);
        should().exist(ct.pesticideEmployer);
        should().exist(ct.speciesAgency);
        should().exist(ct.pmp);
        should().exist(ct.methodCode);
        should().exist(ct.mixDeliveryRate);
        should().exist(ct.tankMixes);
        should().exist(ct.speciesObservations);
        expect(ct.date).to.be.equal(f.date);
        expect(ct.primaryPaperFileReference).to.be.equal(f.primaryPaperFileReference);
        expect(ct.secondaryPaperFileReference).to.be.equal(f.secondaryPaperFileReference);
        expect(ct.firstApplicator.chemical_treatment_employee_id).to.be.equal(f.firstApplicator.chemical_treatment_employee_id);
        expect(ct.secondApplicator.chemical_treatment_employee_id).to.be.equal(f.secondApplicator.chemical_treatment_employee_id);
        expect(ct.pup).to.be.equal(f.pup);
        expect(ct.temperature).to.be.equal(f.temperature);
        expect(ct.humidity).to.be.equal(f.humidity);
        expect(ct.windDirection.wind_direction_code_id).to.be.equal(f.windDirection.wind_direction_code_id);
        expect(ct.windSpeed).to.be.equal(f.windSpeed);
        expect(ct.pesticideEmployer.pesticide_employer_code_id).to.be.equal(f.pesticideEmployer.pesticide_employer_code_id);
        expect(ct.speciesAgency.species_agency_code_id).to.be.equal(f.speciesAgency.species_agency_code_id);
        expect(ct.pmp.project_management_plan_code_id).to.be.equal(f.pmp.project_management_plan_code_id);
        expect(ct.methodCode.chemical_treatment_method_id).to.be.equal(f.methodCode.chemical_treatment_method_id);
        expect(ct.mixDeliveryRate).to.be.equal(f.mixDeliveryRate);
        expect(ct.tankMixes[0].herbicide_tank_mix_id).to.be.equal(f.tankMixes[0].herbicide_tank_mix_id);
        expect(ct.speciesObservations[0].observation.observation_id).to.be.equal(f.speciesObservations[0].observation.observation_id);
        await destroyChemicalTreatment(f);
    });

    // Test: Create Chemical Treatment with specification
    it('should create chemical treatment with spec', async () => {
        const f = await chemicalTreatmentCreateSpecFactory();
        const user = await userFactory();
        const obj = await ChemicalTreatmentController.shared.createNewObject(f, user);
        const ct = await ChemicalTreatmentController.shared.findById(obj.chemical_treatment_id);
        should().exist(ct);
        should().exist(ct.speciesObservations[0]);
        expect(ct.mixDeliveryRate).to.be.equal(f.mixDeliveryRate);
        await destroyChemicalTreatment(obj);
    });

    // Test: Update Chemical Treatment with specification
    it('should update chemical treatment with spec', async () => {
        const f = await chemicalTreatmentFactory();
        const user = await userFactory();
        const spec: ChemicalTreatmentUpdateSpec = await chemicalTreatmentUpdateSpecFactory();
        await ChemicalTreatmentController.shared.updateObject(f, spec, user);
        const ct = await ChemicalTreatmentController.shared.findById(f.chemical_treatment_id);
        should().exist(ct);
        should().exist(ct.mixDeliveryRate);
        should().exist(ct.speciesAgency);
        const updateSpeciesAgency = spec.speciesAgency || {species_agency_code_id: 0};
        expect(ct.speciesAgency.species_agency_code_id).to.be.equal(updateSpeciesAgency.species_agency_code_id);
        await destroyChemicalTreatment(f);
        await Destroy<User, UserDataController>(UserDataController.shared)(user);
    });

    it('should fetch all chemical treatments', async () => {
        const f = await chemicalTreatmentFactory();
        should().exist(f);
        const ctArray: ChemicalTreatment[] = await ChemicalTreatmentController.shared.all({});
        should().exist(ctArray);
        expect(ctArray.length).to.be.greaterThan(0);
        await destroyChemicalTreatment(f);
    });

    it('should create chemical treatment with spaceGeom factory', async () => {
        const ct: ChemicalTreatment = await ModelFactory(ChemicalTreatmentController.shared)();
        should().exist(ct);
        should().exist(ct.spaceGeom);
        const f: ChemicalTreatment = await ChemicalTreatmentController.shared.findById(ct.chemical_treatment_id);
        should().exist(f);
        should().exist(f.spaceGeom);
        expect(f.spaceGeom.space_geom_id).to.be.equal(ct.spaceGeom.space_geom_id);
    });

    it('should create chemical treatment with spaceGeom spec factory', async () => {
        const ct: any = await ModelSpecFactory(ChemicalTreatmentController.shared)();
        should().exist(ct);
        should().exist(ct.spaceGeom);
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

    it('should fetch wind-direction code', async () => {
        const code: WindDirectionCodes = await WindDirectionCodesController.shared.random();
        testModel(code, WindDirectionCodesSchema.shared);
    });

    it('should fetch chemical treatment method codes', async () => {
        const code: ChemicalTreatmentMethodCode = await ChemicalTreatmentMethodCodeController.shared.random();
        testModel(code, ChemicalTreatmentMethodCodeSchema.shared);
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

    it('should create ChemicalTreatmentMethodCodes schema', () => {
        const schema: ChemicalTreatmentMethodCodeSchema = new ChemicalTreatmentMethodCodeSchema();
        should().exist(schema);
        should().exist(schema.table.columnsDefinition.treatmentMethodDescription);
    });

    it('should fetch chemical treatment method codes from database', async () => {
        const ctmc: ChemicalTreatmentMethodCode = await ChemicalTreatmentMethodCodeController.shared.findById(1);
        should().exist(ctmc);
        expect(ctmc.chemical_treatment_method_id).to.be.equal(1);
        const random = await ChemicalTreatmentMethodCodeController.shared.random();
        should().exist(random);
    });

    it('should create WindDirectionCodes schema', () => {
        const schema: WindDirectionCodesSchema = new WindDirectionCodesSchema();
        should().exist(schema);
    });

    it('should fetch wind direction from database', async () => {
        const wd: WindDirectionCodes = await WindDirectionCodesController.shared.findById(1);
        should().exist(wd);
        expect(wd.wind_direction_code_id).to.be.equal(1);
        const random = await WindDirectionCodesController.shared.random();
        should().exist(random);
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

    it('should create/fetch ObservationChemicalTreatment Object', async () => {
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

    it('should update Observation reference in ObservationChemicalTreatment Object', async () => {
        const user = await userFactory();
        const spec: ObservationChemicalTreatmentUpdateSpec = await observationChemicalTreatmentUpdateSpecFactory();
        const f = await chemicalTreatmentFactory();
        should().exist(f);
        const update: any = { ...f};
        delete update.chemical_treatment_id;
        update.speciesObservations = [spec];
        await ChemicalTreatmentController.shared.updateObject(f, update, user);
        const ct = await ChemicalTreatmentController.shared.findById(f.chemical_treatment_id);
        should().exist(ct);
        should().exist(ct.mixDeliveryRate);
        should().exist(ct.speciesObservations);
        const l = ct.speciesObservations.length;
        const lastIndex = l > 0 ? l - 1 : 0;
        should().exist(ct.speciesObservations[lastIndex].observation_chemical_treatment_id);
        should().exist(ct.speciesObservations[lastIndex].treatmentAreaCoverage);
        expect(ct.speciesObservations[lastIndex].treatmentAreaCoverage).to.be.equal(spec.treatmentAreaCoverage);

        await destroyChemicalTreatment(f);
        await Destroy<User, UserDataController>(UserDataController.shared)(user);
    });

    it('should fetch tank mix for treatment', async () => {
        const obj: HerbicideTankMix = await ModelFactory(HerbicideTankMixController.shared)();
        should().exist(obj);
        should().exist(obj.chemicalTreatment);

        // Now fetch chemical treatment
        const ch: ChemicalTreatment = await ChemicalTreatmentController.shared.findById(obj.chemicalTreatment.chemical_treatment_id);
        should().exist(ch);
        should().exist(ch.tankMixes);
        expect(ch.tankMixes.length).to.be.greaterThan(0);
        await Destroyer(HerbicideTankMixController.shared)(obj);
    });

    it('should allow multiple tank mixes to be associated with the same treatment', async () => {
        const user = await userFactory();
        const treatment: ChemicalTreatment = await ModelFactory(ChemicalTreatmentController.shared)();
        const tm1: HerbicideTankMix = await ModelFactory(HerbicideTankMixController.shared)();
        const tm2: HerbicideTankMix = await ModelFactory(HerbicideTankMixController.shared)();
        should().exist(treatment);
        should().exist(treatment.tankMixes);
        should().exist(tm1);
        should().exist(tm2);
        const copy1: any = {...tm1};
        delete copy1.chemicalTreatment.chemical_treatment_id;
        copy1.chemicalTreatment.chemical_treatment_id = treatment.chemical_treatment_id;
        await HerbicideTankMixController.shared.updateObject(tm1, copy1, user);
        const copy2: any = {...tm2};
        delete copy2.chemicalTreatment.chemical_treatment_id;
        copy2.chemicalTreatment.chemical_treatment_id = tm1.chemicalTreatment.chemical_treatment_id;
        await HerbicideTankMixController.shared.updateObject(tm2, copy2, user);

        // push 2 tank mixes to treatment, update treatment
        const dup: any = { ...treatment};
        delete dup.chemical_treatment_id;
        dup.tankMixes.push(tm1);
        dup.tankMixes.push(tm2);
        await ChemicalTreatmentController.shared.updateObject(treatment, dup, user);

        // confirm tank mixes & treatment have been updated accordingly
        const ch: ChemicalTreatment = await ChemicalTreatmentController.shared.findById(treatment.chemical_treatment_id);
        should().exist(ch);
        should().exist(ch.tankMixes);
        // should be 3 because one tank mix already created by default when treatment is generated
        expect(ch.tankMixes.length).to.be.equal(3);
        expect(tm1.chemicalTreatment.chemical_treatment_id).to.be.equal(treatment.chemical_treatment_id);
        expect(tm2.chemicalTreatment.chemical_treatment_id).to.be.equal(treatment.chemical_treatment_id);
        expect(tm1.herbicide_tank_mix_id).to.not.equal(tm2.herbicide_tank_mix_id);

        await destroyChemicalTreatment(treatment);
        await Destroy<User, UserDataController>(UserDataController.shared)(user);
    });

    it('should fetch chemical treatment observation relation', async () => {
        const obj: ObservationChemicalTreatment = await ModelFactory(ObservationChemicalTreatmentController.shared)();
        should().exist(obj);
        should().exist(obj.chemicalTreatment);

        // Now fetch chemical treatment
        const ch: ChemicalTreatment = await ChemicalTreatmentController.shared.findById(obj.chemicalTreatment.chemical_treatment_id);
        should().exist(ch);
        should().exist(ch.speciesObservations);
        expect(ch.speciesObservations.length).to.be.greaterThan(0);
        await Destroyer(ObservationChemicalTreatmentController.shared)(obj);
    });

    it('should create chemical treatment spec with relation', async () => {
        const ct: any = await ModelSpecFactory(ChemicalTreatmentController.shared)();
        should().exist(ct);
        should().exist(ct.tankMixes);
        should().exist(ct.speciesObservations);
    });

    it('should create chemical treatment spec with space geom', async () => {
        const ct: ChemicalTreatmentSpec = await ModelSpecFactory(ChemicalTreatmentController.shared)();
        should().exist(ct);
        should().exist(ct.spaceGeom);
    });

    it('should create chemical treatment model with space geom', async() => {
        const c: ChemicalTreatment = await ModelFactory(ChemicalTreatmentController.shared)();
        should().exist(c);
        should().exist(c.spaceGeom);
        // Fetch
        const ct: ChemicalTreatment = await ChemicalTreatmentController.shared.findById(c.chemical_treatment_id);
        should().exist(ct);
        should().exist(ct.spaceGeom);
        expect(ct.spaceGeom.space_geom_id).to.be.equal(c.spaceGeom.space_geom_id);
    });

    it('should not allow creation of tank mix with herbicide_id that doesn\'t exist in Herbicides code table', async() => {
        const user = await userFactory();
        const htm: HerbicideTankMix = await ModelFactory(HerbicideTankMixController.shared)();
        should().exist(htm);
        should().exist(htm.herbicide);
        let herbId = htm.herbicide.herbicide_id;
        const dup: any = {...htm};
        should().exist(htm.herbicide);

        // we should never have a Herbicide with an id this large
        const bigNumber = faker.random.number({min: 30000, max: 999999});
        try {
            const fakeHerb: Herbicide = await HerbicideController.shared.findById(bigNumber);
            dup.herbicide = fakeHerb;
            should().not.exist(fakeHerb);
        } catch (e) {
            should().exist(e);
        }

        try {
            const update = await HerbicideTankMixController.shared.updateObject(htm, dup, user);
            expect(update).to.be.eqls(undefined);
        } catch (excp) {
            should().exist(excp);
        }

        expect(htm.herbicide.herbicide_id).to.not.equal(bigNumber);
        should().exist(htm.herbicide);
        should().exist(htm.herbicide.herbicide_id);
        herbId = htm.herbicide.herbicide_id;
        const h: Herbicide = await HerbicideController.shared.findById(herbId);
        should().exist(h);

        await Destroyer(HerbicideTankMixController.shared)(htm);
    });

    it('should not allow creation of chemical treatment without at least one species being treated', async() => {
        const user = await userFactory();
        const t: ChemicalTreatment = await ModelFactory(ChemicalTreatmentController.shared)();
        testModel(t, ChemicalTreatmentSchema.shared);
        delete t.speciesObservations;
        testModel(t, ChemicalTreatmentSchema.shared);
        try {
            ChemicalTreatmentController.shared.createNewObject(t, user);
        } catch (ex) {
            should().exist(ex);
        }

        await destroyChemicalTreatment(t);
    });

    it('should not allow update to chemical treatment without at least one species being treated', async() => {
        const user = await userFactory();
        const treatment: ChemicalTreatment = await ModelFactory(ChemicalTreatmentController.shared)();
        should().exist(treatment);
        const copy: any = {...treatment};
        copy.speciesObservations = [];
        expect(copy.speciesObservations.length).to.equal(0);
        try {
            const update = await ChemicalTreatmentController.shared.updateObject(treatment, copy, user);
            expect(update).to.be.eqls(undefined);
        } catch (excp) {
            should().exist(excp);
        }

        await destroyChemicalTreatment(treatment);
    });
});

// ------------------------------------------------------------
