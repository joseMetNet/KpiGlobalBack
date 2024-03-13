import { CustomError, config } from '../../config';
import { BcryptAdapter } from './BcryptAdapter';
import { ChangePasswordRequest, AuthRequest, RegisterRequest } from '../../interface';

export async function findUserIdByEmail(email: string): Promise<CustomError | number> {
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

export async function changePasswordRequest(request: ChangePasswordRequest): Promise<string | CustomError> {
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


export async function registerRequest(request: RegisterRequest): Promise<number | CustomError> {
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

export async function authRequest(request: AuthRequest): Promise<CustomError | number> {
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

export type HashFunction = (password: string) => string;
export const hashPassword: HashFunction = BcryptAdapter.hash;