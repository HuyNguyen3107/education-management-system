import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { lecturerService } from "../services/lecturer.services";
import type {
  CreateLecturerRequest,
  UpdateLecturerRequest,
} from "../types/lecturer.types";

export const lecturerQueryKeys = {
  all: ["lecturers"] as const,
  lists: () => [...lecturerQueryKeys.all, "list"] as const,
  detail: (id: string) => [...lecturerQueryKeys.all, "detail", id] as const,
};

export const useLecturers = () => {
  return useQuery({
    queryKey: lecturerQueryKeys.lists(),
    queryFn: () => lecturerService.getAllLecturers(),
  });
};

export const useLecturerById = (id: string) => {
  return useQuery({
    queryKey: lecturerQueryKeys.detail(id),
    queryFn: () => lecturerService.getLecturerById(id),
    enabled: !!id,
  });
};

export const useCreateLecturer = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: CreateLecturerRequest) => lecturerService.createLecturer(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: lecturerQueryKeys.all });
    },
  });
};

export const useUpdateLecturer = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: UpdateLecturerRequest }) =>
      lecturerService.updateLecturer(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: lecturerQueryKeys.all });
    },
  });
};

export const useDeleteLecturer = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => lecturerService.deleteLecturer(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: lecturerQueryKeys.all });
    },
  });
};

