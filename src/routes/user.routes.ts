import { Application, Router } from 'express';
import { check } from 'express-validator';
import { validateEndpoint, authentication } from '../middleware';
import { userController } from '../controllers';

export function userRoutes(app: Application): void {
  const routes: Router = Router();

  /**
   * @openapi
   * components:
   *  parameters:
   *    language:
   *      required: false
   *      in: query
   *      name: language
   *      default: en-US
   *      schema:
   *        type: string
   *      description: Language to query
   *    profileId:
   *      required: true
   *      in: query
   *      name: profileId
   *      schema:
   *        type: number
   *      description: Profile to query
   *    userId:
   *      required: true
   *      in: query
   *      name: userId
   *      schema:
   *        type: number
   *      description: Required user
   *    optionalUserId:
   *      required: false
   *      in: query
   *      name: userId
   *      schema:
   *        type: number
   *      description: Required used
   *
   *  responses:
   *    completeSurvey:
   *      type: object
   *      properties:
   *        status:
   *          type: string
   *          example: SUCCESS
   *        data:
   *          type: array
   *          items:
   *            $ref: '#/components/schemas/survey'
   *    successResponse:
   *      type: object
   *      properties:
   *        status:
   *          type: string
   *          example: SUCCESS
   *        data:
   *          type: array
   *          items:
   *            $ref: '#/components/schemas/messageSchema'
   *    failedResponse:
   *      type: object
   *      properties:
   *        status:
   *          type: string
   *          example: FAILED
   *        data:
   *          type: object
   *          properties:
   *            property1:
   *              type: string
   *            property2:
   *              type: string
   *            property3:
   *              type: string
   *            propertyn:
   *              type: string
   *    successProfile:
   *      type: object
   *      properties:
   *        status:
   *          type: string
   *          example: SUCCESS
   *        data:
   *          type: array
   *          items:
   *            $ref: '#/components/schemas/profileSchema'
   *
   *  schemas:
   *    updateUserSchema:
   *      type: object
   *      properties:
   *        firstName:
   *          type: string
   *        lastName:
   *          type: string
   *        
   *    survey:
   *      type: object
   *      properties:
   *        id:
   *          type: number
   *        profile_id:
   *          type: number
   *        category_id:
   *          type: number
   *        question_number:
   *          type: number
   *        question:
   *          type: string
   *        Profile:
   *          $ref: '#/components/schemas/userProfile'
   *        answerOptions:
   *          type: array
   *          items:
   *            $ref: '#/components/schemas/answerOption'
   *        category:
   *          $ref: '#/components/schemas/category'
   *        language:
   *          $ref: '#/components/schemas/language'
   *    userResponse:
   *      type: object
   *      properties:
   *        userId:
   *          type: number
   *        questionId:
   *          type: number
   *        answerOptionId:
   *          type: number
   *        openAnswerText:
   *          type: string
   *    userProfile:
   *      type: object
   *      properties:
   *        id:
   *          type: number
   *        profile:
   *          type: string
   *    answerOption:
   *      type: object
   *      properties:
   *        id:
   *          type: number
   *        question_id:
   *          type: number
   *        answer_option:
   *          type: string
   *    category:
   *      type: object
   *      properties:
   *        id:
   *          type: number
   *        category:
   *          type: string
   *    language:
   *      type: object
   *      properties:
   *        id:
   *          type: number
   *        language:
   *          type: string
   *    profileSchema:
   *      type: object
   *      properties:
   *        id:
   *          type: number
   *        profile:
   *          type: string
   *        photoUrl:
   *          type: string
   *        videoUrl:
   *          type: string
   *        description:
   *          type: string
   *    messageSchema:
   *      type: object
   *      properties:
   *        message:
   *          type: string
   */

  /**
   * @openapi
   *  /v1/user/survey:
   *    get:
   *      tags: [User Controller]
   *      summary: Get survey questions
   *      parameters:
   *        - $ref: "#/components/parameters/language"
   *        - $ref: "#/components/parameters/profileId"
   *      responses:
   *        '200':
   *          description: Successful response
   *          content:
   *            application/json:
   *              schema:
   *                $ref: '#/components/responses/completeSurvey'
   *        '500':
   *          description: Internal error server
   *          content:
   *            application/json:
   *              schema:
   *                $ref: '#/components/responses/failedResponse'
   */
  routes.get(
    '/survey',
    [check('profileId', 'profileId is required').notEmpty()],
    validateEndpoint,
    authentication,
    userController.findSurveyByProfile
  );

  /**
   * @openapi
   *  /v1/user/survey-answered:
   *    get:
   *      tags: [User Controller]
   *      summary: Get survey questions
   *      parameters:
   *        - $ref: "#/components/parameters/language"
   *        - $ref: "#/components/parameters/profileId"
   *        - $ref: "#/components/parameters/optionalUserId"
   *      responses:
   *        '200':
   *          description: Successful response
   *          content:
   *            application/json:
   *              schema:
   *                $ref: '#/components/responses/completeSurvey'
   *        '500':
   *          description: Internal error server
   *          content:
   *            application/json:
   *              schema:
   *                $ref: '#/components/responses/failedResponse'
   */
  routes.get(
    '/survey-answered',
    [check('profileId', 'profileId is required').notEmpty()],
    validateEndpoint,
    authentication,
    userController.findPartialSurvey
  );

  /**
   * @openapi
   *  /v1/user/profile:
   *    patch:
   *      tags: [User Controller]
   *      summary: Set the user profile
   *      requestBody:
   *        required: true
   *        content:
   *          application/json:
   *            schema:
   *              type: object
   *              properties:
   *                userId:
   *                  type: integer
   *                profileId:
   *                  type: integer
   *      responses:
   *        '200':
   *          description: Successful response
   *          content:
   *            application/json:
   *              schema:
   *                $ref: '#/components/responses/successResponse'
   *        '500':
   *          description: Internal error server
   *          content:
   *            application/json:
   *              schema:
   *                $ref: '#/components/responses/failedResponse'
   */
  routes.patch(
    '/profile',
    [check('profileId', 'profileId is required').notEmpty()],
    [check('userId', 'userId is required').notEmpty()],
    validateEndpoint,
    authentication,
    userController.updateUserProfile
  );

  /**
   * @openapi
   *  /v1/user/profile:
   *    get:
   *      tags: [User Controller]
   *      summary: Get user profile information by language
   *      parameters:
   *        - $ref: "#/components/parameters/language"
   *      responses:
   *        '200':
   *          description: Successful response
   *          content:
   *            application/json:
   *              schema:
   *                $ref: '#/components/responses/successProfile'
   *        '500':
   *          description: Internal error server
   *          content:
   *            application/json:
   *              schema:
   *                $ref: '#/components/responses/failedResponse'
   */
  routes.get(
    '/profile',
    validateEndpoint,
    authentication,
    userController.findProfiles
  );

  /**
   * @openapi
   *  /v1/user/user-response:
   *    post:
   *      tags: [User Controller]
   *      summary: Save user response
   *      requestBody:
   *        required: true
   *        content:
   *          application/json:
   *            schema:
   *              type: array
   *              items: 
   *                $ref: '#/components/schemas/userResponse'
   *      responses:
   *        '200':
   *          description: Successful response
   *          content:
   *            application/json:
   *              schema:
   *                $ref: '#/components/responses/successResponse'
   *        '500':
   *          description: Internal error server
   *          content:
   *            application/json:
   *              schema:
   *                $ref: '#/components/responses/failedResponse'
   */
  routes.post(
    '/user-response',
    validateEndpoint,
    authentication,
    userController.insertAnswers
  );

  /**
   * @openapi
   *  /v1/user/compute-score:
   *    get:
   *      tags: [User Controller]
   *      summary: Compute the user score
   *      parameters:
   *        - $ref: "#/components/parameters/userId"
   *      responses:
   *        '200':
   *          description: Successful response
   *          content:
   *            application/json:
   *              schema:
   *                $ref: '#/components/responses/successResponse'
   *        '500':
   *          description: Internal error server
   *          content:
   *            application/json:
   *              schema:
   *                $ref: '#/components/responses/failedResponse'
   */
  routes.get(
    '/compute-score',
    validateEndpoint,
    authentication,
    userController.computeScore
  );
  app.use('/api/v1/user/', routes);

  /**
   * @openapi
   *  /v1/user:
   *    get:
   *      tags: [User Controller]
   *      summary: Find user information
   *      parameters:
   *        - $ref: "#/components/parameters/userId"
   *      responses:
   *        '200':
   *          description: Successful response
   *          content:
   *            application/json:
   *              schema:
   *                $ref: '#/components/responses/successResponse'
   *        '500':
   *          description: Internal error server
   *          content:
   *            application/json:
   *              schema:
   *                $ref: '#/components/responses/failedResponse'
   */
  routes.get(
    '/',
    [check('userId', 'userId is required').notEmpty(), validateEndpoint],
    validateEndpoint,
    authentication,
    userController.findUserInfo
  );
  app.use('/api/v1/user', routes);

  /**
   * @openapi
   *  /v1/user:
   *    patch:
   *      tags: [User Controller]
   *      summary: Update user information
   *      requestBody:
   *        required: true
   *        content:
   *          application/json:
   *            schema:
   *              $ref: '#/components/schemas/updateUserSchema'
   *          image/png:
   *            schema:
   *              type: string
   *              format: binary
   *      responses:
   *        '200':
   *          description: Successful response
   *          content:
   *            application/json:
   *              schema:
   *                $ref: '#/components/responses/successResponse'
   *        '500':
   *          description: Internal error server
   *          content:
   *            application/json:
   *              schema:
   *                $ref: '#/components/responses/failedResponse'
   */
  routes.patch(
    '/',
    [check('userId', 'userId is required').notEmpty(), validateEndpoint],
    validateEndpoint,
    authentication,
    userController.findUserInfo
  );
  app.use('/api/v1/user/', routes);
}
