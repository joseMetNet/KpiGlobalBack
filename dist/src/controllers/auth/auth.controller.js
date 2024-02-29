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
const authRepository = __importStar(require("../../repository/auth/auth.repository"));
const auth_schema_1 = require("./auth.schema");
const example_1 = require("../../interface/example");
async function register(req, res) {
    const request = auth_schema_1.registerSchema.safeParse(req.body);
    if (!request.success) {
        res.status(example_1.StatusCode.BadRequest).json({ status: example_1.StatusValue.Failed, data: { error: request.error.message } });
        return;
    }
    const response = await authRepository.register(request.data);
    res.status(response.code).json({ status: response.status, data: response.data });
}
exports.register = register;
async function login(req, res) {
    const request = auth_schema_1.authSchema.safeParse(req.body);
    if (!request.success) {
        res.status(example_1.StatusCode.BadRequest).json({ status: example_1.StatusValue.Failed, data: { error: request.error.message } });
        return;
    }
    const response = await authRepository.login(request.data);
    res.status(response.code).json({ status: response.status, data: response.data });
}
exports.login = login;
async function verifyUser(req, res) {
    const request = auth_schema_1.verifyUserSchema.safeParse(req.body);
    if (!request.success) {
        res.status(example_1.StatusCode.BadRequest).json({ status: example_1.StatusValue.Failed, data: { error: request.error.message } });
        return;
    }
    const response = await authRepository.verifyUser(request.data);
    res.status(response.code).json({ status: response.status, data: response.data });
}
exports.verifyUser = verifyUser;
//# sourceMappingURL=auth.controller.js.map