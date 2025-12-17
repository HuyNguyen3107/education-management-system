import { http } from "@/libs/http.libs";
import { API_PATHS } from "@/constants/api-path.constants";
import type {
  Role,
  CreateRoleRequest,
  UpdateRoleRequest,
} from "../types/role.types";

export const roleService = {
  getRoles: async (): Promise<Role[]> => {
    const response = await http.get<Role[]>(API_PATHS.ROLES.GET_ALL);
    return response.data;
  },

  getRole: async (id: string): Promise<Role> => {
    const response = await http.get<Role>(API_PATHS.ROLES.GET_BY_ID(id));
    return response.data;
  },

  createRole: async (data: CreateRoleRequest): Promise<Role> => {
    const response = await http.post<Role>(API_PATHS.ROLES.CREATE, data);
    return response.data;
  },

  updateRole: async (id: string, data: UpdateRoleRequest): Promise<Role> => {
    const response = await http.put<Role>(API_PATHS.ROLES.UPDATE(id), data);
    return response.data;
  },

  deleteRole: async (id: string): Promise<void> => {
    await http.delete(API_PATHS.ROLES.DELETE(id));
  },
};


