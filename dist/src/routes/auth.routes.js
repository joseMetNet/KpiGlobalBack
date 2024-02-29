"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.authRoutes = void 0;
const express_1 = require("express");
const express_validator_1 = require("express-validator");
const validatorEnpoint_1 = require("../middlewares/validatorEnpoint");
const controllers_1 = require("../controllers");
function authRoutes(app) {
    const routes = (0, express_1.Router)();
    /**
    * @openapi
    * '/v1/auth/register':
    *  post:
    *     security: []
    *     tags:
    *     - Auth Controller
    *     summary: Register user
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
    routes.post('/register', [(0, express_validator_1.check)('firstName', 'firstName is required').notEmpty(), validatorEnpoint_1.validateEnpoint], [(0, express_validator_1.check)('lastName', 'lastName is required').notEmpty(), validatorEnpoint_1.validateEnpoint], [(0, express_validator_1.check)('email', 'email is required').notEmpty(), validatorEnpoint_1.validateEnpoint], [(0, express_validator_1.check)('password', 'password is required').notEmpty(), validatorEnpoint_1.validateEnpoint], controllers_1.authController.register);
    /**
    * @openapi
    * '/v1/auth/login':
    *  post:
    *     security: []
    *     tags:
    *     - Auth Controller
    *     summary: Authenticate user
    *     requestBody:
    *      required: true
    *      content:
    *        application/json:
    *           schema:
    *            type: object
    *            required:
    *              - email
    *              - password
    *            properties:
    *              email:
    *                type: string
    *                default: email@mail.com
    *              password:
    *                type: string
    *                default: password
    *     responses:
    *      200:
    *        description: User logged
    *      409:
    *        description: Invalid credentials
    *      404:
    *        description: Not Found
    *      500:
    *        description: Server Error
    */
    routes.post('/login', [(0, express_validator_1.check)('email', 'email is required').notEmpty(), validatorEnpoint_1.validateEnpoint], [(0, express_validator_1.check)('password', 'password is required').notEmpty(), validatorEnpoint_1.validateEnpoint], controllers_1.authController.login);
    /**
    * @openapi
    * '/v1/auth/verify-user':
    *  patch:
    *     security: []
    *     tags:
    *     - Auth Controller
    *     summary: Verify user email
    *     requestBody:
    *      required: true
    *      content:
    *        application/json:
    *           schema:
    *            type: object
    *            required:
    *              - email
    *              - code
    *            properties:
    *              email:
    *                type: string
    *                default: email@mail.com
    *              code:
    *                type: string
    *                default: code
    *     responses:
    *      200:
    *        description: Email verified
    *      409:
    *        description: Invalid credentials
    *      404:
    *        description: User Not Found
    *      500:
    *        description: Server Error
    */
    routes.patch('/verify-user', [(0, express_validator_1.check)('email', 'email is required').notEmpty(), validatorEnpoint_1.validateEnpoint], [(0, express_validator_1.check)('code', 'code property must have 5 characters').isLength({ min: 5, max: 5 }), validatorEnpoint_1.validateEnpoint], controllers_1.authController.verifyUser);
    app.use('/api/v1/auth/', routes);
}
exports.authRoutes = authRoutes;
//# sourceMappingURL=auth.routes.js.map