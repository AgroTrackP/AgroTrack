import { DataSource, DataSourceOptions } from 'typeorm';
import { config as dotenvConfig } from 'dotenv';
import { registerAs } from '@nestjs/config';

dotenvConfig({ path: '.env.development' });

if (!process.env.DB_PORT) {
  throw new Error('DB_PORT is not defined in the environment variables');
}

export const databaseConfig: DataSourceOptions = {
  type: 'postgres',
  database: process.env.DB_NAME,
  host: process.env.DB_HOST,
  port: parseInt(process.env.DB_PORT, 10),
  username: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  synchronize: false,
  logging: true,
  entities: [__dirname + '/../**/*.entity{.ts,.js}'],
  migrations: ['dist/migrations/*.js'],
  ssl: process.env.DB_SSL === 'true' ? { rejectUnauthorized: false } : false,
};

export default registerAs('typeorm', () => databaseConfig);

export const connectionSource = new DataSource(
  databaseConfig as DataSourceOptions,
);
