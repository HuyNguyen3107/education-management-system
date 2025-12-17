import { http } from "@/libs/http.libs";
import { API_PATHS } from "@/constants/api-path.constants";
import type {
  User,
  Role,
  UserRole,
  PageResponse,
  UserSearchParams,
  CreateUserRequest,
  UpdateUserRequest,
} from "../types/user.types";

// Interface for User Service
interface IUserService {
  getAllUsers(): Promise<User[]>;
  getUserById(id: string): Promise<User>;
  getUsers(params?: UserSearchParams): Promise<PageResponse<User>>;
  createUser(data: CreateUserRequest): Promise<User>;
  updateUser(id: string, data: UpdateUserRequest): Promise<User>;
  deleteUser(id: string): Promise<void>;
}

// Interface for Role Service
interface IRoleService {
  getAllRoles(): Promise<Role[]>;
}

// Interface for UserRole Service
interface IUserRoleService {
  getAllUserRoles(): Promise<UserRole[]>;
  getUserRolesByUserId(userId: string): Promise<UserRole[]>;
  addRoleToUser(userId: string, roleId: string): Promise<UserRole>;
  removeUserRole(userRoleId: string): Promise<void>;
}

// User Service Implementation
class UserService implements IUserService {
  async getAllUsers(): Promise<User[]> {
    const response = await http.get<PageResponse<User>>(API_PATHS.USERS.GET_ALL, {
      params: { size: 10000 }, // Get all users
    });
    // Handle both PageResponse and array response
    if (Array.isArray(response.data)) {
      return response.data;
    }
    return response.data.content || [];
  }

  async getUserById(id: string): Promise<User> {
    const response = await http.get<User>(API_PATHS.USERS.GET_BY_ID(id));
    return response.data;
  }

  async getUsers(params?: UserSearchParams): Promise<PageResponse<User>> {
    const response = await http.get<PageResponse<User>>(API_PATHS.USERS.GET_ALL, {
      params,
    });
    // Handle legacy list response just in case
    if (Array.isArray(response.data)) {
      return {
        content: response.data,
        totalPages: 1,
        totalElements: response.data.length,
        size: response.data.length,
        number: 0,
        numberOfElements: response.data.length,
        first: true,
        last: true,
        empty: response.data.length === 0,
      };
    }
    return response.data;
  }

  async createUser(data: CreateUserRequest): Promise<User> {
    const response = await http.post<User>(API_PATHS.USERS.CREATE, data);
    return response.data;
  }

  async updateUser(id: string, data: UpdateUserRequest): Promise<User> {
    const response = await http.put<User>(API_PATHS.USERS.UPDATE(id), data);
    return response.data;
  }

  async deleteUser(id: string): Promise<void> {
    await http.delete(API_PATHS.USERS.DELETE(id));
  }
}

// Role Service Implementation
class RoleService implements IRoleService {
  async getAllRoles(): Promise<Role[]> {
    const response = await http.get<Role[]>(API_PATHS.ROLES.GET_ALL);
    return response.data;
  }
}

// UserRole Service Implementation
class UserRoleService implements IUserRoleService {
  async getAllUserRoles(): Promise<UserRole[]> {
    const response = await http.get<UserRole[]>(API_PATHS.USER_ROLES.GET_ALL);
    return response.data;
  }

  async getUserRolesByUserId(userId: string): Promise<UserRole[]> {
    const response = await http.get<UserRole[]>(
      API_PATHS.USER_ROLES.GET_BY_USER_ID(userId)
    );
    return response.data;
  }

  async addRoleToUser(userId: string, roleId: string): Promise<UserRole> {
    const response = await http.post<UserRole>(API_PATHS.USER_ROLES.GET_ALL, {
      userId,
      roleId,
    });
    return response.data;
  }

  async removeUserRole(userRoleId: string): Promise<void> {
    await http.delete(`${API_PATHS.USER_ROLES.GET_ALL}/${userRoleId}`);
  }
}

// Export service instances
export const userService = new UserService();
export const roleService = new RoleService();
export const userRoleService = new UserRoleService();
