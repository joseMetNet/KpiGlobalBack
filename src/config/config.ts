import * as dotenv from 'dotenv';

dotenv.config();
interface Config {
  readonly APP_PORT: number;
  readonly AUTH_TOKEN_SECRET: string;
  readonly AUTH_TOKEN_EXPIRY_DURATION: string;
  readonly DATABASE_USER: string;
  readonly DATABASE_PASSWORD: string;
  readonly DATABASE_PORT: number;
  readonly DATABASE_NAME: string;
  readonly DATABASE_SERVER: string;
	readonly AUTH_URL: string;
	readonly USER_GROUP: string;
  readonly AZURE_STORAGE_ACCOUNT_NAME: string;
  readonly AZURE_STORAGE_CONTAINER_NAME: string;
}


function getEnvVariable(name: string): string {
  const env = process.env[name];
  if (!env) {
    throw new Error(`Environment variable ${name} not found`);
  }
  return env;
}

export const config: Config = Object.freeze({
  APP_PORT: parseInt(getEnvVariable('APP_PORT'), 10),
  AUTH_TOKEN_SECRET: getEnvVariable('AUTH_TOKEN_SECRET'),
  AUTH_TOKEN_EXPIRY_DURATION: getEnvVariable('AUTH_TOKEN_EXPIRY_DURATION'),
  DATABASE_USER: getEnvVariable('DATABASE_USER'),
  DATABASE_PASSWORD: getEnvVariable('DATABASE_PASSWORD'),
  DATABASE_PORT: parseInt(getEnvVariable('DATABASE_PORT'), 10),
  DATABASE_NAME: getEnvVariable('DATABASE_NAME'),
  DATABASE_SERVER: getEnvVariable('DATABASE_SERVER'),
  AUTH_URL: getEnvVariable('AUTH_URL'),
  USER_GROUP: getEnvVariable('USER_GROUP'),
  AZURE_STORAGE_ACCOUNT_NAME: getEnvVariable('AZURE_STORAGE_ACCOUNT_NAME'),
  AZURE_STORAGE_CONTAINER_NAME: getEnvVariable('AZURE_STORAGE_CONTAINER_NAME')
});
