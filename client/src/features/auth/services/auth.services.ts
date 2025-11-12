import { http } from "@/libs/http.libs";
import { API_PATHS } from "@/constants/api-path.constants";
import type { LoginRequest, LoginResponse } from "../types/auth.types";

interface IAuthService {
  login(data: LoginRequest): Promise<LoginResponse>;
  logout(token: string): Promise<void>;
}

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

export const authService: IAuthService = new AuthService();

// Export individual methods for easier use
export const login = (data: LoginRequest) => authService.login(data);
export const logout = (token: string) => authService.logout(token);
