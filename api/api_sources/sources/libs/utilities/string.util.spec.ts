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
 * File: string.util.spec.ts
 * Project: lucy
 * File Created: Thursday, 14th November 2019 2:11:34 pm
 * Author: pushan (you@you.you)
 * -----
 * Last Modified: Thursday, 14th November 2019 2:11:39 pm
 * Modified By: pushan (you@you.you>)
 * -----
 */
import { expect } from 'chai';
import { splitCamelCase, splitCamelCaseInLower, camelToSnakeCase, snakeToCamelCase } from './string.util';
describe('Test string utility', () => {
    it('should split camel case string', () => {
        const ip = 'thisIsAwesome';
        const r = splitCamelCase(ip);
        expect(r.length).to.be.equal(3);
        expect(r[0]).to.be.equal('this');
        expect(r[1]).to.be.equal('Is');
        expect(r[2]).to.be.equal('Awesome');
    });

    it('should split to lower case', () => {
        const ip = 'thisIsAwesome';
        const r = splitCamelCaseInLower(ip);
        expect(r.length).to.be.equal(3);
        expect(r[0]).to.be.equal('this');
        expect(r[1]).to.be.equal('is');
        expect(r[2]).to.be.equal('awesome');
    });

    it('should convert camel to snake case', () => {
        const ip = 'thisIsAwesome';
        const r = camelToSnakeCase(ip);
        expect(r).to.be.equal('this_is_awesome');
    });

    it('should convert camel to snake case', () => {
        const ip = 'ThisIsAwesome';
        const r = camelToSnakeCase(ip);
        expect(r).to.be.equal('this_is_awesome');
    });

    it('should convert snake to camel case', () => {
        const ip = 'this_is_awesome';
        const r = snakeToCamelCase(ip);
        expect(r).to.be.equal('thisIsAwesome');
    });
});
// --------------
