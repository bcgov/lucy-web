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
 * File: mailer.spec.ts
 * Project: lucy
 * File Created: Thursday, 5th March 2020 1:36:57 am
 * Author: Pushan  (you@you.you)
 * -----
 * Last Modified: Thursday, 5th March 2020 2:29:28 am
 * Modified By: Pushan  (you@you.you>)
 * -----
 */

/**
 * Imports
 */
import {should} from 'chai';
import { Mailer } from './mailer';

describe('Test Mailer', () => {
    it('should send mail', async () => {
        const mailer = new Mailer();
        const i = await mailer.send({
            to: process.env.APP_EMAIL_TEST_RECEIVER,
            from: Mailer.sender,
            text: 'Test Email from InvasivesBC',
            subject: 'InvasivesBC'
        });
        should().exist(i);
    });
});
