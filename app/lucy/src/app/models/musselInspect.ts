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
 * File: musselInspect.ts
 * Project: lucy
 * File Created: Friday, 21st February 2020 9:12:36 am
 * Author: Williams, Andrea IIT (you@you.you)
 * -----
 * Last Modified: Friday, 21st February 2020 9:13:07 am
 * Modified By: Williams, Andrea IIT (you@you.you>)
 * -----
 */


export interface PreviousAISKnowledgeSource {
  previous_ais_knowledge_source_id: number;
  description: string;
}

export interface PreviousInspectionSource {
  previous_inspection_source_id: number;
  description: string;
}

export interface AdultMusselsLocation {
  adult_mussels_location_id: number;
  description: string;
}
