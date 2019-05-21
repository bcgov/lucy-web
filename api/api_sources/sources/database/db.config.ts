import AppConfig from "../AppConfig";
enum DB_Type {
    postgres = 'postgres'
}


declare const __dirname: any;

export const DBConfig = {
    type: DB_Type.postgres,
    url: `postgres://${AppConfig.dbUser}:${AppConfig.dbPassword}@${AppConfig.dbHost}/${AppConfig.dbName}`,
    entities: [__dirname + "/models/*.ts"],
    migrations:[__dirname + "/migrations/*.js"],
    synchronize: true,
    logging: true,
    dirname: __dirname
};