import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { studentTuitionService } from "../services/student-tuition.services";
import type {
  CreateStudentTuitionRequest,
  UpdateStudentTuitionRequest,
} from "../types/student-tuition.types";

export const studentTuitionQueryKeys = {
  all: ["student-tuitions"] as const,
  lists: () => [...studentTuitionQueryKeys.all, "list"] as const,
  detail: (id: string) => [...studentTuitionQueryKeys.all, "detail", id] as const,
};

export const useStudentTuitions = () => {
  return useQuery({
    queryKey: studentTuitionQueryKeys.lists(),
    queryFn: () => studentTuitionService.getAllStudentTuitions(),
  });
};

export const useStudentTuitionById = (id: string) => {
  return useQuery({
    queryKey: studentTuitionQueryKeys.detail(id),
    queryFn: () => studentTuitionService.getStudentTuitionById(id),
    enabled: !!id,
  });
};

export const useCreateStudentTuition = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: CreateStudentTuitionRequest) =>
      studentTuitionService.createStudentTuition(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: studentTuitionQueryKeys.all });
    },
  });
};

export const useUpdateStudentTuition = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: UpdateStudentTuitionRequest }) =>
      studentTuitionService.updateStudentTuition(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: studentTuitionQueryKeys.all });
    },
  });
};

export const useDeleteStudentTuition = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => studentTuitionService.deleteStudentTuition(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: studentTuitionQueryKeys.all });
    },
  });
};

