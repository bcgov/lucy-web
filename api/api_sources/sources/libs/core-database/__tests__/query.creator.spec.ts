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
 * File: query.creator.spec.ts
 * Project: lucy
 * File Created: Monday, 27th January 2020 2:48:17 pm
 * Author: Pushan  (you@you.you)
 * -----
 * Last Modified: Monday, 27th January 2020 2:48:25 pm
 * Modified By: Pushan  (you@you.you>)
 * -----
 */
import { should } from 'chai';
import { QueryCreator, QueryInfo } from '../core.query.creator';
import { Test2Schema } from './test.schema';
describe('Test for query Creator', () => {
    it('should create query', () => {
        const info: QueryInfo = {
            name: 'test',
            includesAllFields: true
        };
        const schema: Test2Schema = new Test2Schema();
        const query = QueryCreator.createQuery(schema, info);
        console.log(`Query: ${query}`);
        should().exist(query);
    });
});
// ---------------------------------
