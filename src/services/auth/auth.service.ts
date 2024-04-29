import { CustomError } from '../../config';
import { UserDto } from '../../interface';
import { RegisterRequest, ResponseEntity, AuthTokenPayload, AuthRequest, VerifyUserRequest, StatusCode, ChangePasswordRequest } from '../../interface';
import { User, VerificationStatus, authRepository, userRepository, verificationRepository } from '../../repositories';
import { BuildResponse } from '../BuildResponse';
import * as helper from '../helper';

export async function register(request: RegisterRequest): Promise<ResponseEntity> {
  try {
    const userExist: number | CustomError = await authRepository.findUserIdByEmail(request.email);
    if (typeof userExist === 'number') {
      return BuildResponse.buildErrorResponse(StatusCode.Conflict, { error: 'User already exist' });
    }

    const partialUser: number | CustomError = await authRepository.registerRequest(request);
    if (partialUser instanceof CustomError) {
      return BuildResponse.buildErrorResponse(partialUser.statusCode, { error: partialUser.message });
    }

    request.password = authRepository.hashPassword(request.password);
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
  const userExist: number | CustomError = await authRepository.findUserIdByEmail(request.email);
  if (userExist instanceof CustomError) {
    console.log(`User exist => ${userExist}`);
    BuildResponse.buildErrorResponse(userExist.statusCode, { error: userExist.message });
  }
  const authStatus: number | CustomError = await authRepository.authRequest(request);
  if (authStatus instanceof CustomError) {
    return BuildResponse.buildErrorResponse(authStatus.statusCode, { error: authStatus.message });
  }

  const user: CustomError | UserDto = await userRepository.findUserById(authStatus);

  if (user instanceof CustomError) {
    return BuildResponse.buildErrorResponse(user.statusCode, { error: user.message });
  }

  const payload: AuthTokenPayload = { id: user.id, profileId: user.profileId };
  const token = helper.createAuthToken(payload);
  return BuildResponse.buildSuccessResponse(StatusCode.Ok, { isRegistrationCompleted: user.isRegistrationCompleted, token: token });
}


export async function sendVerificationEmail(email: string): Promise<ResponseEntity> {
  const userExist: number | CustomError = await authRepository.findUserIdByEmail(email);
	console.log(userExist)
  if (userExist instanceof CustomError) {
    return BuildResponse.buildErrorResponse(userExist.statusCode, { error: userExist.message });
  }

  let verificationCode: string;
  const codeExist: string | CustomError = await verificationRepository.findVerificationCodeWithEmail(email);
  if (codeExist instanceof CustomError) {
    if(codeExist.statusCode === StatusCode.InternalErrorServer) {
      return BuildResponse.buildErrorResponse(codeExist.statusCode, { error: codeExist.message });
    }
    const newCode = await verificationRepository.createCode(email);
    if (newCode instanceof CustomError) {
      return BuildResponse.buildErrorResponse(newCode.statusCode, { error: newCode.message });
    }
    verificationCode = newCode;
  }
  else {
    const newCode = verificationRepository.generateRandomString();
    const newVerificationCode = await verificationRepository.updateVerificationCode(email, newCode);
    if (newVerificationCode instanceof CustomError) {
      return BuildResponse.buildErrorResponse(newVerificationCode.statusCode, { error: newVerificationCode.message });
    }
    verificationCode = newCode;
  }


  const verificationEmail: string | CustomError = await helper.sendVerificationEmail(verificationCode, email);
  if (verificationEmail instanceof CustomError) {
    return BuildResponse.buildErrorResponse(verificationEmail.statusCode, { error: verificationEmail.message });
  }

  return BuildResponse.buildSuccessResponse(StatusCode.ResourceCreated, { message: 'Verification code has been sent.' });
}

export async function verifyUser(request: VerifyUserRequest): Promise<ResponseEntity> {
  const isValid: CustomError | VerificationStatus = await verificationRepository.findCode(request);
  if (isValid instanceof CustomError) {
    return BuildResponse.buildErrorResponse(isValid.statusCode, { error: isValid.message });
  }

  const userId = await authRepository.findUserIdByEmail(request.email);
  if(userId instanceof CustomError) {
    return BuildResponse.buildErrorResponse(userId.statusCode, {error: userId.message});
  }
  
  const user = await userRepository.findUserById(userId) as UserDto;
  const payload: AuthTokenPayload = { id: userId, profileId: user.profileId };
  const token = helper.createAuthToken(payload);
  return BuildResponse.buildSuccessResponse(StatusCode.Ok, { token: token });
}

export async function resetPassword(request: ChangePasswordRequest): Promise<ResponseEntity> {
  const changePasswordStatus = await authRepository.changePasswordRequest(request);
  if (changePasswordStatus instanceof CustomError) {
    return BuildResponse.buildErrorResponse(changePasswordStatus.statusCode, { error: changePasswordStatus.message });
  }

  return BuildResponse.buildSuccessResponse(StatusCode.Ok, { message: changePasswordStatus });
}
