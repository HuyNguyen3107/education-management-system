import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { specializationService } from "../services/specialization.services";
import type {
  CreateSpecializationRequest,
  UpdateSpecializationRequest,
} from "../types/specialization.types";

// Queries
export const useSpecializations = (params?: {
  page?: number;
  size?: number;
  keyword?: string;
}) => {
  return useQuery({
    queryKey: ["specializations", params],
    queryFn: () => specializationService.getSpecializations(params),
  });
};

export const useSpecialization = (id: string) => {
  return useQuery({
    queryKey: ["specializations", id],
    queryFn: () => specializationService.getSpecialization(id),
    enabled: !!id,
  });
};

export const useCreateSpecialization = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: CreateSpecializationRequest) =>
      specializationService.createSpecialization(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["specializations"] });
    },
  });
};

export const useUpdateSpecialization = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({
      id,
      data,
    }: {
      id: string;
      data: UpdateSpecializationRequest;
    }) => specializationService.updateSpecialization(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["specializations"] });
    },
  });
};

export const useDeleteSpecialization = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => specializationService.deleteSpecialization(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["specializations"] });
    },
  });
};
