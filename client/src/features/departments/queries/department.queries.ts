import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { departmentService } from "../services/department.services";
import type { DepartmentSearchParams, CreateDepartmentRequest, UpdateDepartmentRequest } from "../types/department.types";

export const useDepartments = (params?: DepartmentSearchParams) => {
  return useQuery({
    queryKey: ["departments", params],
    queryFn: () => departmentService.getDepartments(params),
  });
};

export const useCreateDepartment = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: CreateDepartmentRequest) => departmentService.createDepartment(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["departments"] });
    },
  });
};

export const useUpdateDepartment = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: UpdateDepartmentRequest }) => departmentService.updateDepartment(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["departments"] });
    },
  });
};

export const useDeleteDepartment = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => departmentService.deleteDepartment(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["departments"] });
    },
  });
};
