//
// Static roles defined for the application users
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
// Created by Pushan Mitra on 2019-06-2.
/**
 * Exports
 */
export const DefaultLoginAccessCodes = [
    {
        role_code : 'ADM',
        role : 'Admin',
        description: 'Overall SEISM Access'
    },
    {
        role_code : 'DAV',
        role : 'Data Viewer',
        description: 'General data view access'
    },
    {
        role_code : 'DAE',
        role : 'Data Editor',
        description: 'General access'
    },
    {
        role_code : 'SUP',
        role : 'Super User',
        description: 'Lead admin for each of the taxonomic components'
    }
];

// -------------------------------------------------------------
