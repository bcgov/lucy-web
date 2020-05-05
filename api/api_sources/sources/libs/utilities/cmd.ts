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
 * File: cmd.ts
 * Project: lucy
 * File Created: Friday, 1st November 2019 4:04:02 pm
 * Author: pushan (you@you.you)
 * -----
 * Last Modified: Friday, 1st November 2019 4:04:06 pm
 * Modified By: pushan (you@you.you>)
 * -----
 */
/**
 * Imports
 */
import * as util from 'util';
import { exec } from 'child_process';
const pExec = util.promisify(exec);
export const run = async (cmd: string) => await pExec(cmd);
// -------------------
