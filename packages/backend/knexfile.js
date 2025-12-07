// packages/backend/knexfile.js
require('dotenv').config({ path: '../../.env' });

module.exports = {
    development: {
        client: 'pg',
        connection: {
            host: process.env.POSTGRES_HOST || 'localhost',
            port: process.env.POSTGRES_PORT || 5432,
            user: process.env.POSTGRES_USER || 'vela',
            password: process.env.POSTGRES_PASSWORD || 'vela_dev_password',
            database: process.env.POSTGRES_DB || 'vela',
            ssl: { rejectUnauthorized: false },
        },
        migrations: {
            directory: './migrations',
        },
        seeds: {
            directory: './seeds',
        },
    },

    production: {
        client: 'pg',
        connection: {
            host: process.env.POSTGRES_HOST,
            port: process.env.POSTGRES_PORT,
            user: process.env.POSTGRES_USER,
            password: process.env.POSTGRES_PASSWORD,
            database: process.env.POSTGRES_DB,
            ssl: { rejectUnauthorized: false },
        },
        migrations: {
            directory: './migrations',
        },
        seeds: {
            directory: './seeds',
        },
        pool: {
            min: 2,
            max: 10,
        },
    },
};
