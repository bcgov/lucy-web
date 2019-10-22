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
 * File: date.utilites.ts
 * Project: lucy
 * File Created: Friday, 30th August 2019 12:08:06 pm
 * Author: pushan (you@you.you)
 * -----
 * Last Modified: Friday, 30th August 2019 12:08:10 pm
 * Modified By: pushan (you@you.you>)
 * -----
 */
import * as moment from 'moment';

export const convertDateString = (dateString: string, inputFormat: string, outputFormat: string) => {
    // Getting moment object
    const date = moment(dateString, inputFormat);
    if (date.isValid()) {
        const next = date.format(outputFormat);
        return next;
    }
    throw new Error(`ConvertDateString: input is not proper formatted: input: ${dateString}, format:${inputFormat}`);
};
// ------------------------------------------------
