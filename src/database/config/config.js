// eslint-disable-next-line @typescript-eslint/no-var-requires
const dotenv = require('dotenv');

dotenv.config();

const sharedConfig = {
  username: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  host: process.env.DB_HOST,
  port: process.env.DB_PORT,
  dialect: 'postgres',
  define: {
    underscored: true,
    createdAt: 'created_at',
    updatedAt: 'updated_at',
  },
  migrationStorageTableName: 'sequelize_meta',
};

module.exports = {
  development: sharedConfig,
  staging: sharedConfig,
  production: {
    ...sharedConfig,
    ssl: true,
    dialectOptions: {
      ssl: {
        ca: process.env.DB_SSL_CA,
        rejectUnauthorized: true,
      },
    },
  },
};
