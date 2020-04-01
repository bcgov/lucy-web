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
 * File: upload.route.ts
 * Project: lucy
 * File Created: Tuesday, 25th February 2020 3:15:48 am
 * Author: Pushan  (you@you.you)
 * -----
 * Last Modified: Tuesday, 25th February 2020 3:16:35 am
 * Modified By: Pushan  (you@you.you>)
 * -----
 */
import * as fs from 'fs';
import * as assert from 'assert';
import * as multer from 'multer';
import {
    RouteController,
    ResourceRoute,
    Post,
    inspectAppEditorRoute
} from '../../core';
import { UserDataController, User } from '../../../database/models';
import { Mail, Mailer } from '../../../libs/utilities';
import AppConfig from '../../../AppConfig';


/**
 * @description File Upload route handler
 */
@ResourceRoute({
    dataController: UserDataController.shared,
    secure: true
})
export class UploadRouteController extends RouteController {
    /**
     * @description Shared obj
     */
    static get shared(): UploadRouteController {
        return this.sharedInstance() as UploadRouteController;
    }



    @Post({
        path: '/report-issue',
        description: 'Upload file path for user',
        middleware: () => [ inspectAppEditorRoute(), UploadRouteController.uploadMiddleware]
    })
    public async report(req: any) {
        // Get user
        const user: User = req.user as User;
        // Read file object and file path
        const file: any = req.files[0];
        const filePath = file.path;
        // Assert if no file path
        assert(filePath, `No log file path created`);
        assert(AppConfig.reportReceivers, 'No receivers for report');
        // Check any message
        const body = req.body || {};
        const message = body.message as string || '';
        let text = `An issue is reported by user ${user.email}. Please check attached log for more details.`;
        if (message && message.length > 0) {
            text = `An issue is reported by user ${user.email}.\nMessage From User: ${message}\nPlease check attached log for more details.`;
        }
        // Create Mail
        const mail: Mail = {
            to: AppConfig.reportReceivers,
            from: Mailer.sender,
            subject: `InvasivesBC iOS Application Issue`,
            text: text,
            attachments: [
                {
                    filename: 'log.txt',
                    path: filePath
                }
            ]
        };
        // Sending mail
        let info: any = {};
        try {
            info = await Mailer.shared.send(mail, this.logger);
        } catch (excp) {
            this.logger.error(`report-issue: Caught error while sending email: ${excp}`);
        }
        // Remove file
        fs.unlinkSync(filePath);
        // Responding
        return [200, info];
    }

    /**
     * Private / Utilities
     */
    static get uploadMiddleware(): any {
        const storage = multer.diskStorage({
            destination: function (req: any, file: any, cb: Function) {
              cb(null, '../temp/uploads/issues');
            },
            filename: function (req: any, file: any, cb: Function) {
                const user: User = req.user;
                const uniqueSuffix = `${user.user_id}_${Date.now()}`;
                cb(null, uniqueSuffix + '_' + req.body.name);
            }
        });
        return multer({ storage: storage}).any();
    }
}

// -----------------------------------

