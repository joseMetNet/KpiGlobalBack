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

export const verifyUserSchema = z.object({
	code: z.string().length(8),
	email: z.string()
});
