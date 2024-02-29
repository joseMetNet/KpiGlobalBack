import { Request, Response } from 'express';
import * as authRepository from '../../repository/auth/auth.repository';
import { authSchema, registerSchema, verifyUserSchema } from './auth.schema';
import { ResponseEntity, StatusCode, StatusValue } from '../../interface/example';
import { CustomError } from '../../config';

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

export async function verifyUser(req: Request, res: Response): Promise<void> {
	const request = verifyUserSchema.safeParse(req.body);
	if (!request.success) {
		res.status(StatusCode.BadRequest).json({ status: StatusValue.Failed, data: {error: request.error.message} });
		return;
	}
	const response: ResponseEntity| CustomError = await authRepository.verifyUser(request.data);
	res.status(response.code).json({status: response.status , data: response.data});
}
