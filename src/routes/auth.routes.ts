import { Application, Router } from 'express';
import { check } from 'express-validator';
import { validateEnpoint } from '../middleware/validatorEnpoint';
import { authController } from '../controllers';
import { authentication } from '../middleware/validate-token';

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

	app.use('/api/v1/auth/', routes);

	/**
	  * @openapi
	  * '/v1/auth/send-verification-email':
	  *  post:
	  *     security: []
	  *     tags:
	  *     - Auth Controller
	  *     summary: Send code to verify one user
	  *     requestBody:
	  *      required: true
	  *      content:
	  *        application/json:
	  *           schema:
	  *            type: object
	  *            required:
	  *              - email
	  *            properties:
	  *              email:
	  *                type: string
	  *                default: email@mail.com
	  *     responses:
	  *      200:
	  *        description: Code successfully send
	  *      404:
	  *        description: User Not Found
	  *      500:
	  *        description: Server Error
	  */
	routes.post(
		'/send-verification-email',
		[check('email', 'email is required').notEmpty(), validateEnpoint],
		authController.sendVerificationEmail
	);
	app.use('/api/v1/auth/', routes);

	/**
    * @openapi
    * '/v1/auth/verify-user':
    *  patch:
    *     security: []
    *     tags:
    *     - Auth Controller
    *     summary: Verify user identity
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
    *        description: Password successfully restored
    *      500:
    *        description: Server Error
    */
	routes.patch(
		'/verify-user',
		[check('code', 'email is required').notEmpty(), validateEnpoint],
		[check('code', 'verification code is required').notEmpty(), validateEnpoint],
		authController.verifyUser
	);

	/**
	  * @openapi
	  * '/v1/auth/reset-password':
	  *  post:
	  *     tags:
	  *     - Auth Controller
	  *     summary: Reset password
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
	  *                default: mail@mail.com
	  *              password:
	  *                type: string
	  *                default: password
	  *     responses:
	  *      200:
	  *        description: Password successfully restored
	  *      500:
	  *        description: Server Error
	  */

	routes.post(
		'/reset-password',
		[check('email', 'email is required').notEmpty(), validateEnpoint],
		[check('password', 'password is required').notEmpty(), validateEnpoint],
		authentication,
		authController.resetPassword
	);
	app.use('/api/v1/auth/', routes);
}
