//
// App Logger
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
/**
 * Imports
 */
import {AppLogger} from '../../Applogger';
import chalk from 'chalk';

/**
 * @description Generic Logger with customization from chalk
 * @export class Logger
 */
export class Logger extends AppLogger {
    /**
     * @description Constructor
     * @param string inputTag
     */
    constructor(inputTag: string) {
        super(inputTag);
    }

    /**
     * @description Formatting log body using chalk
     * @param string body
     * @param string logLevel
     */
    formatBody(body: string, logLevel: string) {
        switch (logLevel) {
            case this.levels.log:
                return body;
            case this.levels.error:
                return chalk.red(body);
            case this.levels.info:
                return chalk.blue(body);
            case this.levels.warning:
                return chalk.yellow(body);
            default:
                return body;
        }
    }

    /**
     * @description Formate date/timestamp part of the log
     * @param string dateStr
     */
    formatDate(dateStr: string) {
        return chalk.green.bold(dateStr);
    }

    /**
     * @description Formate tag part of the log
     */
    formatTag() {
        return chalk.cyan.bold(this.tag);
    }

    /**
     * @description Formatting log type label
     * @param string logLevel
     */
    formatLogLevel(logLevel: string) {
        switch (logLevel) {
            case this.levels.log:
                return  chalk.bold(logLevel);
            case this.levels.error:
                return chalk.bold.red(logLevel);
            case this.levels.info:
                return chalk.bold.blue(logLevel);
            case this.levels.warning:
                return chalk.bold.yellow(logLevel);
            default:
                return chalk.bold(logLevel);
        }
    }
}

/**
 * @description Generic LoggerBase class for sub classing, provides shared logger instance
 * @export class LoggerBase
 */
export class LoggerBase {
    private static _logger: Logger;

    public static get className(): string {
        return this.name;
    }

    public static get logger(): Logger {
        return this._logger || (this._logger = new Logger(this.className));
    }
}
/**
 * @description Global Logger
 */
let globalLogger: Logger;
/**
 * @description Getter for global logger
 */
export const appLogger = (): Logger => {
    return globalLogger || (globalLogger = new Logger('global'));
};
// -----------------------------------------------------------------------------------------------------------
