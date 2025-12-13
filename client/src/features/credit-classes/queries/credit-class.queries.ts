import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { creditClassService } from "../services/credit-class.services";
import type {
  CreateCreditClassRequest,
  UpdateCreditClassRequest,
} from "../types/credit-class.types";

export const creditClassQueryKeys = {
  all: ["credit-classes"] as const,
  lists: () => [...creditClassQueryKeys.all, "list"] as const,
  detail: (id: string) => [...creditClassQueryKeys.all, "detail", id] as const,
};

export const useCreditClasses = () => {
  return useQuery({
    queryKey: creditClassQueryKeys.lists(),
    queryFn: () => creditClassService.getAllCreditClasses(),
  });
};

export const useCreditClassById = (id: string) => {
  return useQuery({
    queryKey: creditClassQueryKeys.detail(id),
    queryFn: () => creditClassService.getCreditClassById(id),
    enabled: !!id,
  });
};

export const useCreateCreditClass = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: CreateCreditClassRequest) =>
      creditClassService.createCreditClass(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: creditClassQueryKeys.all });
    },
  });
};

export const useUpdateCreditClass = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: UpdateCreditClassRequest }) =>
      creditClassService.updateCreditClass(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: creditClassQueryKeys.all });
    },
  });
};

export const useDeleteCreditClass = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => creditClassService.deleteCreditClass(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: creditClassQueryKeys.all });
    },
  });
};

