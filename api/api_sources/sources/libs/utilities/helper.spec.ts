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
import {
    verifyObject,
    incrementalFileName,
    applicationTemFileDir,
    incrementalWrite,
    arrayToString,
    ifDefined,
    writeIfNotExists,
    reverseCapitalize,
    valueAtKeyPath,
    copyKeyAndSubKeys,
    capitalize,
    getHTTPReqQueryString,
    RandomizeSelection
} from './helpers.utilities';


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

    it('should return incremental file name', () => {
        const fileName = 'laba.gas.txt';
        const result = incrementalFileName(fileName, 123);
        expect(result).to.be.equal('laba.gas-123.txt');
    });

    it('should return application temp dir', () => {
        should().exist(applicationTemFileDir());
    });

    it('should incrementally write', () => {
        const filePath = `${applicationTemFileDir()}/test.${Date.now()}.txt`;
        const r1 = incrementalWrite(filePath, 'Lao 1');
        expect(r1).to.be.equal(filePath);
        const r2 = incrementalWrite(filePath, 'Lao 2');
        expect(r2).to.be.not.equal(filePath);
    });

    it('should return array string', () => {
        const array = [1, 2, 3];
        const string = arrayToString(array);
        should().exist(string);
        expect(string).to.be.equal('1,2,3');
    });

    it('should define', () => {
        const x = undefined;
        const y = ifDefined(x, 1);
        expect(y).to.be.equal(1);
        const z = ifDefined(y, 2);
        expect(z).to.be.equal(y);
    });

    it('should write to empty path', () => {
        const filePath = `${applicationTemFileDir()}/test.${Date.now()}.txt`;
        const r = writeIfNotExists(filePath, 'Laba is back');
        expect(r).to.be.equal(filePath);
        const nr = writeIfNotExists(filePath, 'Laba is back again');
        expect(nr).to.be.equal(null);
    });

    it ('should reverse capitalize string', () => {
        const value = 'Lao';
        const value2 = 'LaBa';
        expect(reverseCapitalize(value)).to.be.equal('lao');
        expect(reverseCapitalize(value2)).to.be.equal('laBa');
        expect(reverseCapitalize({})).to.be.equal('');
    });

    it('should fetch values', () => {
        const o = {
            x : {
                y: {
                    z: 100
                }
            }
        };
        expect(valueAtKeyPath(o, 'x.y.z')).to.be.equal(100);
    });

    it('should not fetch values', () => {
        const o = {};
        expect(valueAtKeyPath(o, 'x.y.z')).to.be.equal(undefined);
    });

    it('should copy key', () => {
        const x = { x: 'abc', y: { a: 'a', b: 'b', c: 'c'}};
        const y = { n: 'n', y: { l: 'l'}};
        copyKeyAndSubKeys('y', x, y);
        should().exist(y.y.l);
        should().exist(y.y['a']);
        should().exist(y.y['b']);
    });

    it('should copy key with subKeys', () => {
        const x = { x: 'abc', y: { a: 'a', b: 'b', c: 'c'}};
        const y = { n: 'n', y: { l: 'l'}};
        copyKeyAndSubKeys('y', x, y, ['a', 'b']);
        should().exist(y.y.l);
        should().exist(y.y['a']);
        should().exist(y.y['b']);
        should().not.exist(y.y['c']);
    });

    it('should capitalize string', () => {
        const string = 'helloWorld';
        expect(capitalize(string)).to.be.equal('HelloWorld');
    });

    it('should get url encoded string', () => {
        const obj = {
            x: 'x',
            y: 'y',
            z: '1.2',
            p: 'ESPG:4236'
        };
        const r = getHTTPReqQueryString(obj);
        expect(r).to.be.equal(`?x=x&y=y&z=1.2&p=ESPG%3A4236`);
    });

    it('should select random entry from array', () => {
        const array = ['BC', 'ALB', 'ONT'];
        const val = RandomizeSelection(array);
        should().exist(val);
        expect(array.includes(val)).to.be.equal(true);
    });

    it ('should select random entry from object', () => {
        const obj = {
            x: 'x',
            y: 'y'
        };
        const result: any = RandomizeSelection(obj);
        should().exist(result);
        expect(Object.keys(obj).includes(result.key)).to.be.equal(true);
        should().exist(obj[result.key]);
        expect(obj[result.key]).to.be.eql(result.value);
    });
});
