import {AppLogger} from '../../Applogger'
import chalk from 'chalk'

export class Logger extends AppLogger {
    constructor(inputTag: string) {
        super(inputTag)
    }

    formatBody(body: string, logLevel: string) {
        switch (logLevel) {
            case this.levels.log:
                return body
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

    formatDate(dateStr: string) {
        return chalk.green.bold(dateStr)
    }

    formatTag() {
        return chalk.cyan.bold(this.tag);
    }

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

export class LoggerBase {

    private static _logger: Logger;

    public static get className(): string {
        return this.name;
    }

    public static get logger(): Logger {
        return this._logger || (this._logger = new Logger(this.className))
    } 
}
