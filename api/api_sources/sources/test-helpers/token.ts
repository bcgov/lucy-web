//
// Test token of users
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
// Created by Pushan Mitra on 2019-06-10.
/**
 * Imports
 */
import * as fs from 'fs';
import * as path from 'path';

/**
 * @description Getter: Admin token
 */
export const adminToken = (): string => {
    return fs.readFileSync(path.join(__dirname, '../test-resources/test.idr1.token'), 'utf8');
};

/**
 * @description Getter: viewer token
 */
export const viewerToken = (): string => {
    return fs.readFileSync(path.join(__dirname, '../test-resources/test.idr5.token'), 'utf8');
};

/**
 * @description Getter: editor token
 */
export const editorToken = (): string => {
    return fs.readFileSync(path.join(__dirname, '../test-resources/test.idr3.token'), 'utf8');
};

/**
 * @description Getter: idr3 token
 */
export const testIdr3Token = (): string => {
    return fs.readFileSync(path.join(__dirname, '../test-resources/test.idr3.token'), 'utf8');
};

/**
 * @description Getter: idr1 token
 */
export const testIdr1Token = (): string => {
    return fs.readFileSync(path.join(__dirname, '../test-resources/test.idr1.token'), 'utf8');
};

/**
 * @description Getter: idr2 token
 */
export const testIdr2Token = (): string => {
    return fs.readFileSync(path.join(__dirname, '../test-resources/test.idr2.token'), 'utf8');
};

/**
 * @description Getter: Mussel app admin
 */
export const inspectAppAdminToken = testIdr2Token;

export const inspectAppOfficerToken = (): string => {
    return fs.readFileSync(path.join(__dirname, '../test-resources/test.idr4.token'), 'utf8');
};
// -------------------------------------------------------------------------------------------

