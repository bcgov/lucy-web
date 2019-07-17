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
 * File: test.spec.ts
 * Project: lucy
 * File Created: Wednesday, 17th July 2019 7:59:42 am
 * Author: pushan (you@you.you)
 * -----
 * Last Modified: Wednesday, 17th July 2019 7:59:47 am
 * Modified By: pushan (you@you.you>)
 * -----
 */
// This file contains some conceptual test
import * as _ from 'underscore';
import { expect } from 'chai';

describe('Conceptual tests', () => {
    it('should contains {x}', () => {
        const obj = { x: 'x', y: 'y'};
        expect(_.contains(obj, 'x')).to.be.equal(true);
        expect(_.contains(obj, 'z')).to.be.equal(false);
    });
});


// -----------------------------------------------------------
