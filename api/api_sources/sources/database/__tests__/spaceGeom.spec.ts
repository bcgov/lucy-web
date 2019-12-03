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
 * File: spaceGeom.spec.ts
 * Project: lucy
 * File Created: Thursday, 28th November 2019 12:58:36 pm
 * Author: Pushan  (you@you.you)
 * -----
 * Last Modified: Thursday, 28th November 2019 12:59:22 pm
 * Modified By: Pushan  (you@you.you>)
 * -----
 */
import {
    SpaceGeomSchema
} from '../database-schema';
import { expect, should } from 'chai';
import { commonTestSetupAction, commonTestTearDownAction, testModel } from '../../test-helpers/testHelpers';
import {
    SpaceGeom,
    SpaceGeomController
} from '../models';
import { ModelFactory } from '../factory';

describe('Test SpaceGeomSchema and SpaceGeom Data Model', () => {
    before(async () => {
        await commonTestSetupAction();
    });
    after(async () => {
        await commonTestTearDownAction();
    });

    it('should create schema object', () => {
        const s: SpaceGeomSchema = new SpaceGeomSchema();
        should().exist(s);
        expect(Object.keys(s.table.columnsDefinition).length).to.be.greaterThan(0);
    });

    it('should create space geom model from factory', async () => {
        const m: SpaceGeom = await ModelFactory(SpaceGeomController.shared)();
        should().exist(m);
        should().exist(m.space_geom_id);
    });

    it('should fetch space geom model', async () => {
        const m: SpaceGeom = await ModelFactory(SpaceGeomController.shared)();
        should().exist(m);
        const dbItem: SpaceGeom = await SpaceGeomController.shared.findById(m.space_geom_id);
        should().exist(dbItem);
        expect(dbItem.space_geom_id).to.be.equal(m.space_geom_id);
        expect(dbItem.geometry.observation_geometry_code_id).to.be.equal(m.geometry.observation_geometry_code_id);
        testModel(dbItem, SpaceGeomSchema.shared);
    });
});

// ------------------------
