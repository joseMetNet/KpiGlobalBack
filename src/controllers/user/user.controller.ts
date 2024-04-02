import { Request, Response } from 'express';
import { StatusCode, StatusValue } from '../../interface';
import { userService } from '../../services';
import { findProfileSchema, findSurveyByProfileSchema, updateUserProfileSchema, userResponseSchema } from './user.schema';

export async function findSurveyByProfile(req: Request, res: Response): Promise<void> {
  const request = findSurveyByProfileSchema.safeParse(req.query);
  if (!request.success) {
    res.status(StatusCode.BadRequest).json({ status: StatusValue.Failed, data: { error: request.error.message } });
    return;
  }
  let language = request.data.language;
  if(!language){
    language = 'en-EN';
  }
  const response = await userService.findSurveyByProfile(request.data.profileId, language);
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

  const response = await userService.findProfiles(request.data.language);
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
