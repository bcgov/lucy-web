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
 * File: setup.ts
 * Project: lucy
 * File Created: Friday, 26th July 2019 11:22:11 am
 * Author: pushan
 * -----
 * Last Modified: Friday, 26th July 2019 11:22:17 am
 * Modified By: pushan
 * -----
 */

 /**
  * @description Script to run other build level setup
  */
 import { applicationTemFileDir } from '../sources/libs/utilities';
 (() => {
     // Create Temp dir
     applicationTemFileDir();
 })();
