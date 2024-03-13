import { Sequelize } from 'sequelize';
import 'colors';
import { config } from './config';

export const sequelize = new Sequelize(config.DATABASE_NAME, config.DATABASE_USER, config.DATABASE_PASSWORD, {
	dialect: 'mssql',
	host: config.DATABASE_SERVER,
	port: config.DATABASE_PORT, // Default port
	dialectOptions: {
		instanceName: 'SQLEXPRESS',
		requestTimeout: 30000
	},
	pool: {
		max: 50,
		min: 0,
		idle: 10000
	}
});