import {z} from 'zod';

export const registerSchema = z.object({
	firstName: z.string(),
	lastName: z.string(),
	email: z.string(),
	password: z.string()
});

export const authSchema = z.object({
	email: z.string(),
	password: z.string(),
});

export const sendEmailVerificationSchema = z.object({
	email: z.string(),
});

export const resetPasswordSchema = z.object({
	email: z.string(),
	password: z.string().min(8),
});

export const verifyUserSchema = z.object({
	code: z.string().length(5),
	email: z.string()
});
