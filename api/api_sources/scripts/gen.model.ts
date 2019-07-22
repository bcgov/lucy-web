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
 * File: gen.model.ts
 * Project: lucy
 * File Created: Wednesday, 17th July 2019 11:19:29 am
 * Author: pushan (you@you.you)
 * -----
 * Last Modified: Wednesday, 17th July 2019 11:19:38 am
 * Modified By: pushan (you@you.you>)
 * -----
 */
// import * as models from '../sources/database/models';
import * as schemas from '../sources/database/database-schema';
import { modelClassCreator } from './schema.model.gen';
(() => {
    // modelClassCreator(new schemas.SpeciesDistributionCodeSchema());
    // modelClassCreator(new schemas.SpeciesDensityCodeSchema());
    // modelClassCreator(new schemas.SurveyTypeCodeSchema());
    // modelClassCreator(new schemas.SpeciesAgencyCodeSchema());
    // modelClassCreator(new schemas.ObservationSpeciesSchema());
    // modelClassCreator(new schemas.SoilTextureCodeSchema());
    // modelClassCreator(new schemas.SurveyGeometryCodeSchema());
    modelClassCreator(new schemas.SpecificUseCodeSchema());
})();
