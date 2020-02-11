// /*
//  * Copyright © 2019 Province of British Columbia
//  * Licensed under the Apache License, Version 2.0 (the "License")
//  * You may not use this file except in compliance with the License.
//  * You may obtain a copy of the License at
//  * **
//  * http://www.apache.org/licenses/LICENSE-2.0
//  * **
//  * Unless required by applicable law or agreed to in writing, software
//  * distributed under the License is distributed on an "AS IS" BASIS,
//  * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
//  * See the License for the specific language governing permissions and
//  * limitations under the License.
//  * File: monitorFactory.ts
//  * Project: lucy
//  * File Created: Tuesday, 21st January 2020 2:19:07 pm
//  * Author: Williams, Andrea IIT (you@you.you)
//  * -----
//  * Last Modified: Tuesday, 21st January 2020 2:19:29 pm
//  * Modified By: Williams, Andrea IIT (you@you.you>)
//  * -----
//  */

// /**
//   * Imports
//   */
 import { Destroy, ModelSpecFactory } from './helper';
 import { MechanicalMonitor,
   MechanicalMonitorController,
   MechanicalMonitorSpec,
   MechanicalMonitorUpdateSpec,
   User,
   UserDataController,
   MechanicalTreatment,
   MechanicalTreatmentController,
   EfficacyCodeController,
} from '../models';
 import { userFactory } from './userFactory';
 import { speciesAgencyCodeFactory } from './observationCodesFactory';
 import * as faker from 'faker';

/**
 * @description Factory to create mechanical monitoring spec.
 */
export const mechanicalMonitorCreateSpecFactory = async (): Promise<MechanicalMonitorSpec> => {
    return await ModelSpecFactory(MechanicalMonitorController.shared)();
  };

  /**
   * @description MechanicalMonitor factory
   */
  export const mechanicalMonitorFactory = async () => {
    const spec = await mechanicalMonitorCreateSpecFactory();
    return await MechanicalMonitorController.shared.createNewObject(spec, await userFactory());
  };

  /**
   * @description MechanicalMonitor factory obj destroyer
   */
  export const destroyMechanicalMonitor = Destroy<MechanicalMonitor, MechanicalMonitorController>(MechanicalMonitorController.shared, async (obj: MechanicalMonitor) => {
    if (obj.createdBy) {
      await Destroy<User, UserDataController>(UserDataController.shared)(obj.createdBy);
    }
    if (obj.mechanicalTreatmentID) {
      await Destroy<MechanicalTreatment, MechanicalTreatmentController>(MechanicalTreatmentController.shared)(obj.mechanicalTreatmentID);
    }
  });

  export const mechanicalMonitorUpdateSpecFactory = async (): Promise<MechanicalMonitorUpdateSpec> => {
    return {
      speciesAgency: (await speciesAgencyCodeFactory()),
      efficacy: (await EfficacyCodeController.shared.findById(faker.random.number({min: 1, max: 12})))
    };
  };
  // ------------------------------------------------------------

