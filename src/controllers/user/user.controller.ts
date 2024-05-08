import { Request, Response } from 'express';
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
import { UploadedFile } from 'express-fileupload';

export async function findSurveyByProfile(req: Request, res: Response): Promise<void> {
  const request = findSurveyByProfileSchema.safeParse(req.query);
  if (!request.success) {
    res.status(StatusCode.BadRequest).json({ status: StatusValue.Failed, data: { error: request.error.message } });
    return;
  }
  let language = request.data.language;
  if (!language) {
    language = 'en-US';
  }
  const response = await userService.findSurveyByProfile(request.data.profileId, language);
  res.status(response.code).json({ status: response.status, data: response.data });
}

export async function findPartialSurvey(req: Request, res: Response): Promise<void> {
  const request = findPartialSurveyByProfileSchema.safeParse(req.query);
  if (!request.success) {
    res.status(StatusCode.BadRequest).json({ status: StatusValue.Failed, data: { error: request.error.message } });
    return;
  }
  let language = request.data.language;
  if (!language) {
    language = 'en-US';
  }
  const response = await userService.findAnsweredQuestions(request.data.profileId, language, request.data.userId);
  res.status(response.code).json({ status: response.status, data: response.data });
}

export async function updateUserProfile(req: Request, res: Response): Promise<void> {
  const request = updateUserProfileSchema.safeParse(req.body);
  if (!request.success) {
    res.status(StatusCode.BadRequest).json({ status: StatusValue.Failed, data: { error: request.error.message } });
    return;
  }

  const response = await userService.updateUserProfile(request.data.userId, request.data.profileId);
  res.status(response.code).json({ status: response.status, data: response.data });
}

export async function findProfiles(req: Request, res: Response): Promise<void> {
  const request = findProfileSchema.safeParse(req.query);
  if (!request.success) {
    res.status(StatusCode.BadRequest).json({ status: StatusValue.Failed, data: { error: request.error.message } });
    return;
  }
  let language = request.data.language;
  if (!language) {
    language = 'en-US';
  }

  const response = await userService.findProfiles(language);
  res.status(response.code).json({ status: response.status, data: response.data });
}


export async function insertAnswers(req: Request, res: Response): Promise<void> {
  const request = userResponseSchema.safeParse(req.body);
  if (!request.success) {
    res.status(StatusCode.BadRequest).json({ status: StatusValue.Failed, data: { error: request.error.message } });
    return;
  }
  const response = await userService.insertUserResponse(request.data);
  res.status(response.code).json({ status: response.status, data: response.data });
}

export async function computeScore(req: Request, res: Response): Promise<void> {
  const request = userIdSchema.safeParse(req.query);
  if (!request.success) {
    res.status(StatusCode.BadRequest).json({ status: StatusValue.Failed, data: { error: request.error.message } });
    return;
  }

  const response = await userService.computeScore(request.data.userId);
  res.status(response.code).json({ status: response.status, data: response.data });
}

export async function findUser(req: Request, res: Response): Promise<void> {
  const request = userIdSchema.safeParse(req.query);
  if (!request.success) {
    res.status(StatusCode.BadRequest).json({ status: StatusValue.Failed, data: { error: request.error.message } });
    return;
  }

  const response = await userService.findUserInfo(request.data.userId);
  res.status(response.code).json({ status: response.status, data: response.data });
}

export async function updateUser(req: Request, res: Response): Promise<void> {
  const request = updateUserSchema.safeParse(req.body);
  if (!request.success) {
    res.status(StatusCode.BadRequest).json({ status: StatusValue.Failed, data: { error: request.error.message } });
    return;
  }
  if(req.files == null){
    res.status(StatusCode.BadRequest).json({ status: StatusValue.Failed, data: { error: 'file is required' } });
    return;
  }
  const filePath = req.files.fileName as UploadedFile;
  const response = await userService.updateUser(request.data, filePath.tempFilePath);
  res.status(response.code).json({ status: response.status, data: response.data });
}
