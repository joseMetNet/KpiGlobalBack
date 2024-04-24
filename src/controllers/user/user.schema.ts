import { z } from 'zod';

export const findSurveyByProfileSchema = z.object({
  profileId: z.coerce.number(),
  language: z.string().optional(),
});
export const findPartialSurveyByProfileSchema = z.object({
  profileId: z.coerce.number(),
  language: z.string().optional(),
  userId: z.coerce.number().optional()
});

export const updateUserProfileSchema = z.object({
  profileId: z.coerce.number(),
  userId: z.coerce.number()
});

export const findProfileSchema = z.object({
  language: z.string().optional()
});

export const userIdSchema = z.object({
  userId: z.coerce.number()
});

const userAnswerSchema = z.object({
  userId: z.coerce.number(),
  questionId: z.coerce.number(),
  answerOptionId: z.coerce.number(),
  openAnswerText: z.string()
});

export const userResponseSchema = z.array(userAnswerSchema);
