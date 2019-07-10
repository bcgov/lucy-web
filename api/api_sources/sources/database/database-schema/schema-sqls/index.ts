//
// Index to get sql string under this folder
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
// Created by Pushan Mitra on 2019-07-5.

import * as fs from 'fs';
import * as path from 'path';

export const getSQLFilePath = (fileName: string) => path.resolve(__dirname, `./${fileName}`);

export const getSQLFileData = (fileName: string) => fs.readFileSync(getSQLFilePath(fileName), 'utf8')
;
export const sampleSql = (): string => {
    const fileName = 'sample.sql';
    return fs.readFileSync(getSQLFilePath(fileName), 'utf8');
};

// ---------------------------------------------------------------------------------------------------
