import { NextFunction, Request, Response } from 'express';
import { validationResult } from 'express-validator';
import { StatusValue, StatusCode } from '../interface/example';

const validateEnpoint = (req: Request, res: Response, next: NextFunction) => {
	const error = validationResult(req);
	if (!error.isEmpty()) {
		const data = error.mapped();
		return res
			.status(StatusCode.BadRequest)
			.json({ status: StatusValue.Failed, data: {error: data} });
	}
	next();
};

export { validateEnpoint };
