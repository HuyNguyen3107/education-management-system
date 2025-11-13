import { http } from "@/libs/http.libs";
import { API_PATHS } from "@/constants/api-path.constants";
import type {
  LoginRequest,
  LoginResponse,
  PasswordResetRequest,
  PasswordResetResponse,
  ValidateTokenResponse,
  ResetPasswordRequest,
  ResetPasswordResponse,
} from "../types/auth.types";

// Interface for Authentication Service (Single Responsibility Principle)
interface IAuthService {
  login(data: LoginRequest): Promise<LoginResponse>;
  logout(token: string): Promise<void>;
}

// Interface for Password Reset Service (Single Responsibility Principle)
interface IPasswordResetService {
  requestPasswordReset(
    data: PasswordResetRequest
  ): Promise<PasswordResetResponse>;
  validateToken(token: string): Promise<ValidateTokenResponse>;
  submitNewPassword(data: ResetPasswordRequest): Promise<ResetPasswordResponse>;
}

// Auth Service Implementation
class AuthService implements IAuthService {
  async login(data: LoginRequest): Promise<LoginResponse> {
    const response = await http.post<LoginResponse>(API_PATHS.AUTH.LOGIN, data);
    return response.data;
  }

  async logout(token: string): Promise<void> {
    await http.post(API_PATHS.AUTH.LOGOUT, null, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
  }
}

// Password Reset Service Implementation (Separated for SRP)
class PasswordResetService implements IPasswordResetService {
  async requestPasswordReset(
    data: PasswordResetRequest
  ): Promise<PasswordResetResponse> {
    const response = await http.post<string>(
      API_PATHS.PASSWORD_RESET.REQUEST,
      data
    );
    return {
      message: response.data,
    };
  }

  async validateToken(token: string): Promise<ValidateTokenResponse> {
    try {
      const response = await http.get<string>(
        API_PATHS.PASSWORD_RESET.VALIDATE,
        {
          params: { token },
        }
      );
      return {
        message: response.data,
        isValid: true,
      };
    } catch (error) {
      return {
        message: "Token không hợp lệ hoặc đã hết hạn",
        isValid: false,
      };
    }
  }

  async submitNewPassword(
    data: ResetPasswordRequest
  ): Promise<ResetPasswordResponse> {
    try {
      const response = await http.post<string>(
        API_PATHS.PASSWORD_RESET.SUBMIT,
        data
      );
      return {
        message: response.data,
        success: true,
      };
    } catch (error) {
      return {
        message: "Đặt lại mật khẩu thất bại",
        success: false,
      };
    }
  }
}

// Service instances (Dependency Inversion Principle)
export const authService: IAuthService = new AuthService();
export const passwordResetService: IPasswordResetService =
  new PasswordResetService();

// Export individual methods for easier use
export const login = (data: LoginRequest) => authService.login(data);
export const logout = (token: string) => authService.logout(token);
export const requestPasswordReset = (data: PasswordResetRequest) =>
  passwordResetService.requestPasswordReset(data);
export const validateToken = (token: string) =>
  passwordResetService.validateToken(token);
export const submitNewPassword = (data: ResetPasswordRequest) =>
  passwordResetService.submitNewPassword(data);
