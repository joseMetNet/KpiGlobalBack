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
exports.verifyUser = exports.login = exports.register = void 0;
const example_1 = require("../../interface/example");
const user_model_1 = require("../user/user.model");
const verificationRepository = __importStar(require("./verification.repository"));
const config_1 = require("../../config");
const BcryptAdapter_1 = require("./BcryptAdapter");
const helper_1 = require("./helper");
const verification_model_1 = require("../model/verification.model");
const utils_1 = require("../../utils");
async function register(request) {
    try {
        const userExist = await findUserByEmail(request.email);
        if (typeof userExist === 'string') {
            return utils_1.BuildResponse.buildErrorResponse(example_1.StatusCode.Conflict, { error: 'User already exist' });
        }
        const partialUser = await registerRequest(request);
        if (partialUser instanceof config_1.CustomError) {
            return utils_1.BuildResponse.buildErrorResponse(partialUser.statusCode, { error: partialUser.message });
        }
        request.password = hashPassword(request.password);
        const newUser = await user_model_1.User.create({
            id: partialUser,
            firstName: request.firstName,
            lastName: request.lastName,
            email: request.email
        });
        const verificationCode = await verificationRepository.createCode(newUser.email);
        if (verificationCode instanceof config_1.CustomError) {
            return utils_1.BuildResponse.buildErrorResponse(verificationCode.statusCode, { error: verificationCode.message });
        }
        const verificationEmail = await (0, helper_1.sendVerificationEmail)(verificationCode, request.email);
        if (verificationEmail instanceof config_1.CustomError) {
            return utils_1.BuildResponse.buildErrorResponse(verificationEmail.statusCode, { error: verificationEmail.message });
        }
        const payload = { id: newUser.id };
        const token = (0, helper_1.createAuthToken)(payload);
        return utils_1.BuildResponse.buildSuccessResponse(example_1.StatusCode.ResourceCreated, { token: token });
    }
    catch (err) {
        console.log(err);
        return utils_1.BuildResponse.buildErrorResponse(example_1.StatusCode.InternalErrorServer, { error: err.message });
    }
}
exports.register = register;
async function login(request) {
    const userExist = await findUserByEmail(request.email);
    if (userExist instanceof config_1.CustomError) {
        console.log(`User exist => ${userExist}`);
        utils_1.BuildResponse.buildErrorResponse(userExist.statusCode, { error: userExist.message });
    }
    const authStatus = await authRequest(request);
    if (authStatus instanceof config_1.CustomError) {
        return utils_1.BuildResponse.buildErrorResponse(authStatus.statusCode, { error: authStatus.message });
    }
    const payload = { id: authStatus };
    const token = (0, helper_1.createAuthToken)(payload);
    return utils_1.BuildResponse.buildSuccessResponse(example_1.StatusCode.Ok, { token: token });
}
exports.login = login;
async function verifyUser(request) {
    const isValid = await findCode(request);
    if (isValid instanceof config_1.CustomError) {
        console.log(JSON.stringify(isValid));
        return utils_1.BuildResponse.buildErrorResponse(isValid.statusCode, { error: isValid.message });
    }
    const verificationStatus = await verifyAuthCode(request.email);
    if (verificationStatus instanceof config_1.CustomError) {
        return utils_1.BuildResponse.buildErrorResponse(verificationStatus.statusCode, { error: verificationStatus.message });
    }
    return utils_1.BuildResponse.buildSuccessResponse(example_1.StatusCode.Ok, { status: verificationStatus });
}
exports.verifyUser = verifyUser;
async function verifyAuthCode(email) {
    try {
        const user = await user_model_1.User.update({
            isEmailVerified: true
        }, {
            where: {
                email: email
            }
        });
        console.log(`Updated user conde ${user}`);
        if (!user) {
            return config_1.CustomError.notFound('User not found');
        }
        return 'User verified';
    }
    catch (err) {
        return config_1.CustomError.badRequest(err.message);
    }
}
async function findCode(request) {
    try {
        const codeExist = await verification_model_1.VerificationStatus.findOne({
            where: {
                code: request.code,
                email: request.email
            }
        });
        if (!codeExist) {
            return config_1.CustomError.notFound('Code and email combination doesnt exist');
        }
        return codeExist;
    }
    catch (err) {
        return config_1.CustomError.internalServer(err.message);
    }
}
async function findUserByEmail(email) {
    const headers = new Headers();
    headers.append('Content-Type', 'application/json');
    const requestOptions = {
        method: 'GET',
        headers: headers,
        redirect: 'follow'
    };
    const url = `${config_1.config.AUTH_URL}/UserManagement?userGroup=${config_1.config.USER_GROUP}&userName=${email}`;
    const response = await fetch(url, requestOptions);
    if (response.ok) {
        return 'User found';
    }
    return config_1.CustomError.notFound('User not found');
}
async function registerRequest(request) {
    const headers = new Headers();
    headers.append('Content-Type', 'application/json');
    const payload = JSON.stringify({
        'userGroup': config_1.config.USER_GROUP,
        'password': request.password,
        'userName': request.email
    });
    const requestOptions = {
        method: 'POST',
        headers: headers,
        body: payload,
        redirect: 'follow'
    };
    const response = await fetch(`${config_1.config.AUTH_URL}/UserManagement`, requestOptions);
    if (!response.ok) {
        const message = await response.json();
        return config_1.CustomError.internalServer(message.data[0].msg);
    }
    const data = await response.json();
    return data.data[0].id;
}
async function authRequest(request) {
    const headers = new Headers();
    headers.append('Content-Type', 'application/json');
    const payload = JSON.stringify({
        'userGroup': config_1.config.USER_GROUP,
        'password': request.password,
        'userName': request.email
    });
    const requestOptions = {
        method: 'POST',
        headers: headers,
        body: payload,
        redirect: 'follow'
    };
    const response = await fetch(`${config_1.config.AUTH_URL}/UserManagement/authenticationUser`, requestOptions);
    const data = await response.json();
    if (!response.ok) {
        return config_1.CustomError.conflict('Invalid credentials');
    }
    return data.data.id;
}
const hashPassword = BcryptAdapter_1.BcryptAdapter.hash;
//# sourceMappingURL=auth.repository.js.map