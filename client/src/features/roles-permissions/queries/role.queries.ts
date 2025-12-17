import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { roleService } from "../services/role.services";
import type {
  Role,
  CreateRoleRequest,
  UpdateRoleRequest,
} from "../types/role.types";

export const roleQueryKeys = {
  all: ["roles"] as const,
  lists: () => [...roleQueryKeys.all, "list"] as const,
};

export const useRoles = () => {
  return useQuery({
    queryKey: roleQueryKeys.lists(),
    queryFn: () => roleService.getRoles(),
  });
};

export const useCreateRole = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: CreateRoleRequest) => roleService.createRole(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: roleQueryKeys.all });
    },
  });
};

export const useUpdateRole = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: UpdateRoleRequest }) =>
      roleService.updateRole(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: roleQueryKeys.all });
    },
  });
};

export const useDeleteRole = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => roleService.deleteRole(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: roleQueryKeys.all });
    },
  });
};


