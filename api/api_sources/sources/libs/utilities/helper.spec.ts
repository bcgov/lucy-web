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
 * File: helper.spec.ts
 * Project: lucy
 * File Created: Tuesday, 23rd July 2019 1:43:32 pm
 * Author: pushan (you@you.you)
 * -----
 * Last Modified: Tuesday, 23rd July 2019 1:43:36 pm
 * Modified By: pushan (you@you.you>)
 * -----
 */
import { should, expect } from 'chai';
import { verifyObject } from './helpers.utilities';


describe('Test Helper/Utilities', () => {
    it(`should verify object's key`, () => {
        const obj = { x: 1, y: 2, z: 3};
        const r = verifyObject(obj, ['x', 'y', 'z'], 'obj');
        should().exist(r);
    });
    it(`should throw error while verifying object's key`, () => {
        const obj = { x: 1, y: 2};
        try {
            const r = verifyObject(obj, ['x', 'y', 'z'], 'obj');
            expect(r).to.be.eqls(undefined);
        } catch (excp) {
            console.log(`Exception: ${excp}`);
            should().exist(excp);
        }
    });
});
