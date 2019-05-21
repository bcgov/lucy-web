import * as moment from 'moment';

declare const console: any;

interface LogLevel {
    log: string,
    info: string,
    error: string,
    warning: string

}

export class AppLogger {
    public tag = "AppLogger";

    private dateMarker(): string  {
        return moment(new Date()).format('MM|D|YYYY HH:mm:ss')
    }

    public levels: LogLevel = {
        log: 'Log',
        info: 'Info',
        error: 'Error',
        warning: 'Warning'
    }

    public constructor (inputTag: string) {
        this.tag = inputTag;
    }

    public formatDate(dateStr: string) {
        return dateStr;
    }

    public formatLogLevel(level: string) {
        return level;
    }

    public formatTag() {
        return this.tag;
    }

    public formatBody(body: string, _: string) {
        return body;
    }

    private finalLog(body: string, logLevel: string) {
        let datestr = this.formatDate(this.dateMarker())
        let formattedBody = this.formatBody(body, logLevel);
        return `[${this.formatLogLevel(logLevel)} | ${datestr} | ${this.formatTag()}] : ${formattedBody}`;
    }

    private stringyfyArg(array: any[]) {
        if (array.length === 0) {
            return "";
        }
        let result: string = array.map((item) => { return `${item}`}).reduce((a, b)=> { return a + b})
        return result;
    }

    private _log(start: string, others: any[], logLevelValue: string) {
        let rest: string = this.stringyfyArg(others)
        let body: string = rest? start + " " + rest : start;
        let finalLog = this.finalLog(body, logLevelValue)
        console.log(finalLog)
    }

    public log(start: string, ...others: any[]) {
        this._log(start, others, this.levels.log);
    }

    public info(start: string, ...others: any[]) {
        this._log(start, others, this.levels.info);
    }

    public error(start: string, ...others: any[]) {
        this._log(start, others, this.levels.error);
    }

    public warning(start: string, ...others: any[]) {
        this._log(start, others, this.levels.warning);
    }



    public testLogger() {
        this.log("Hello World");
        this.info("Hello World");
        this.warning("Hello World");
        this.error("Hello World");
    }

}
