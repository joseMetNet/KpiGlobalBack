import { z } from 'zod';

export const findSurveyByProfileSchema = z.object({
	profileId: z.coerce.number(),
	categoryId: z.coerce.number(),
	language: z.string()
});
