import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { aspirationRegisterService } from "../services/aspiration-register.services";
import type {
  CreateAspirationRegisterRequest,
  UpdateAspirationRegisterRequest,
} from "../types/aspiration-register.types";

export const aspirationRegisterQueryKeys = {
  all: ["aspiration-registers"] as const,
  lists: () => [...aspirationRegisterQueryKeys.all, "list"] as const,
  detail: (id: string) => [...aspirationRegisterQueryKeys.all, "detail", id] as const,
};

export const useAspirationRegisters = () => {
  return useQuery({
    queryKey: aspirationRegisterQueryKeys.lists(),
    queryFn: () => aspirationRegisterService.getAllAspirationRegisters(),
  });
};

export const useAspirationRegisterById = (id: string) => {
  return useQuery({
    queryKey: aspirationRegisterQueryKeys.detail(id),
    queryFn: () => aspirationRegisterService.getAspirationRegisterById(id),
    enabled: !!id,
  });
};

export const useCreateAspirationRegister = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: CreateAspirationRegisterRequest) =>
      aspirationRegisterService.createAspirationRegister(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: aspirationRegisterQueryKeys.all });
    },
  });
};

export const useUpdateAspirationRegister = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: UpdateAspirationRegisterRequest }) =>
      aspirationRegisterService.updateAspirationRegister(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: aspirationRegisterQueryKeys.all });
    },
  });
};

export const useDeleteAspirationRegister = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => aspirationRegisterService.deleteAspirationRegister(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: aspirationRegisterQueryKeys.all });
    },
  });
};

