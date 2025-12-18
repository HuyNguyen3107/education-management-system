import { http } from "@/libs/http.libs";
import type {
  Permission,
  RolePermission,
} from "../types/role-permission.types";

const API_BASE = "/roles-management";

export const roleManagementService = {
  getAllRoles: async (): Promise<any[]> => {
    const response = await http.get<any[]>(`${API_BASE}/roles`);
    return response.data || [];
  },
  createRole: async (name: string) => {
    const response = await http.post(`${API_BASE}/roles`, { name });
    return response.data;
  },
  updateRole: async (id: string, name: string) => {
    const response = await http.put(`${API_BASE}/roles/${id}`, { name });
    return response.data;
  },
  deleteRole: async (id: string) => {
    await http.delete(`${API_BASE}/roles/${id}`);
  },
};

export const permissionService = {
  getAllPermissions: async (): Promise<Permission[]> => {
    const response = await http.get<Permission[]>(`${API_BASE}/permissions`);
    return response.data || [];
  },
  createPermission: async (name: string) => {
    const response = await http.post(`${API_BASE}/permissions`, { name });
    return response.data;
  },
  deletePermission: async (id: string) => {
    await http.delete(`${API_BASE}/permissions/${id}`);
  },
};

export const rolePermissionService = {
  getRolePermissionsByRoleId: async (
    roleId: string
  ): Promise<RolePermission[]> => {
    const response = await http.get<RolePermission[]>(
      `${API_BASE}/roles/${roleId}/permissions`
    );
    return response.data || [];
  },
  createRolePermission: async (roleId: string, permissionId: string) => {
    const response = await http.post(
      `${API_BASE}/roles/${roleId}/permissions`,
      { permissionId }
    );
    return response.data;
  },
  deleteRolePermission: async (id: string) => {
    await http.delete(`${API_BASE}/role-permissions/${id}`);
  },
};
