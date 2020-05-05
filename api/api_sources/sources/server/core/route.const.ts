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
 * File: route.info.ts
 * Project: lucy
 * File Created: Monday, 26th August 2019 9:41:04 am
 * Author: pushan
 * -----
 * Last Modified: Monday, 26th August 2019 9:41:07 am
 * Modified By: pushan
 * -----
 */
import { DataController} from '../../database/data.model.controller';

export interface ValidationBypass {
    skipForCreate?: boolean;
    skipForUpdate?: boolean;
    skipForRead?: boolean;
}

export interface ResourceInfo {
    dataController: DataController;
    path?: string;
    description?: string;
    secure?: boolean;
    users?: any[];
    validationBypass?: ValidationBypass;
    validators?: () => any[];
    middleware?: () => any[];
    createMiddleware?: () => any[];
    updateMiddleware?: () => any[];
    viewMiddleware?: () => any[];
    dependency?: () => any[];
}

// ----------------------------------------------------------------------
