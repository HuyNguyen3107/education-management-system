import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { timeRegisterService } from "../services/time-register.services";
import type {
  CreateTimeRegisterRequest,
  UpdateTimeRegisterRequest,
} from "../types/time-register.types";

export const timeRegisterQueryKeys = {
  all: ["timeRegisters"] as const,
  lists: () => [...timeRegisterQueryKeys.all, "list"] as const,
  detail: (id: string) => [...timeRegisterQueryKeys.all, "detail", id] as const,
  byTypeSemester: (typeSemester: string) => [
    ...timeRegisterQueryKeys.all,
    "typeSemester",
    typeSemester,
  ] as const,
  byTypeRegister: (typeRegister: string) => [
    ...timeRegisterQueryKeys.all,
    "typeRegister",
    typeRegister,
  ] as const,
};

export const useTimeRegisters = () => {
  return useQuery({
    queryKey: timeRegisterQueryKeys.lists(),
    queryFn: () => timeRegisterService.getAllTimeRegisters(),
  });
};

export const useTimeRegisterById = (id: string) => {
  return useQuery({
    queryKey: timeRegisterQueryKeys.detail(id),
    queryFn: () => timeRegisterService.getTimeRegisterById(id),
    enabled: !!id,
  });
};

export const useTimeRegistersByTypeSemester = (typeSemester: string) => {
  return useQuery({
    queryKey: timeRegisterQueryKeys.byTypeSemester(typeSemester),
    queryFn: () => timeRegisterService.getByTypeSemester(typeSemester),
    enabled: !!typeSemester,
  });
};

export const useTimeRegistersByTypeRegister = (typeRegister: string) => {
  return useQuery({
    queryKey: timeRegisterQueryKeys.byTypeRegister(typeRegister),
    queryFn: () => timeRegisterService.getByTypeRegister(typeRegister),
    enabled: !!typeRegister,
  });
};

export const useCreateTimeRegister = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: CreateTimeRegisterRequest) =>
      timeRegisterService.createTimeRegister(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: timeRegisterQueryKeys.all });
    },
  });
};

export const useUpdateTimeRegister = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({
      id,
      data,
    }: {
      id: string;
      data: UpdateTimeRegisterRequest;
    }) => timeRegisterService.updateTimeRegister(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: timeRegisterQueryKeys.all });
    },
  });
};

export const useDeleteTimeRegister = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => timeRegisterService.deleteTimeRegister(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: timeRegisterQueryKeys.all });
    },
  });
};

