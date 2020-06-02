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
 * File: admin.ops.ts
 * Project: lucy
 * File Created: Tuesday, 2nd June 2020 6:55:20 pm
 * Author: Pushan
 * -----
 * Last Modified: Tuesday, 2nd June 2020 6:55:32 pm
 * Modified By: Pushan
 * -----
 */
/**
 * Imports
 */
import * as assert from 'assert';
import * as minimist from 'minimist';
import { SharedDBManager } from '../sources/database';
import {
    UserDataController,
    RoleCodeController,
    RolesCodeValue,
    RolesCode,
    RequestAccess,
    RequestAccessController,
    RequestStatus
} from '../sources/database/models';

/**
 * @description Main Script method. The scripts will assign a new role to user
 * @option email | e : User email OR idr | i : User Idr OR bcid | b: User Bcid
 * @option role | r : RoleCodeValue (ADM, DAV, DAE, I_OFFICER, I_ADM)
 */
(async () => {

    // Connect Database
    await SharedDBManager.connect();

    try {
        // Get options
        const options: any = minimist(process.argv.slice(2));

        // Get user email
        const email = options.email || options.e;
        // Idr
        const idr = options.idr || options.i;
        // BCID
        const bcid = options.bcid || options.b;
        // Assert
        assert(email || idr || bcid, `Error: Please enter a user email/idr/bcid`);
        // Create query filter
        const filter = email ? { email: email } : ( idr ? { preferredUsername: idr} : { preferredUsername: bcid});
        // Get user
        const user = await UserDataController.shared.fetchOne(filter);
        assert(user, `Error: Unable to find user with filter: ${JSON.stringify(filter, null, 2)}`);
        // Get root user
        const root = await UserDataController.shared.findById(1);
        assert(root, `Error: No Root User`);
        // Check user
        assert( user.user_id !== root.user_id, `Error: Updating root user role is prohibited`);
        // Get role
        const role: string = options.role || options.r;
        // Get Code
        const roleCodeKey: string = Object.keys(RolesCodeValue).filter( key => RolesCodeValue[key] === role)[0];
        const roleCodeValue: RolesCodeValue = RolesCodeValue[roleCodeKey];
        assert(roleCodeValue, `Error: No Role with code: ${role.toUpperCase()}`);
        // Get RoleCodeObject
        const roleCode: RolesCode = await RoleCodeController.shared.getCode(roleCodeValue);
        assert(roleCode, `Error: Unable to fetch role code ${roleCodeValue}`);
        // Now Assigned new role to user
        user.roles = [roleCode];
        // Save
        await UserDataController.shared.saveInDB(user);
        // Create Request Access
        const reqAccess: RequestAccess = new RequestAccess();
        reqAccess.requestedAccessCode = roleCode;
        reqAccess.approver = root;
        reqAccess.requester = root;
        reqAccess.status = RequestStatus.approved;
        reqAccess.requestNote = `Cloud Request`;
        reqAccess.approverNote = `Cloud Approve`;
        await RequestAccessController.shared.saveInDB(reqAccess);
        // Log
        console.log(`Success: Saved new role: ${roleCodeValue} of user ${email || idr || bcid} with request access \n${JSON.stringify(reqAccess, null, 2)}`);

        // Close DB
        await SharedDBManager.close();
        // Exit
        process.exit(0);

    } catch (excp) {
        // Logging error
        console.error(excp);
        // Close DB
        await SharedDBManager.close();
        // Exit with error
        process.exit(1);
    }
})();

