import { CustomError } from '../../config';
import { VerificationStatus } from '../../models';
import { VerifyUserRequest } from '../../interface';

export async function createCode(email: string): Promise<string | CustomError>{
  try {
    const randomCode = generateRandomString();
    const status = await VerificationStatus.create({
      email: email,
      code: randomCode
    });
    return status.code;
  }catch (err: any){
    return CustomError.internalServer(err.message);
  }
}

export async function updateVerificationCode(email: string, code: string): Promise<CustomError | void> {
  try {
    await VerificationStatus.update(
      { code: code},{
        where: {
          email: email
        }
      }
    );
  } catch (err: any) {
    return CustomError.badRequest(err.message);
  }
}

export async function findVerificationCodeWithEmail(email: string): Promise<CustomError | string> {
  try {
    const code = await VerificationStatus.findOne({
      where: {
        email: email
      }
    });
    if (!code) {
      return CustomError.notFound(`Verification code for email ${email} not found.`);
    }
    return code.code;
  } catch (err: any) {
    return CustomError.internalServer(err.message);
  }
}

export function generateRandomString(): string {
  const chars: string = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  let result: string = '';
  const randomArray: Uint8Array = new Uint8Array(5);
  crypto.getRandomValues(randomArray);
  randomArray.forEach((value: number): void => {
    result += chars[value % chars.length];
  });
  return result;
}

export async function findCode(request: VerifyUserRequest): Promise<VerificationStatus | CustomError> {
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
