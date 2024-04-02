import { Request, Response } from 'express';
import { authSchema, registerSchema, resetPasswordSchema, sendEmailVerificationSchema, verifyUserSchema } from './auth.schema';
import { authService } from '../../services';
import { StatusCode, StatusValue } from '../../interface';

export async function register(req: Request, res: Response): Promise<void> {
	const request = registerSchema.safeParse(req.body);
	if (!request.success) {
		res.status(StatusCode.BadRequest).json({ status: StatusValue.Failed, data: { error: request.error.message } });
		return;
	}
	const response = await authService.register(request.data);
	res.status(response.code).json({ status: response.status, data: response.data });
}


export async function login(req: Request, res: Response): Promise<void> {
	const request = authSchema.safeParse(req.body);
	if (!request.success) {
		res.status(StatusCode.BadRequest).json({ status: StatusValue.Failed, data: { error: request.error.message } });
		return;
	}
	const response = await authService.login(request.data);
	res.status(response.code).json({ status: response.status, data: response.data });
}

export async function sendVerificationEmail(req: Request, res: Response): Promise<void> {
	const request = sendEmailVerificationSchema.safeParse(req.body);
	if (!request.success) {
		res.status(StatusCode.BadRequest).json({ status: StatusValue.Failed, data: { error: request.error.message } });
		return;
	}
	const response = await authService.sendVerificationEmail(request.data.email);
	res.status(response.code).json({ status: response.status, data: response.data });
}

export async function verifyUser(req: Request, res: Response): Promise<void> {
	const request = verifyUserSchema.safeParse(req.body);
	if (!request.success) {
		res.status(StatusCode.BadRequest).json({ status: StatusValue.Failed, data: { error: request.error.message } });
		return;
	}
	const response = await authService.verifyUser(request.data);
	res.status(response.code).json({ status: response.status, data: response.data });
}

export async function resetPassword(req: Request, res: Response): Promise<void> {
	const request = resetPasswordSchema.safeParse(req.body);
	if (!request.success) {
		res.status(StatusCode.BadRequest).json({ status: StatusValue.Failed, data: { error: request.error.message } });
		return;
	}
	const response = await authService.resetPassword(request.data);
	res.status(response.code).json({ status: response.status, data: response.data });
}
