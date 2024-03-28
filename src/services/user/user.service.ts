import { ResponseEntity, StatusCode } from '../../interface';
import { userRepository } from '../../repositories';
import { BuildResponse } from '../BuildResponse';

export async function findSurveyByProfile(profileId: number, categoryId: number, language: string): Promise<ResponseEntity> {
	try {
		const survey = await userRepository.findSurveyByProfile(profileId, categoryId, language);
		return BuildResponse.buildSuccessResponse(StatusCode.Ok, survey);
	}catch(err: any) {
		return BuildResponse.buildErrorResponse(StatusCode.InternalErrorServer, err);
	}
}
