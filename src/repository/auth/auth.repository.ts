import { RegisterRequest, ResponseEntity, AuthTokenPayload, AuthRequest, VerifyUserRequest, StatusCode, ChangePasswordRequest } from '../../interface/example';
import { User } from '../user/user.model';
import * as verificationRepository from './verification.repository';
import { CustomError, config } from '../../config';
import { BcryptAdapter } from './BcryptAdapter';
import  * as helper from './helper';
import { VerificationStatus } from '../model/verification.model';
import { BuildResponse } from '../../utils';

export async function register(request: RegisterRequest): Promise<ResponseEntity> {
	try {
		const userExist: number | CustomError = await findUserByEmail(request.email);
		if (typeof userExist === 'number') {
			return BuildResponse.buildErrorResponse(StatusCode.Conflict, { error: 'User already exist' });
		}

		const partialUser: number | CustomError = await registerRequest(request);
		if (partialUser instanceof CustomError) {
			return BuildResponse.buildErrorResponse(partialUser.statusCode, { error: partialUser.message });
		}

		request.password = hashPassword(request.password);
		const newUser = await User.create({
			id: partialUser,
			firstName: request.firstName,
			lastName: request.lastName,
			email: request.email
		});

		const payload: AuthTokenPayload = { id: newUser.id };
		const token = helper.createAuthToken(payload);
		return BuildResponse.buildSuccessResponse(StatusCode.ResourceCreated, { token: token });
	}
	catch (err: any) {
		console.log(err);
		return BuildResponse.buildErrorResponse(StatusCode.InternalErrorServer, { error: err.message });
	}
}

export async function login(request: AuthRequest): Promise<ResponseEntity> {
	const userExist: number | CustomError = await findUserByEmail(request.email);
	if (userExist instanceof CustomError) {
		console.log(`User exist => ${userExist}`);
		BuildResponse.buildErrorResponse(userExist.statusCode, { error: userExist.message });
	}
	const authStatus: number | CustomError = await authRequest(request);
	if (authStatus instanceof CustomError) {
		return BuildResponse.buildErrorResponse(authStatus.statusCode, { error: authStatus.message });
	}

	const payload: AuthTokenPayload = { id: authStatus };
	const token = helper.createAuthToken(payload);
	return BuildResponse.buildSuccessResponse(StatusCode.Ok, { token: token });
}


export async function sendVerificationEmail(email: string): Promise<ResponseEntity>{
	const userExist: number | CustomError = await findUserByEmail(email);
	console.log(userExist);
	if (userExist instanceof CustomError) {
		return BuildResponse.buildErrorResponse(userExist.statusCode, { error: userExist.message });
	}

	const codeExist: string | CustomError = await findVerificationCodeWithEmail(email);
	let verificationCode: CustomError | string;
	if(codeExist instanceof CustomError){
		const response = await verificationRepository.createCode(email);
		if(response instanceof CustomError){
			return BuildResponse.buildErrorResponse(response.statusCode, { error: response.message });
		}
		verificationCode = response;
	}else {
		verificationCode = codeExist;
	}

	const verificationEmail: string | CustomError = await helper.sendVerificationEmail(verificationCode, email);
	if (verificationEmail instanceof CustomError) {
		return BuildResponse.buildErrorResponse(verificationEmail.statusCode, { error: verificationEmail.message });
	}

	return BuildResponse.buildSuccessResponse(StatusCode.ResourceCreated, { message: 'Verification code has been sent.' });
}

export async function verifyUser(request: VerifyUserRequest): Promise<ResponseEntity> {
	const isValid: CustomError | VerificationStatus = await findCode(request);
	if (isValid instanceof CustomError) {
		return BuildResponse.buildErrorResponse(isValid.statusCode, { error: isValid.message });
	}

	const verificationStatus: string | CustomError = await verifyAuthCode(request.email);
	if (verificationStatus instanceof CustomError) {
		return BuildResponse.buildErrorResponse(verificationStatus.statusCode, { error: verificationStatus.message });
	}

	const userId = await findUserByEmail(request.email) as number; // At this point we are sure of the user existence.
	const payload: AuthTokenPayload = { id: userId };
	const token = helper.createAuthToken(payload);
	return BuildResponse.buildSuccessResponse(StatusCode.Ok, { token: token });
}

