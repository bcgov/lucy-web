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
 * File: observation.spec.ts
 * Project: lucy
 * File Created: Friday, 12th July 2019 3:38:46 pm
 * Author: pushan (you@you.you)
 * -----
 * Last Modified: Friday, 12th July 2019 3:39:05 pm
 * Modified By: pushan (you@you.you>)
 * -----
 */

import { expect, should } from 'chai';
import { commonTestSetupAction, commonTestTearDownAction, testModel } from '../../test-helpers/testHelpers';
import {
    observationFactory,
    speciesAgencyCodeFactory,
    observationTypeCodeFactory,
    soilTextureCodeFactory,
    observerGeometryCodeFactory,
    specificUseCodeFactory,
    slopeCodeFactory,
    aspectCodeFactory,
    proposedActionCodeFactory,
    ModelFactory,
    Destroyer
} from '../factory';
import {
    Observation,
    ObservationController
} from '../models';
import {
    speciesDensityCodeFactory,
    speciesDistributionCodeFactory
} from '../factory';
import {
    ObservationSchema,
    SpeciesDensityCodeSchema,
    SpeciesDistributionCodeSchema,
    SpeciesAgencyCodeSchema,
    ObservationTypeCodeSchema,
    SoilTextureCodeSchema,
    ObservationGeometryCodeSchema,
    SpecificUseCodeSchema,
    SlopeCodeSchema,
    AspectCodeSchema,
    ProposedActionCodeSchema
} from '../database-schema';

describe('Observation tests', () => {
    before(async () => {
        await commonTestSetupAction();
    });
    after(async () => {
        await commonTestTearDownAction();
        return;
    });

    it('should create/fetch observation', async () => {
        const f = await observationFactory();
        should().exist(f);
        should().exist(f.observation_id);
        const obs = await ObservationController.shared.findById(f.observation_id);
        should().exist(obs);
        testModel(obs, ObservationSchema.shared);
        // expect(obs.createdBy.user_id).to.equal(f.createdBy.user_id);
        // expect(obs.updatedBy.user_id).to.equal(f.updatedBy.user_id);
        expect(obs.observation_id).to.equal(f.observation_id);
        await Destroyer(ObservationController.shared)(f);
    });


    it('should fetch species density code', async () => {
        const code = await speciesDensityCodeFactory(2);
        testModel(code, SpeciesDensityCodeSchema.shared);
        expect(code.species_density_code_id).to.be.equals(2);
    });

    it('should fetch species density code', async () => {
        const code = await speciesDistributionCodeFactory(2);
        testModel(code, SpeciesDistributionCodeSchema.shared);
        expect(code.species_distribution_code_id).to.be.equals(2);
    });

    it('should fetch species agency code', async () => {
        const code = await speciesAgencyCodeFactory(2);
        testModel(code, SpeciesAgencyCodeSchema.shared);
        expect(code.species_agency_code_id).to.be.equals(2);
    });

    it('should fetch species observation type code', async () => {
        const code = await observationTypeCodeFactory(2);
        testModel(code, ObservationTypeCodeSchema.shared);
        expect(code.observation_type_code_id).to.be.equals(2);
    });

    it('should fetch soil texture code', async () => {
        const code = await soilTextureCodeFactory(2);
        testModel(code, SoilTextureCodeSchema.shared);
        expect(code.soil_texture_code_id).to.be.equals(2);
    });

    it('should fetch survey geometry code', async () => {
        const code = await observerGeometryCodeFactory(2);
        testModel(code, ObservationGeometryCodeSchema.shared);
        expect(code.observation_geometry_code_id).to.be.equals(2);
    });

    it('should fetch specific use code', async () => {
        const code = await specificUseCodeFactory(2);
        testModel(code, SpecificUseCodeSchema.shared);
        expect(code.specific_use_code_id).to.be.equals(2);
    });

    it('should fetch slope code', async () => {
        const code = await slopeCodeFactory(3);
        testModel(code, SlopeCodeSchema.shared);
        expect(code.observation_slope_code_id).to.be.equal(3);
    });

    it('should fetch aspect code', async () => {
        const code = await aspectCodeFactory(3);
        testModel(code, AspectCodeSchema.shared);
        expect(code.observation_aspect_code_id).to.be.equal(3);
    });

    it('should fetch proposed action code', async () => {
        const code = await proposedActionCodeFactory(2);
        testModel(code, ProposedActionCodeSchema.shared);
        expect(code.observation_proposed_action_code_id).to.be.equal(2);
    });

    it('should associate model spaceGeom', async () => {
        // Create
        const observation: Observation = await ModelFactory(ObservationController.shared)();
        should().exist(observation);
        should().exist(observation.spaceGeom);
        // Fetch
        const obs: Observation = await ObservationController.shared.findById(observation.observation_id);
        should().exist(obs);
        expect(obs.observation_id).to.be.equal(observation.observation_id);
        should().exist(obs.spaceGeom);
        expect(obs.spaceGeom.space_geom_id).to.be.equal(observation.spaceGeom.space_geom_id);
        await Destroyer(ObservationController.shared)(observation);

    });
});

// -------------------------------------------------------------
