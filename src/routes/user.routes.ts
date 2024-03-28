import { check } from 'express-validator';
import { userController } from '../controllers';
import { validateEnpoint } from '../middleware/validatorEnpoint';
import { Application, Router } from 'express';

export function userRoutes(app: Application): void {
	const routes: Router = Router();

	/**
     * @openapi
     * '/v1/user/survey':
     *   post:
     *     security: []
     *     tags:
     *       - User Controller
     *     summary: Register user survey.
     *     requestBody:
     *       required: true
     *       content:
     *         application/json:
     *           schema:
     *             type: object
     *             required:
     *               - profileId
     *               - categoryId
     *             properties:
     *               profileId:
     *                 type: number
     *                 default: 0
     *               categoryId:
     *                 type: number
     *                 default: 0
     *     responses:
     *       '201':
     *         description: Created
     *         content:
     *           application/json:
     *             schema:
     *               $ref: '#/components/responses/SuccessResponse'
     *       '409':
     *         description: Conflict
     *       '404':
     *         description: Not Found
     *       '500':
     *         description: Server Error
     * components:
     *   responses:
     *     SuccessResponse:
     *       type: object
     *       properties:
     *         status:
     *           type: string
     *           example: SUCCESS
     *         data:
     *           type: array
     *           items:
     *             $ref: '#/components/schemas/UserSurvey'
     *   schemas:
     *     UserSurvey:
     *       type: object
     *       properties:
     *         id:
     *           type: number
     *         profile_id:
     *           type: number
     *         category_id:
     *           type: number
     *         question_number:
     *           type: number
     *         question:
     *           type: string
     *         Profile:
     *           $ref: '#/components/schemas/UserProfile'
     *         AnswerOptions:
     *           type: array
     *           items:
     *             $ref: '#/components/schemas/AnswerOption'
     *         Category:
     *           $ref: '#/components/schemas/Category'
     *         Language:
     *           $ref: '#/components/schemas/Language'
     *     UserProfile:
     *       type: object
     *       properties:
     *         id:
     *           type: number
     *         profile:
     *           type: string
     *     AnswerOption:
     *       type: object
     *       properties:
     *         id:
     *           type: number
     *         question_id:
     *           type: number
     *         answer_option:
     *           type: string
     *     Category:
     *       type: object
     *       properties:
     *         id:
     *           type: number
     *         category:
     *           type: string
     *     Language:
     *       type: object
     *       properties:
     *         id:
     *           type: number
     *         language:
     *           type: string
     */
	routes.post(
		'/survey',
		[check('profileId', 'profileId is required').notEmpty(), validateEnpoint],
		[check('categoryId', 'categoryId is required').notEmpty(), validateEnpoint],
		[check('languageId', 'languageId is required').notEmpty(), validateEnpoint],
		userController.findSurveyByProfile
	);
	app.use('/api/v1/user/', routes);
}

