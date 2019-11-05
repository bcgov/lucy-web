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
 * File: cmd.spec.ts
 * Project: lucy
 * File Created: Friday, 1st November 2019 4:11:54 pm
 * Author: pushan (you@you.you)
 * -----
 * Last Modified: Friday, 1st November 2019 4:12:34 pm
 * Modified By: pushan (you@you.you>)
 * -----
 */

import { should } from 'chai';
import { run } from './cmd';


describe('Test run', () => {
    it('should run', async () => {
        const r: any = await run('ls');
        console.dir(r);
        should().exist(r);
        const { stdout, stderr } = r;
        should().exist(stderr);
        should().exist(stdout);
    });
});
