import { CustomError } from '../../config/CustomError';
import { VerificationStatus } from '../model/verification.model';

export async function createCode(email: string): Promise<string | CustomError>{
	try {
		const randomCode = generateRandomString();
		const status = await VerificationStatus.create({
			email: email,
			code: randomCode
		});
		return status.code;
	}catch (e: any){
		return CustomError.internalServer(e.message);
	}
}

function generateRandomString(): string {
	const chars: string = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
	let result: string = '';
	const randomArray: Uint8Array = new Uint8Array(5);
	crypto.getRandomValues(randomArray);
	randomArray.forEach((value: number): void => {
		result += chars[value % chars.length];
	});
	return result;
}
