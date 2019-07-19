//
// Index to csv and other static preload data tables
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

import * as fs from 'fs';
import * as path from 'path';
import { CSV} from '../../libs/utilities';
export const getDataFilePath = (fileName: string) => path.resolve(__dirname, `./csv/${fileName}`);
export const getFileData = (fileName: string) => fs.readFileSync(getDataFilePath(fileName), 'utf8')
;

export interface SpeciesCSV {
    MapCode: string;
    edr: string;
    cmt: number;
    shp: number;
    Species: string;
    Genus: string;
    Common: string;
    Latin: string;
}

export interface Code {
    code: string;
    description: string;
}

export class CodeCSVData extends CSV<Code> {
    constructor(inputName: string) {
        super(getDataFilePath(inputName));
    }
}
export class SpeciesCSVData extends CSV<SpeciesCSV> {
    constructor() {
        super(getDataFilePath('Code_Tables_Species.csv'));
    }
}

export class JurisdictionCodeCSVData extends CSV<Code> {
    constructor() {
        super(getDataFilePath('Jurisdiction_Code.csv'));
    }
}

export class SpeciesDistributionCodeCSVData extends CSV<Code> {
    constructor() {
        super(getDataFilePath('SpeciesDistributionCode.csv'));
    }
}

export class SpeciesDensityCodeCSVData extends CSV<Code> {
    constructor() {
        super(getDataFilePath('SpeciesDensityCode.csv'));
    }
}


// ---------------------------------------------------------------------------------------------------
