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
 * File: inspectionDB.ts
 * Project: lucy
 * File Created: Thursday, 23rd January 2020 2:18:29 pm
 * Author: Pushan  (you@you.you)
 * -----
 * Last Modified: Thursday, 23rd January 2020 2:19:11 pm
 * Modified By: Pushan  (you@you.you>)
 * -----
 */
import { ViewEntity} from 'typeorm';

@ViewEntity({
    expression: `SELECT "watercraft_risk_assessment"."watercraft_risk_assessment_id" AS "id",
    "watercraft_risk_assessment"."timestamp" AS "timestamp",
    "watercraft_risk_assessment"."passport_holder_ind" AS "passportHolder",
    `
})
export class ViewWatercraftRiskAssessment {

}
// ------------------------------------------
