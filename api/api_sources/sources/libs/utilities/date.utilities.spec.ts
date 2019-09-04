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
 * File: date.utilities.spec.ts
 * Project: lucy
 * File Created: Friday, 30th August 2019 12:20:09 pm
 * Author: pushan (you@you.you)
 * -----
 * Last Modified: Friday, 30th August 2019 12:20:13 pm
 * Modified By: pushan (you@you.you>)
 * -----
 */
import { convertDateString } from './date.utilities';
import { expect, should } from 'chai';

describe('Test Date Utilities', () => {
    it('should convert date', () => {
        // 1. Date string
        const ds1 = '12-Apr-21';
        const f1 = 'DD-MMM-YY';
        const f2 = 'YYYY-MM-DD';
        const r1 = convertDateString(ds1, f1, f2);
        expect(r1).to.be.equal('2021-04-12');
        const ds2 = '01-Jan-19';
        const r2 = convertDateString(ds2, f1, f2);
        expect(r2).to.be.equal('2019-01-01');
    });
    it('should throw error for invalid input date', () => {
        try {
            const d = 'fgbfti';
            const f1 = 'DD-MMM-YY';
            const f2 = 'YYYY-MM-DD';
            const r1 = convertDateString(d, f1, f2);
            expect(r1).to.be.equal(undefined);
        } catch (excp) {
            should().exist(excp);
        }
    });
    it('should throw error for invalid input date formate', () => {
        try {
            const d = '12-Apr-19';
            const f1 = 'x980mn7';
            const f2 = 'YYYY-MM-DD';
            const r1 = convertDateString(d, f1, f2);
            expect(r1).to.be.equal(undefined);
        } catch (excp) {
            should().exist(excp);
        }
    });

    it('should throw error for invalid output date formate', () => {
        try {
            const d = '12-Apr-19';
            const f1 = 'DD-MMM-YY';
            const f2 = 'vtyuiop';
            const r1 = convertDateString(d, f1, f2);
            expect(r1).to.be.equal(undefined);
        } catch (excp) {
            should().exist(excp);
        }
    });
});
