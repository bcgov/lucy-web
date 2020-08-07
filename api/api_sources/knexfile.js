// Update with your config settings.

const dotenv = require('dotenv');

const env = process.env.NODE_ENV || 'development';

if (env === 'development') {
  dotenv.config();
}

module.exports = {
  test: {
    client: 'postgresql',
    connection: {
      host: process.env.POSTGRESQL_HOST,
      port: process.env.POSTGRESQL_PORT || 5432,
      database: process.env.POSTGRESQL_DATABASE_TEST,
      user: process.env.POSTGRESQL_USER,
      password: process.env.POSTGRESQL_PASSWORD,
    },
    pool: {
      min: 2,
      max: 10,
    },
    migrations: {
      // stub: './config/knex-migration-stub.js',
      tableName: 'migration',
      directory: 'src/migrations',
    },
  },
  development: {
    client: 'postgresql',
    connection: {
      host: process.env.POSTGRESQL_HOST,
      port: process.env.POSTGRESQL_PORT || 5432,
      database: process.env.POSTGRESQL_DATABASE,
      user: process.env.POSTGRESQL_USER,
      password: process.env.POSTGRESQL_PASSWORD,
    },
    pool: {
      min: 2,
      max: 10,
    },
    migrations: {
      // stub: './config/knex-migration-stub.js',
      tableName: 'migration',
      directory: 'src/migrations',
    },
    seeds: {
      // stub: './config/knex-migration-stub.js',
      tableName: 'seed',
      directory: 'src/seeds',
    },
  },

  production: {
    client: 'postgresql',
    connection: {
      host: process.env.POSTGRESQL_HOST,
      port: process.env.POSTGRESQL_PORT || 5432,
      database: process.env.POSTGRESQL_DATABASE,
      user: process.env.POSTGRESQL_USER,
      password: process.env.POSTGRESQL_PASSWORD,
    },
    pool: {
      min: 2,
      max: 10,
    },
    migrations: {
      tableName: 'migration',
      directory: 'src/migrations',
    },
    seeds: {
      // stub: './config/knex-migration-stub.js',
      tableName: 'seed',
      directory: 'src/seeds',
    },
  },
};
