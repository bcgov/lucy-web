// Update with your config settings.

import dotenv from 'dotenv';

const env = process.env.NODE_ENV || 'development';

if (env === 'development') {
  dotenv.config();
}

module.exports = {
  test: {
    client: 'postgresql',
    connection: {
      host: process.env.DB_HOST_FOR_LOCAL_API,
      port: process.env.DB_PORT || 5432,
      database: process.env.DB_DATABASE,
      user: process.env.DB_USER,
      password: process.env.DB_PASS
    },
    pool: {
      min: 2,
      max: 10
    },
    migrations: {
      // stub: './config/knex-migration-stub.js',
      tableName: 'migration',
      directory: 'src/database/migrations'
    }
  },
  development: {
    client: 'postgresql',
    connection: {
      host: process.env.DB_HOST_FOR_LOCAL_API,
      port: process.env.DB_PORT || 5432,
      database: process.env.DB_DATABASE,
      user: process.env.DB_USER,
      password: process.env.DB_PASS
    },
    pool: {
      min: 2,
      max: 10
    },
    migrations: {
      // stub: './config/knex-migration-stub.js',
      tableName: 'migration',
      directory: 'src/database/migrations'
    },
    seeds: {
      // stub: './config/knex-migration-stub.js',
      tableName: 'seed',
      directory: 'src/database/seeds'
    }
  },

  production: {
    client: 'postgresql',
    connection: {
      host: process.env.DB_HOST_FOR_LOCAL_API,
      port: process.env.DB_PORT || 5432,
      database: process.env.DB_DATABASE,
      user: process.env.DB_USER,
      password: process.env.DB_PASS
    },
    pool: {
      min: 2,
      max: 10
    },
    migrations: {
      tableName: 'migration',
      directory: 'src/database/migrations'
    },
    seeds: {
      // stub: './config/knex-migration-stub.js',
      tableName: 'seed',
      directory: 'src/database/seeds'
    }
  }
};
