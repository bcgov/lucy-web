
module.exports = {
    "type": "postgres",
    "host": process.env.DB_HOST,
    "username":  process.env.DB_USER,
    "password": process.env.DB_PASS,
    "database": process.env.DB_DATABASE,
    "entities": ["./sources/database/models/*.ts"],
    "migrations": ["./sources/database/migrations/*.ts"],
    "cli": {
        "migrationsDir": "./sources/database/migrations",
        "entitiesDir": "./sources/database/models"
    },
    migrationsTableName: "app_migration_table",
    synchronize: false,
    logging: false,//(process.env.NODE_ENV === 'unit_test') ? false : true,
    dirname: __dirname
 }