"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.authRoutes = void 0;
const express_1 = require("express");
const express_validator_1 = require("express-validator");
const validatorEnpoint_1 = require("../../middlewares/validatorEnpoint");
const auth_controller_1 = require("./auth.controller");
function authRoutes(app) {
    const routes = (0, express_1.Router)();
    /**
     * @openapi
     * '/api/user/register':
     *  post:
     *     tags:
     *     - Auth Controller
     *     summary: Register a user
     *     requestBody:
     *      required: true
     *      content:
     *        application/json:
     *           schema:
     *            type: object
     *            required:
     *              - firstName
     *              - lastName
     *              - email
     *              - password
     *            properties:
     *              firstName:
     *                type: string
     *                default: firstName
     *              lastName:
     *                type: string
     *                default: lastName
     *              email:
     *                type: string
     *                default: email@mail.com
     *              password:
     *                type: string
     *                default: password
     *     responses:
     *      201:
     *        description: Created
     *      409:
     *        description: Conflict
     *      404:
     *        description: Not Found
     *      500:
     *        description: Server Error
     */
    routes.post('/register', [(0, express_validator_1.check)('firstName', 'firstName is required').notEmpty(), validatorEnpoint_1.validateEnpoint], [(0, express_validator_1.check)('lastName', 'lastName is required').notEmpty(), validatorEnpoint_1.validateEnpoint], [(0, express_validator_1.check)('email', 'email is required').notEmpty(), validatorEnpoint_1.validateEnpoint], [(0, express_validator_1.check)('password', 'password is required').notEmpty(), validatorEnpoint_1.validateEnpoint], auth_controller_1.register);
    routes.post('/login', [(0, express_validator_1.check)('email', 'email is required').notEmpty(), validatorEnpoint_1.validateEnpoint], [(0, express_validator_1.check)('password', 'password is required').notEmpty(), validatorEnpoint_1.validateEnpoint], auth_controller_1.login);
    routes.patch('/verify-user', [(0, express_validator_1.check)('email', 'email is required').notEmpty(), validatorEnpoint_1.validateEnpoint], [(0, express_validator_1.check)('code', 'code is required').notEmpty(), validatorEnpoint_1.validateEnpoint], auth_controller_1.verifyUser);
    app.use('/api/v1/auth/', routes);
}
exports.authRoutes = authRoutes;
//# sourceMappingURL=routes.js.map