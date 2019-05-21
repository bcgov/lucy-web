import * as path from 'path'
declare const process: any;
declare const __dirname: any;

class AppConfiguration {
    
    private static instance: AppConfiguration;

    public port: number = 0;
    public host: string = '127.0.0.1';
    public secure: boolean = false;
    public appName: string = process.env.PROJECT_NAME || 'lucy';
    public dbs: string[] = ['templateDB'];

    public static getInstance() {
        return this.instance || (this.instance = new this());
    }

    constructor() {
        this.port = process.env.PORT || 8002;
        this.host = process.env.HOST || '127.0.0.1';
    }
    
    // environments:  = ['local-dev', 'docker-dev', 'prod']
    

    public getEnv = () => {
        return process.env.NODE_ENV;
    }

    public get retryDelay(): number {
        return 10000;
    }

    
    public get isDocker(): boolean {
        return this.getEnv() === 'docker-dev';
    }

    public get isProduction(): boolean {
        return process.env.ENVIRONMENT === 'production'
    }

    public get dbUser(): string  {
        return process.env.DB_USER || 'application';
    }

    public get dbPassword(): string {
        return process.env.DB_PASS || 'lucy';
    }

    public get dbName(): string {
        return process.env.DB_DATABASE || 'app_dev';
    }

    public get dbHost(): string {
        return process.env.DB_HOST || ( this.isDocker === true ? 'db' : 'localhost')
    }


    public get dataDirPath(): string {
        return path.resolve(__dirname, '../../_app_data');
    }


}

export default AppConfiguration.getInstance();
