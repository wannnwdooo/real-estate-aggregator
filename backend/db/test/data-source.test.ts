import { DataSource, DataSourceOptions } from 'typeorm';
import { ConfigService } from '@nestjs/config';
import { config } from 'dotenv';
import { join } from 'path';

config({ path: join(process.cwd(), '.env') });
const configService = new ConfigService();
export const options = (): DataSourceOptions => {
  const url = configService.get('TEST_DATABASE_URL');
  if (!url) {
    throw new Error('Database URL is empty');
  }
  return {
    url,
    type: 'postgres',
    schema: 'public',
    entities: ['dist/**/*.entity.js'],
    migrations: ['dist/db/migrations/*.js'],
    logging: configService.get('IS_PROD') === 'false',
  };
};

export const testDataSource = new DataSource(options());
