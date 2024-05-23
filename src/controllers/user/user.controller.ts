import { Request, Response } from 'express';
import { UploadedFile } from 'express-fileupload';
import { StatusCode, StatusValue } from '../../interface';
import { userService } from '../../services';
import {
  findPartialSurveyByProfileSchema,
  findProfileSchema,
  findSurveyByProfileSchema,
  updateUserProfileSchema,
  updateUserSchema,
  userIdSchema,
  userResponseSchema
} from './user.schema';
import { formatZodError } from '../../middleware';
import { ZodError } from 'zod';

class UserController {

  private handleError(res: Response, error: ZodError): void {
    res.status(StatusCode.BadRequest).json({ 
      status: StatusValue.Failed, 
      data: { error: formatZodError(error) } 
    });
  }
  async findSurveyByProfile(req: Request, res: Response): Promise<void> {
    const request = findSurveyByProfileSchema.safeParse(req.query);
    if (!request.success) {
      this.handleError(res, request.error);
      return;
    }
    const language = request.data.language || 'en-US';
    const response = await userService.findSurveyByProfile(request.data.profileId, language);
    res.status(response.code).json({ status: response.status, data: response.data });
  }

  async findPartialSurvey(req: Request, res: Response): Promise<void> {
    const request = findPartialSurveyByProfileSchema.safeParse(req.query);
    if (!request.success) {
      this.handleError(res, request.error);
      return;
    }
    const language = request.data.language || 'en-US';
    const response = await userService.findAnsweredQuestions(request.data.profileId, language, request.data.userId);
    res.status(response.code).json({ status: response.status, data: response.data });
  }

  async updateUserProfile(req: Request, res: Response): Promise<void> {
    const request = updateUserProfileSchema.safeParse(req.body);
    if (!request.success) {
      this.handleError(res, request.error);
      return;
    }
    const response = await userService.updateUserProfile(request.data.userId, request.data.profileId);
    res.status(response.code).json({ status: response.status, data: response.data });
  }

  async findProfiles(req: Request, res: Response): Promise<void> {
    const request = findProfileSchema.safeParse(req.query);
    if (!request.success) {
      this.handleError(res, request.error);
      return;
    }
    const language = request.data.language || 'en-US';
    const response = await userService.findProfiles(language);
    res.status(response.code).json({ status: response.status, data: response.data });
  }

  async insertAnswers(req: Request, res: Response): Promise<void> {
    const request = userResponseSchema.safeParse(req.body);
    if (!request.success) {
      this.handleError(res, request.error);
      return;
    }
    const response = await userService.insertUserResponse(request.data);
    res.status(response.code).json({ status: response.status, data: response.data });
  }

  async computeScore(req: Request, res: Response): Promise<void> {
    const request = userIdSchema.safeParse(req.query);
    if (!request.success) {
      this.handleError(res, request.error);
      return;
    }
    const response = await userService.computeScore(request.data.userId);
    res.status(response.code).json({ status: response.status, data: response.data });
  }

  async findUser(req: Request, res: Response): Promise<void> {
    const request = userIdSchema.safeParse(req.query);
    if (!request.success) {
      this.handleError(res, request.error);
      return;
    }
    const response = await userService.findUserInfo(request.data.userId, req.body.user.profileId);
    res.status(response.code).json({ status: response.status, data: response.data });
  }

  async updateUser(req: Request, res: Response): Promise<void> {
    const request = updateUserSchema.safeParse(req.body);
    if (!request.success) {
      this.handleError(res, request.error);
      return;
    }
    const filePath = req.files? (req.files.fileName as UploadedFile).tempFilePath: undefined;
    const response = await userService.updateUser(request.data, filePath);
    res.status(response.code).json({ status: response.status, data: response.data });
  }
}

export const userController = new UserController();