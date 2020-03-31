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
 * File: mailer.ts
 * Project: lucy
 * File Created: Thursday, 5th March 2020 1:36:30 am
 * Author: Pushan  (you@you.you)
 * -----
 * Last Modified: Thursday, 5th March 2020 1:57:25 am
 * Modified By: Pushan  (you@you.you>)
 * -----
 */
/**
 * Imports
 */
import * as nodemailer from 'nodemailer';
import { BaseLogger, DefaultLogger } from './logger';

/**
 * @description PlanMail => SubType of nodemailer.SendMailOptions
 */
export type PlainMail = Pick<nodemailer.SendMailOptions, 'to' | 'from' | 'text' | 'subject'>;

/**
 * @description Type Redefine for nodemailer.SendMailOptions
 */
export type Mail = nodemailer.SendMailOptions;

/**
 * @description Mail Controller
 */
export class Mailer {
    private static instance: Mailer;
    transporter: nodemailer.Transporter;

    public static get shared(): Mailer {
        return this.instance || (this.instance = new this());
    }

    /**
     * @description Application Mail sender email
     */
    public static get sender(): string {
        return process.env.APP_EMAIL_SENDER as string;
    }

    /**
     * @description Application Mail sender password
     */
    public static get password(): string {
        return process.env.APP_EMAIL_SENDER_PWD as string;
    }

    /**
     * @description Send method
     * @param  PlainMail | Mail options
     * @param BaseLogger logger
     */
    public async send(options: PlainMail | Mail, logger: BaseLogger = DefaultLogger) {
        if (process.env.TEST_RUN === 'yes') {
            logger.error('Skipping email send');
            return new Promise( res => res({}));
        }
        return new Promise( async (res, rej) => {
            this.transporter = nodemailer.createTransport({
                host: 'apps.smtp.gov.bc.ca',
                port: 25,
                tls: {
                    rejectUnauthorized: false // do not fail on invalid certs
                }
            });
            let done = false;
            let verify = false;
            try {
                verify = await this.transporter.verify();
            } catch (excp) {
                logger.error(`mailer: send: error while connection with mail server: ${excp}`);
            }
            if (verify) {
                // Send
                this.transporter.sendMail(options, (err, info) => {
                    done = true;
                    if (err) {
                        logger.error(`send | fail with error: ${err}`);
                        rej(err);
                    } else {
                        logger.info(`send | [SUCCESS]`);
                        res(info);
                    }
                    if (this.transporter) {
                        // Clean transporter
                        this.transporter.close();
                        delete this.transporter;
                    }
                });
            } else {
                // Not Connected
                done = true;
                logger.error(`mailer: send: Unable to connect with server`);
                rej(new Error(`mailer: send: Unable to connect server`));
            }

            // Setting up timeout
            setTimeout(() => {
                if (!done) {
                    logger.error(`Email Send fail [TIMEOUT]`);
                    rej(new Error(`report-issue: Unable to send email [TIMEOUT]`));
                }
            }, 25000);
        });
    }

}
// -------------------------
