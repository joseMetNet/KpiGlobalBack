import { Request, Response } from 'express';
import { 
  authSchema, 
  registerSchema, 
  resetPasswordSchema, 
  sendEmailVerificationSchema, 
  verifyUserSchema 
} from './auth.schema';
import { StatusCode, StatusValue } from '../../interface';
import { formatZodError } from '../../middleware';
import { ZodError } from 'zod';
import { authService } from '../../services';

class AuthController {

  private handleError(res: Response, error: ZodError): void {
    res.status(StatusCode.BadRequest).json({ 
      status: StatusValue.Failed, 
      data: { error: formatZodError(error) } 
    });
  }

  public async register(req: Request, res: Response): Promise<void> {
    const request = registerSchema.safeParse(req.body);
    if (!request.success) {
      this.handleError(res, request.error);
      return;
    }
    const response = await authService.register(request.data);
    res.status(response.code).json({ status: response.status, data: response.data });
  }

  public async login(req: Request, res: Response): Promise<void> {
    const request = authSchema.safeParse(req.body);
    if (!request.success) {
      this.handleError(res, request.error);
      return;
    }
    const response = await authService.login(request.data);
    res.status(response.code).json({ status: response.status, data: response.data });
  }

  public async sendVerificationEmail(req: Request, res: Response): Promise<void> {
    const request = sendEmailVerificationSchema.safeParse(req.body);
    if (!request.success) {
      this.handleError(res, request.error);
      return;
    }
    const response = await authService.sendVerificationEmail(request.data.email);
    res.status(response.code).json({ status: response.status, data: response.data });
  }

  public async verifyUser(req: Request, res: Response): Promise<void> {
    const request = verifyUserSchema.safeParse(req.body);
    if (!request.success) {
      this.handleError(res, request.error);
      return;
    }
    const response = await authService.verifyUser(request.data);
    res.status(response.code).json({ status: response.status, data: response.data });
  }

  public async resetPassword(req: Request, res: Response): Promise<void> {
    const request = resetPasswordSchema.safeParse(req.body);
    if (!request.success) {
      this.handleError(res, request.error);
      return;
    }
    const response = await authService.resetPassword(request.data);
    res.status(response.code).json({ status: response.status, data: response.data });
  }
}

export const authController = new AuthController();
