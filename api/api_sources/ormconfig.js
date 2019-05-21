const appConst = require('./app.const');
module.exports = {
    "type": "postgres",
    "host": process.env.DB_HOST,
    "username":  process.env.DB_USER,
    "password": process.env.DB_PASS,
    "database": appConst.isUnitTest() ? appConst.testDB : process.env.DB_DATABASE,
    "entities": ["./sources/database/models/*.ts"],
    "migrations": ["./sources/database/migrations/*.ts"],
    "cli": {
        "migrationsDir": "./sources/database/migrations"
    },
    synchronize: false,
    logging: appConst.isUnitTest() ? false : true,
    dirname: __dirname
 }