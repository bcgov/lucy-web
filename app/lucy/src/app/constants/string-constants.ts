/**
 *  Copyright © 2019 Province of British Columbia
 *
 *  Licensed under the Apache License, Version 2.0 (the "License");
 *  you may not use this file except in compliance with the License.
 *  You may obtain a copy of the License at
 *
 *  http://www.apache.org/licenses/LICENSE-2.0
 *
 * 	Unless required by applicable law or agreed to in writing, software
 * 	distributed under the License is distributed on an "AS IS" BASIS,
 * 	WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * 	See the License for the specific language governing permissions and
 * 	limitations under the License.
 *
 * 	Created by Amir Shayegh on 2019-10-23.
 */
export const StringConstants = {

    //////////////////////////////////////////////////////////
    // Strings for UI
    app_Title: (() => {
        return 'InvasivesBC';
    })(),

    database_Title: (() => {
        return 'InvasivesBC Database';
    })(),
    //////////////////////////////////////////////////////////

    /** DB Access Related text **/

    // Badges for access types
    databaseAccess_View_Badge: (() => {
        return 'View Only Database Access';
    })(),

    databaseAccess_DataEntry_Badge: (() => {
        return 'Data Entry Access';
    })(),

    databaseAccess_Admin_Badge: (() => {
        return 'Admin Access';
    })(),
    ////////////////////////////////////////////
    // Badges for access types
    databaseAccess_View_Desc: (() => {
        return 'View Only Database Access';
    })(),

    databaseAccess_DataEntry_Desc: (() => {
        return 'You are now have Data Editor database access. You are now able to add observations.';
    })(),

    databaseAccess_Admin_Desc: (() => {
        return 'Admin Access';
    })(),
    ////////////////////////////////////////////

    // Request Data entry access dialog
    databaseAccess_requestDataEntryAccess_Message: (() => {
        return 'if you or your organization need to be able to edit data you will need to request access to the relevant database. You can adjust your access settings in the profile management screen.';
    })(),

    databaseAccess_requestDataEntryAccess_Title: (() => {
        return 'Need Data Entry Access?';
    })(),
    ////////////////////////////////////////////



}