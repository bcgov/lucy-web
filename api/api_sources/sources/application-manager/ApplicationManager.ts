import * as fs from 'fs'
import AppConfig from '../AppConfig'
import { LoggerBase } from '../server/logger'
// 123
export  interface ApplicationState {
    isSeeded: boolean,
    isDBUp: boolean
    isReady: boolean,
    lastDeployDate: Date
    lastExitDate?: Date
    lastErrorDetails: object
}

const status_fileName = '/app_status.json';


export class ApplicationManager extends LoggerBase {
    private static instance: ApplicationManager;

    public static get shared(): ApplicationManager {
        return this.instance || (this.instance = new this());
    }

    state: ApplicationState;

    constructor() {
       super() 
    }

    init() {
        const statusFile = AppConfig.dataDirPath + status_fileName
        if (fs.existsSync(statusFile)) {
            const buffer = fs.readFileSync(statusFile, {encoding: 'utf8', flag:'r'})
            this.state = JSON.parse(buffer)
            ApplicationManager.logger.info(`Load application state from file: ${buffer}`);
            this.state.isReady = false
            this.state.isDBUp = false
            return
        } else {
            this.state = {
                isSeeded: false,
                isReady: false,
                isDBUp: false,
                lastDeployDate: new Date(),
                lastErrorDetails: {}
            }
        }
    }

    save() {
        //const statusFile = appConfig.dataDirPath + status_fileName;
        //fs.writeFileSync(statusFile, JSON.stringify(this.state));
        ApplicationManager.logger.info(`App Status saved`);
    }
    
}