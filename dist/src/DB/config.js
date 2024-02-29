"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.sequelize = void 0;
const sequelize_1 = require("sequelize");
require("colors");
const config_1 = require("../config/config");
exports.sequelize = new sequelize_1.Sequelize(config_1.config.DATABASE_NAME, config_1.config.DATABASE_USER, config_1.config.DATABASE_PASSWORD, {
    dialect: 'mssql',
    host: config_1.config.DATABASE_SERVER,
    port: config_1.config.DATABASE_PORT,
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
//# sourceMappingURL=config.js.map