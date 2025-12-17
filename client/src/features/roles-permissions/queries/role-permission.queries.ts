import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  roleManagementService,
  permissionService,
  rolePermissionService,
} from "../services/role-permission.services";
import type { Permission, RolePermission } from "../types/role-permission.types";
import type { Role } from "@/features/users/types/user.types";

export const roleMgmtQueryKeys = {
  roles: ["roles-management", "roles"] as const,
};

export const permissionQueryKeys = {
  all: ["permissions"] as const,
  lists: () => [...permissionQueryKeys.all, "list"] as const,
};

export const rolePermissionQueryKeys = {
  all: ["role-permissions"] as const,
  byRole: (roleId: string) => [...rolePermissionQueryKeys.all, roleId] as const,
};

export const useMgmtRoles = (enabled: boolean = true) => {
  return useQuery<Role[]>({
    queryKey: roleMgmtQueryKeys.roles,
    queryFn: () => roleManagementService.getAllRoles(),
    // Chỉ gọi API khi được phép xem danh sách vai trò
    enabled,
  });
};

export const useCreateMgmtRole = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (name: string) => roleManagementService.createRole(name),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: roleMgmtQueryKeys.roles });
    },
  });
};

export const useUpdateMgmtRole = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (params: { id: string; name: string }) =>
      roleManagementService.updateRole(params.id, params.name),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: roleMgmtQueryKeys.roles });
    },
  });
};

export const useDeleteMgmtRole = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => roleManagementService.deleteRole(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: roleMgmtQueryKeys.roles });
      queryClient.invalidateQueries({ queryKey: rolePermissionQueryKeys.all });
    },
  });
};

export const usePermissions = () => {
  return useQuery<Permission[]>({
    queryKey: permissionQueryKeys.lists(),
    queryFn: () => permissionService.getAllPermissions(),
  });
};

export const useCreatePermission = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (name: string) => permissionService.createPermission(name),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: permissionQueryKeys.all });
    },
  });
};

export const useDeletePermission = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => permissionService.deletePermission(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: permissionQueryKeys.all });
      queryClient.invalidateQueries({ queryKey: rolePermissionQueryKeys.all });
    },
  });
};

export const useRolePermissionsByRole = (roleId: string | null) => {
  return useQuery<RolePermission[]>({
    queryKey: rolePermissionQueryKeys.byRole(roleId || "none"),
    queryFn: () => rolePermissionService.getRolePermissionsByRoleId(roleId!),
    enabled: !!roleId,
  });
};

export const useCreateRolePermission = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (params: { roleId: string; permissionId: string }) =>
      rolePermissionService.createRolePermission(
        params.roleId,
        params.permissionId
      ),
    onSuccess: (_data, variables) => {
      queryClient.invalidateQueries({
        queryKey: rolePermissionQueryKeys.byRole(variables.roleId),
      });
    },
  });
};

export const useDeleteRolePermission = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (params: { id: string; roleId: string }) =>
      rolePermissionService.deleteRolePermission(params.id),
    onSuccess: (_data, variables) => {
      queryClient.invalidateQueries({
        queryKey: rolePermissionQueryKeys.byRole(variables.roleId),
      });
    },
  });
};


