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
import { ObjectLiteral } from 'typeorm';

const csvDirName = 'resources/csv';
export const getDataFilePath = (fileName: string) => path.resolve(__dirname, `../../../${csvDirName}/${fileName}`);
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

export interface ContractorCSV extends ObjectLiteral {
    registration_number: number;
    business_name: string;
    license_expiry_date: string;
}

export interface TreatmentProviderCSV extends ContractorCSV {
    registration_number: number;
    business_name: string;
    category: string;
    address: string;
    region_operation: string;
    license_expiry_date: string;
    service_provide_ind: string;
}

export interface ProjectManagementPlanCSV {
    pmp_number: string;
    description: string;
    pmp_holder: string;
    legal_start_date: string;
    legal_end_date: string;
}

export interface ChemicalTreatmentEmployeeCSV {
    certificate: string;
    first_name: string;
    last_name: string;
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

export class TreatmentProviderCSVData extends CSV<TreatmentProviderCSV> {
    constructor() {
        super(getDataFilePath('TreatmentProvider.csv'));
    }
}

export class PesticideEmployerCSVData extends CSV<ContractorCSV> {
    constructor() {
        super(getDataFilePath('PesticideEmployerCode.csv'));
    }
}

export class ProjectManagementPlanCSVData extends CSV<ProjectManagementPlanCSV> {
    constructor() {
        super(getDataFilePath('ProjectManagementCode.csv'));
    }
}

export class ChemicalTreatmentEmployeeCSVData extends CSV<ChemicalTreatmentEmployeeCSV> {
    constructor() {
        super(getDataFilePath('ChemicalTreatmentEmployee.csv'));
    }
}

// ---------------------------------------------------------------------------------------------------
