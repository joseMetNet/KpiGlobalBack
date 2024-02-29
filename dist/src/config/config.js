"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.config = void 0;
const dotenv = __importStar(require("dotenv"));
dotenv.config();
function getEnvVariable(name) {
    const env = process.env[name];
    if (!env) {
        throw new Error(`Environment variable ${name} not found`);
    }
    return env;
}
exports.config = Object.freeze({
    APP_PORT: parseInt(getEnvVariable('PORT_APP'), 10),
    authTokenSecret: getEnvVariable('AUTH_TOKEN_SECRET'),
    authTokenExpiryDuration: getEnvVariable('AUTH_TOKEN_EXPIRY_DURATION'),
    DATABASE_USER: getEnvVariable('DATABASE_USER'),
    DATABASE_PASSWORD: getEnvVariable('DATABASE_PASSWORD'),
    DATABASE_PORT: parseInt(getEnvVariable('DATABASE_PORT'), 10),
    DATABASE_NAME: getEnvVariable('DATABASE_NAME'),
    DATABASE_SERVER: getEnvVariable('DATABASE_SERVER'),
    AUTH_URL: getEnvVariable('AUTH_URL'),
    USER_GROUP: getEnvVariable('USER_GROUP')
});
//# sourceMappingURL=config.js.map