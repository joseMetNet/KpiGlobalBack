import { Request, Response } from 'express';
import * as authRepository from '../../repository/auth/auth.repository';
import { authSchema, registerSchema, resetPasswordSchema, sendEmailVerificationSchema, verifyUserSchema } from './auth.schema';
import { ResponseEntity, StatusCode, StatusValue } from '../../interface/example';

export async function register(req: Request, res: Response): Promise<void> {
	const request = registerSchema.safeParse(req.body);
	if (!request.success) {
		res.status(StatusCode.BadRequest).json({ status: StatusValue.Failed, data: {error: request.error.message} });
		return;
	}
	const response = await authRepository.register(request.data);
	res.status(response.code).json({status: response.status , data: response.data});
}


export async function login(req: Request, res: Response): Promise<void> {
	const request = authSchema.safeParse(req.body);
	if (!request.success) {
		res.status(StatusCode.BadRequest).json({ status: StatusValue.Failed, data: {error: request.error.message} });
		return;
	}
	const response = await authRepository.login(request.data);
	res.status(response.code).json({status: response.status , data: response.data});
}

export async function sendVerificationEmail(req: Request, res: Response): Promise<void> {
	const request = sendEmailVerificationSchema.safeParse(req.body);
	if(!request.success){
		res.status(StatusCode.BadRequest).json({ status: StatusValue.Failed, data: {error: request.error.message} });
		return;
	}
	const response = await authRepository.sendVerificationEmail(request.data.email);
	res.status(200).json({status: response.status , data: response.data});
}

export async function verifyUser(req: Request, res: Response): Promise<void> {
	const request = verifyUserSchema.safeParse(req.body);
	if (!request.success) {
		res.status(StatusCode.BadRequest).json({ status: StatusValue.Failed, data: {error: request.error.message} });
		return;
	}
	const response = await authRepository.verifyUser(request.data);
	res.status(response.code).json({status: response.status , data: response.data});
}

export async function resetPassword(req: Request, res: Response): Promise<void> {
	const request = resetPasswordSchema.safeParse(req.body);
	if (!request.success) {
		res.status(StatusCode.BadRequest).json({ status: StatusValue.Failed, data: {error: request.error.message} });
		return;
	}
	const response = await authRepository.resetPassword(request.data);
	res.status(response.code).json({status: response.status , data: response.data});
}

