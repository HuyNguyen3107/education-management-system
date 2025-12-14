import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { tuitionService } from "../services/tuition.services";
import type {
  CreateTuitionRequest,
  UpdateTuitionRequest,
} from "../types/tuition.types";

export const tuitionQueryKeys = {
  all: ["tuitions"] as const,
  lists: () => [...tuitionQueryKeys.all, "list"] as const,
  detail: (id: string) => [...tuitionQueryKeys.all, "detail", id] as const,
};

export const useTuitions = () => {
  return useQuery({
    queryKey: tuitionQueryKeys.lists(),
    queryFn: () => tuitionService.getAllTuitions(),
  });
};

export const useTuitionById = (id: string) => {
  return useQuery({
    queryKey: tuitionQueryKeys.detail(id),
    queryFn: () => tuitionService.getTuitionById(id),
    enabled: !!id,
  });
};

export const useCreateTuition = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: CreateTuitionRequest) => tuitionService.createTuition(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: tuitionQueryKeys.all });
    },
  });
};

export const useUpdateTuition = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: UpdateTuitionRequest }) =>
      tuitionService.updateTuition(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: tuitionQueryKeys.all });
    },
  });
};

export const useDeleteTuition = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => tuitionService.deleteTuition(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: tuitionQueryKeys.all });
    },
  });
};

