import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { studentMajorService } from "../services/student-major.services";
import type {
  CreateStudentMajorRequest,
  UpdateStudentMajorRequest,
} from "../types/student-major.types";

export const studentMajorQueryKeys = {
  all: ["student-majors"] as const,
  lists: () => [...studentMajorQueryKeys.all, "list"] as const,
  detail: (id: string) => [...studentMajorQueryKeys.all, "detail", id] as const,
  byStudent: (studentId: string) =>
    [...studentMajorQueryKeys.all, "student", studentId] as const,
};

export const useStudentMajors = () => {
  return useQuery({
    queryKey: studentMajorQueryKeys.lists(),
    queryFn: () => studentMajorService.getAll(),
  });
};

export const useStudentMajorByStudentId = (studentId: string) => {
  return useQuery({
    queryKey: studentMajorQueryKeys.byStudent(studentId),
    queryFn: () => studentMajorService.getByStudentId(studentId),
    enabled: !!studentId,
  });
};

export const useStudentMajorById = (id: string) => {
  return useQuery({
    queryKey: studentMajorQueryKeys.detail(id),
    queryFn: () => studentMajorService.getById(id),
    enabled: !!id,
  });
};

export const useCreateStudentMajor = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: CreateStudentMajorRequest) =>
      studentMajorService.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: studentMajorQueryKeys.all,
      });
    },
  });
};

export const useUpdateStudentMajor = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({
      id,
      data,
    }: {
      id: string;
      data: UpdateStudentMajorRequest;
    }) => studentMajorService.update(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: studentMajorQueryKeys.all,
      });
    },
  });
};

export const useDeleteStudentMajor = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => studentMajorService.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: studentMajorQueryKeys.all,
      });
    },
  });
};
