//
// CSV Test class
//
// Copyright © 2019 Province of British Columbia
//
// Licensed under the Apache License, Version 2.0 (the "License");
// you may not use this file except in compliance with the License.
// You may obtain a copy of the License at
//
// http://www.apache.org/licenses/LICENSE-2.0
//
// Unless required by applicable law or agreed to in writing, software
// distributed under the License is distributed on an "AS IS" BASIS,
// WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
// See the License for the specific language governing permissions and
// limitations under the License.
//
// Created by Pushan Mitra on 2019-07-04.
import * as path from 'path';
import { should, expect} from 'chai';
import { CSV, GenericCSV } from './csv';

interface Test {
    name: string;
    age: number;
    work: string;
}

describe('Test CSV utility', () => {
    it('should load csv with header', async () => {
        const csvPath = path.resolve(__dirname, '../../test-resources/test.csv');
        const csv = new CSV<Test>(csvPath);
        should().exist(csv);
        expect(csv.filePath).to.equal(csvPath);
        const json: Test[]  = await csv.load();
        should().exist(json);
        expect(json.length).to.equal(3);
        const header = csv.headers;
        should().exist(header);
        expect(header).to.eql(['name', 'age', 'work']);
    });

    it('should load csv as generic csv loader', async () => {
        const csvPath = path.resolve(__dirname, '../../test-resources/test.csv');
        const csv =  new GenericCSV(csvPath);
        const json: any[] = await csv.load();
        should().exist(json);
        expect(json.length).to.equal(3);
        const header = csv.headers;
        should().exist(header);
        expect(header).to.eql(['name', 'age', 'work']);
    });
});

// --------------------------------------------------------------------
