//
// Test for preload csv data
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
// Created by Pushan Mitra on 2019-07-08.
import { should} from 'chai';
import { SpeciesCSVData, JurisdictionCodeCSVData } from './csv.data';
describe('Test csv data utility', () => {
    it('should load Species CSV data', async () => {
        const data = new SpeciesCSVData();
        await data.load();
        should().exist(data.headers);
        should().exist(data.json);
    });

    it('should load JurisdictionCode CSV Data', async () => {
        const data = new JurisdictionCodeCSVData();
        await data.load();
        should().exist(data.headers);
        should().exist(data.json);
    });
});
// ---------------------------------------------------------------------------------------
