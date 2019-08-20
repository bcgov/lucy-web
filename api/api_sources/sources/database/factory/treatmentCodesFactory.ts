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
 * File: treatmentCodesFactory.ts
 * Project: lucy
 * File Created: Thursday, 15th August 2019 11:00:29 am
 * Author: pushan (you@you.you)
 * -----
 * Last Modified: Thursday, 15th August 2019 11:00:36 am
 * Modified By: pushan (you@you.you>)
 * -----
 */
/**
 * Imports
 */

import { CodeFactory } from './helper';
import { MechanicalMethodCodeController, MechanicalMethodCode } from '../models';

/**
 * @description Mechanical Method Code Factory
 * @returns Promise<MechanicalMethodCode>
 */
export const mechanicalMethodCodeFactory = CodeFactory<MechanicalMethodCode, MechanicalMethodCodeController>(MechanicalMethodCodeController.shared);
// ----------------------------------------------------------------
