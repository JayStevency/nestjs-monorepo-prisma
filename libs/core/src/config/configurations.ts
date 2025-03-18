import * as dotenv from 'dotenv';
import * as fs from 'fs';
import { Logger } from '@nestjs/common';
import { ConfigProps } from './config.type';

const logger: Logger = new Logger('Configurations');
const environment: string = process.env.NODE_ENV || 'local';
const envPath = `.env.${environment}`;
const data: NodeJS.ProcessEnv = process.env;

export default (): ConfigProps => {
  try {
    if (fs.existsSync(envPath)) {
      Object.assign(data, dotenv.parse(fs.readFileSync(envPath)));
    }

    return {
      environment,
      version: data.npm_package_version,
      appName: data.npm_package_name,
      databaseUrl: `postgresql://${data.DB_USERNAME}:${data.DB_PASSWORD}@${data.DB_HOST}:${data.DB_PORT}/${data.DB_NAME}?schema=SCHEMA`,
      prismaLogger: data.PRISMA_LOGGER,
    };
  } catch (error) {
    logger.error(error);
    throw error;
  }
};
