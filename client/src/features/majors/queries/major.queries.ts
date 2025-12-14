import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { majorService } from "../services/major.services";
import type { MajorSearchParams, CreateMajorRequest, UpdateMajorRequest } from "../types/major.types";

export const useMajors = (params?: MajorSearchParams) => {
  return useQuery({
    queryKey: ["majors", params],
    queryFn: () => majorService.getMajors(params),
  });
};

export const useCreateMajor = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: CreateMajorRequest) => majorService.createMajor(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["majors"] });
    },
  });
};

export const useUpdateMajor = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: UpdateMajorRequest }) => majorService.updateMajor(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["majors"] });
    },
  });
};

export const useDeleteMajor = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => majorService.deleteMajor(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["majors"] });
    },
  });
};
