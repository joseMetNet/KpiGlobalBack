import { Application, Router } from 'express';
import { check } from 'express-validator';
import { validateEnpoint } from '../middlewares/validatorEnpoint';
import { authController } from '../controllers';

export function authRoutes(app: Application): void {
	const routes: Router = Router();

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
	routes.post(
		'/register',
		[check('firstName', 'firstName is required').notEmpty(), validateEnpoint],
		[check('lastName', 'lastName is required').notEmpty(), validateEnpoint],
		[check('email', 'email is required').notEmpty(), validateEnpoint],
		[check('password', 'password is required').notEmpty(), validateEnpoint],
		authController.register
	);

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
	routes.post(
		'/login',
		[check('email', 'email is required').notEmpty(), validateEnpoint],
		[check('password', 'password is required').notEmpty(), validateEnpoint],
		authController.login
	);

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
	routes.patch(
		'/verify-user',
		[check('email', 'email is required').notEmpty(), validateEnpoint],
		[check('code', 'code property must have 5 characters').isLength({min: 5, max: 5}), validateEnpoint],
		authController.verifyUser
	);
	app.use('/api/v1/auth/', routes);
}