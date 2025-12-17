import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  userService,
  userRoleService,
  roleService,
} from "../services/user.services";
import type {
  User,
  UserRole,
  Role,
  UserWithRoles,
  UserSearchParams,
  CreateUserRequest,
  UpdateUserRequest,
} from "../types/user.types";

// Query Keys
export const userQueryKeys = {
  all: ["users"] as const,
  lists: () => [...userQueryKeys.all, "list"] as const,
  list: (filters: Record<string, unknown>) =>
    [...userQueryKeys.lists(), filters] as const,
  details: () => [...userQueryKeys.all, "detail"] as const,
  detail: (id: string) => [...userQueryKeys.details(), id] as const,
};

export const roleQueryKeys = {
  all: ["roles"] as const,
  lists: () => [...roleQueryKeys.all, "list"] as const,
};

export const userRoleQueryKeys = {
  all: ["userRoles"] as const,
  lists: () => [...userRoleQueryKeys.all, "list"] as const,
  byUser: (userId: string) =>
    [...userRoleQueryKeys.all, "user", userId] as const,
};

// Hook to get all users
export const useGetAllUsers = () => {
  return useQuery({
    queryKey: userQueryKeys.lists(),
    queryFn: () => userService.getAllUsers(),
  });
};

// Hook to get user by ID
export const useGetUserById = (id: string) => {
  return useQuery({
    queryKey: userQueryKeys.detail(id),
    queryFn: () => userService.getUserById(id),
    enabled: !!id,
  });
};

// Hook to get all roles
export const useGetAllRoles = () => {
  return useQuery({
    queryKey: roleQueryKeys.lists(),
    queryFn: () => roleService.getAllRoles(),
  });
};

// Hook to get all user roles
export const useGetAllUserRoles = () => {
  return useQuery({
    queryKey: userRoleQueryKeys.lists(),
    queryFn: () => userRoleService.getAllUserRoles(),
  });
};

// Hook to get user roles by user ID
export const useGetUserRolesByUserId = (userId: string) => {
  return useQuery({
    queryKey: userRoleQueryKeys.byUser(userId),
    queryFn: () => userRoleService.getUserRolesByUserId(userId),
    enabled: !!userId,
  });
};

export const useAddRoleToUser = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (params: { userId: string; roleId: string }) =>
      userRoleService.addRoleToUser(params.userId, params.roleId),
    onSuccess: (_data, variables) => {
      queryClient.invalidateQueries({
        queryKey: userRoleQueryKeys.byUser(variables.userId),
      });
      queryClient.invalidateQueries({ queryKey: userRoleQueryKeys.all });
    },
  });
};

export const useRemoveUserRole = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (params: { userRoleId: string; userId: string }) =>
      userRoleService.removeUserRole(params.userRoleId),
    onSuccess: (_data, variables) => {
      queryClient.invalidateQueries({
        queryKey: userRoleQueryKeys.byUser(variables.userId),
      });
      queryClient.invalidateQueries({ queryKey: userRoleQueryKeys.all });
    },
  });
};

// Combined hook to get users with their roles
export const useGetUsersWithRoles = () => {
  const usersQuery = useGetAllUsers();
  const userRolesQuery = useGetAllUserRoles();
  const rolesQuery = useGetAllRoles();

  const isLoading =
    usersQuery.isLoading || userRolesQuery.isLoading || rolesQuery.isLoading;
  const isError =
    usersQuery.isError || userRolesQuery.isError || rolesQuery.isError;
  const error = usersQuery.error || userRolesQuery.error || rolesQuery.error;

  // Combine users with their roles
  const usersWithRoles: UserWithRoles[] | undefined = usersQuery.data?.map(
    (user: User) => {
      const userRoleEntries = userRolesQuery.data?.filter(
        (ur: UserRole) => ur.userId === user.id
      );
      const roleNames =
        userRoleEntries?.map((ur: UserRole) => {
          const role = rolesQuery.data?.find((r: Role) => r.id === ur.roleId);
          return role?.name || ur.roleName || "Unknown";
        }) || [];

      return {
        ...user,
        roles: roleNames,
      };
    }
  );

  return {
    data: usersWithRoles,
    isLoading,
    isError,
    error,
    refetch: () => {
      usersQuery.refetch();
      userRolesQuery.refetch();
      rolesQuery.refetch();
    },
  };
};

// Hook to get users with pagination and filters
export const useUsers = (params?: UserSearchParams) => {
  return useQuery({
    queryKey: [...userQueryKeys.lists(), params],
    queryFn: () => userService.getUsers(params),
  });
};

// Hook to create user
export const useCreateUser = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: CreateUserRequest) => userService.createUser(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: userQueryKeys.all });
    },
  });
};

// Hook to update user
export const useUpdateUser = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: UpdateUserRequest }) =>
      userService.updateUser(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: userQueryKeys.all });
    },
  });
};

// Hook to delete user
export const useDeleteUser = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => userService.deleteUser(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: userQueryKeys.all });
    },
  });
};
