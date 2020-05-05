
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
    logging: (process.env.DB_LOG === 'yes') ? true : false,
    dirname: __dirname,
    schema: process.env.DB_SCHEMA || 'invasivesbc'
 }