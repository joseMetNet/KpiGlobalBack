import { Request, Response } from 'express';
import { StatusCode, StatusValue } from '../../interface';
import { userService } from '../../services';
import { findSurveyByProfileSchema } from './user.schema';

export async function findSurveyByProfile(req: Request, res: Response): Promise<void> {
	const request = findSurveyByProfileSchema.safeParse(req.body);
	if (!request.success) {
		res.status(StatusCode.BadRequest).json({ status: StatusValue.Failed, data: { error: request.error.message } });
		return;
	}
	const {profileId, categoryId, language } = request.data;
	const response = await userService.findSurveyByProfile(profileId, categoryId, language);
	res.status(response.code).json({ status: response.status, data: response.data });
}
