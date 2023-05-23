/**
 * Application Configuration
 */
import * as path from 'path';
import * as assert from 'assert';
import { Logger } from '../../../api_sources/sources/server/logger';
declare const process: any;
declare const __dirname: any;

/**
 * @description Application configuration class
 */
class AppConfiguration {
    logger: Logger;
    // Shared instance
    private static instance: AppConfiguration;

    // Instance variables
    public port = 0;
    public host = '127.0.0.1';
    public secure = false;
    public appName: string = process.env.PROJECT_NAME || 'lucy';
    public dbs: string[] = ['templateDB'];

    /**
     * @description Getter for shard instance
     * @return AppConfiguration
     */
    public static getInstance(): AppConfiguration {
        return this.instance || (this.instance = new this());
    }

    /**
     * @description Constructing
     */
    constructor() {
        this.logger = new Logger(this.constructor.name);
        this.port = (process.env.PORT || 3001);
        this.host = process.env.HOST || '127.0.0.1';
    }

    /**
     * @description Get Node Env
     */
    public getEnv = () => {
        return process.env.NODE_ENV;
    }

    /**
     * @description Return current environment
     */
    public getCurrentEnv = (): string => {
        return process.env.ENVIRONMENT;
    }

    /**
     * @description Retry delay
     */
    public get retryDelay(): number {
        return 10000;
    }

    /**
     * @description Check env is docker or not
     */
    public get isDocker(): boolean {
        return this.getEnv() === 'docker-dev';
    }

    /**
     * @description Check env is production or not
     */
    public get isProduction(): boolean {
        return process.env.ENVIRONMENT === 'prod';
    }

    /**
     * @description Database user name
     */
    public get dbUser(): string  {
        return process.env.DB_USER || 'application';
    }

    /**
     * @description Database password
     */
    public get dbPassword(): string {
        return process.env.DB_PASS || 'lucy';
    }

    /**
     * @description Database name
     */
    public get dbName(): string {
        return process.env.DB_DATABASE || 'app_dev';
    }

    /**
     * @description Database host name
     */
    public get dbHost(): string {
        return process.env.DB_HOST || ( this.isDocker === true ? 'db' : 'localhost');
    }


    /**
     * @description Path for application data
     */
    public get dataDirPath(): string {
        return path.resolve(__dirname, '../../_app_data');
    }

    /**
     * @description Application certificate url
     */
    public get certificateURL(): string {
        assert(process.env.APP_CERTIFICATE_URL, `No App Certificate url`);
        this.logger.error('APP_CERTIFICATE_URL exception ', process.env.APP_CERTIFICATE_URL);
        return process.env.APP_CERTIFICATE_URL;
    }

    /**
     * @description User session timeout
     */
    public get sessionLifeTime(): number {
        return (86400 * 1000);
    }

    /**
     * @description Flag to check session token expiry
     */
    public get bypassTokenExpiry(): boolean {
        // Get env
        const env = process.env.ENVIRONMENT || 'prod';

        // Bypassing token expiry for local or dev env
        return (env === 'dev' || env === 'local');
    }

    public get reportReceivers(): string {
        return process.env.APP_REPORT_RECEIVER || '';
    }
}

/**
 * @description Shared AppConfig instance
 * @export AppConfiguration
 */
export default AppConfiguration.getInstance();
