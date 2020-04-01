//
// AppLogger.ts
//
// Copyright © 2019 Province of British Columbia
//
// Licensed under the Apache License, Version 2.0 (the "License");
// you may not use this file except in compliance with the License.
// You may obtain a copy of the License at
//
// http://www.apache.org/licenses/LICENSE-2.0
//
// Unless required by applicable law or agreed to in writing, software
// distributed under the License is distributed on an "AS IS" BASIS,
// WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
// See the License for the specific language governing permissions and
// limitations under the License.
//
// Created by Pushan Mitra on 2019-05-10.
//

import * as moment from 'moment';
import { BaseLogger } from '../libs/utilities';

declare const console: any;

/**
 * @description Log level
 */
interface LogLevel {
    log: string;
    info: string;
    error: string;
    warning: string;

}

/**
 * @description Logger class for application. This call provide base infrastructure of app logging
 * @export class AppLogger
 */
export class AppLogger implements BaseLogger {
    // Tag
    public tag = 'AppLogger';

    public disable = false;
    public disableInfo = false;
    public disableWarning = false;
    public disableError = false;
    public disableLog = false;

    // Log level marker
    public levels: LogLevel = {
        log: 'Log',
        info: 'Info',
        error: 'Error',
        warning: 'Warning'
    };

    /**
     * @description Constructor
     * @param string inputTag
     */
    public constructor (inputTag: string) {
        this.tag = inputTag || this.constructor.name;
    }

    public set disableInfoLog(val: boolean) {
        this.disableLog = val;
        this.disableInfo = val;
    }

    /**
     * @description Timestamp marker for log
     */
    private dateMarker(): string  {
        return moment(new Date()).format('MM|D|YYYY HH:mm:ss');
    }


    /**
     * @description Method for subclass to customize date marker
     * @param string dateStr
     */
    public formatDate(dateStr: string) {
        return dateStr;
    }

    /**
     * @description Method for subclass to customize log level values
     * @param string level
     */
    public formatLogLevel(level: string) {
        return level;
    }

    /**
     * @description Method for subclass to customize tag
     */
    public formatTag() {
        return this.tag;
    }

    /**
     * @description Method for subclass to customize log body and log level info
     * @param string body
     * @param string _
     */
    public formatBody(body: string, _: string) {
        return body;
    }

    /**
     * @description Private method to create whole log body
     * @param string body
     * @param string logLevel
     */
    private finalLog(body: string, logLevel: string) {
        const dateStr = this.formatDate(this.dateMarker());
        const formattedBody = this.formatBody(body, logLevel);
        return `[${this.formatLogLevel(logLevel)} | ${dateStr} | ${this.formatTag()}] : ${formattedBody}`;
    }

    /**
     * @description Create String from log arguments
     * @param any[] array
     */
    private stringyfyArg(array: any[]) {
        if (array.length === 0) {
            return '';
        }
        const result: string = array.map((item) => `${item}` ).reduce((a, b) => (a + b));
        return result;
    }

    /**
     * @description Basic logging method
     * @param string start
     * @param any[] others
     * @param string logLevelValue
     */
    private _log(start: string, others: any[], logLevelValue: string) {
        if (!this.disable) {
            const rest: string = this.stringyfyArg(others);
            const body: string = rest ? start + '' + rest : start;
            const finalLog = this.finalLog(body, logLevelValue);
            console.log(finalLog);
        }
    }

    /**
     * @description General logger function
     * @param string start
     * @param any[] others
     */
    public log(start: string, ...others: any[]) {
        if (!this.disableLog) {
            this._log(start, others, this.levels.log);
        }
    }

    /**
     * @description Info logger function
     * @param string start
     * @param any[] others
     */
    public info(start: string, ...others: any[]) {
        if (!this.disableInfo) {
            this._log(start, others, this.levels.info);
        }
    }

    /**
     * @description Error logger function
     * @param string start
     * @param any[] others
     */
    public error(start: string, ...others: any[]) {
        if (!this.disableError) {
            this._log(start, others, this.levels.error);
        }
    }

    /**
     * @description Warning logger function
     * @param string start
     * @param any[] others
     */
    public warning(start: string, ...others: any[]) {
        if (!this.disableWarning) {
            this._log(start, others, this.levels.warning);
        }
    }


    /**
     * Test method
     */
    public testLogger() {
        this.log('Hello World');
        this.info('Hello World');
        this.warning('Hello World');
        this.error('Hello World');
    }

}