export async function resetPassword(request: ChangePasswordRequest): Promise<ResponseEntity> {
	const changePasswordStatus = await changePasswordRequest(request);
	if(changePasswordStatus instanceof CustomError){
		return BuildResponse.buildErrorResponse(changePasswordStatus.statusCode, { error: changePasswordStatus.message });
	}
  
	return BuildResponse.buildSuccessResponse(StatusCode.Ok, {message: changePasswordStatus});
}

async function findVerificationCodeWithEmail(email: string): Promise<CustomError | string> {
	try {
		const code = await VerificationStatus.findOne({
			where: {
				email: email
			}
		});
		if(!code){
			return CustomError.notFound(`Verification code for email ${email} not found.`);
		}
		return code.code;
	}catch (err: any){
		return CustomError.internalServer(err.message);
	}
}

async function verifyAuthCode(email: string): Promise<CustomError | string> {
	try {
		const user = await User.update({
			isEmailVerified: true
		}, {
			where: {
				email: email
			}
		});
		console.log(`Updated user conde ${user}`);
		if (!user) {
			return CustomError.notFound('User not found');
		}
		return 'User verified';
	} catch (err: any) {
		return CustomError.badRequest(err.message);
	}
}

async function findCode(request: VerifyUserRequest): Promise<VerificationStatus | CustomError> {
	try {
		const codeExist = await VerificationStatus.findOne({
			where: {
				code: request.code,
				email: request.email
			}
		});
		if (!codeExist) {
			return CustomError.notFound('Code and email combination doesnt exist');
		}

		return codeExist;

	} catch (err: any) {
		return CustomError.internalServer(err.message);
	}
}

async function findUserByEmail(email: string): Promise<CustomError | number> {
	const headers = new Headers();
	headers.append('Content-Type', 'application/json');
	const requestOptions: RequestInit = {
		method: 'GET',
		headers: headers,
		redirect: 'follow'
	};
	const url = `${config.AUTH_URL}/UserManagement?userGroup=${config.USER_GROUP}&userName=${email}`;
	const response = await fetch(url, requestOptions);
	const data = await response.json();
	if (response.ok) {
		return data.data[0].id as number;
	}
	return CustomError.notFound('User not found');
}

async function changePasswordRequest(request: ChangePasswordRequest): Promise<string | CustomError> {
	const headers = new Headers();
	headers.append('Content-Type', 'application/json');
	const payload = JSON.stringify({
		'userGroup': config.USER_GROUP,
		'password': request.password,
		'userName': request.email
	});
	const requestOptions: RequestInit = {
		method: 'PUT',
		headers: headers,
		body: payload,
		redirect: 'follow'
	};
	const response = await fetch(`${config.AUTH_URL}/UserManagement/recoverPassword`, requestOptions);
  
	if (!response.ok) {
		const message = await response.json();
		return CustomError.internalServer(message.data[0].msg);
	}
	const data = await response.json();
	return data.message;
}

async function registerRequest(request: RegisterRequest): Promise<number | CustomError> {
	const headers = new Headers();
	headers.append('Content-Type', 'application/json');
	const payload = JSON.stringify({
		'userGroup': config.USER_GROUP,
		'password': request.password,
		'userName': request.email
	});
	const requestOptions: RequestInit = {
		method: 'POST',
		headers: headers,
		body: payload,
		redirect: 'follow'
	};
	const response = await fetch(`${config.AUTH_URL}/UserManagement`, requestOptions);

	if (!response.ok) {
		const message = await response.json();
		return CustomError.internalServer(message.data[0].msg);
	}
	const data = await response.json();
	return data.data[0].id;
}

async function authRequest(request: AuthRequest): Promise<CustomError | number> {
	const headers = new Headers();
	headers.append('Content-Type', 'application/json');
	const payload = JSON.stringify({
		'userGroup': config.USER_GROUP,
		'password': request.password,
		'userName': request.email
	});
	const requestOptions: RequestInit = {
		method: 'POST',
		headers: headers,
		body: payload,
		redirect: 'follow'
	};
	const response = await fetch(`${config.AUTH_URL}/UserManagement/authenticationUser`, requestOptions);
	const data = await response.json();
	if (!response.ok) {
		return CustomError.conflict('Invalid credentials');
	}
	return data.data.id;
}

type HashFunction = (password: string) => string;
const hashPassword: HashFunction = BcryptAdapter.hash;
