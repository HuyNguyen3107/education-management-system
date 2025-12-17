import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { studentService } from "../services/student.services";
import type {
  CreateStudentRequest,
  UpdateStudentRequest,
} from "../types/student.types";

export const studentQueryKeys = {
  all: ["students"] as const,
  lists: () => [...studentQueryKeys.all, "list"] as const,
  detail: (id: string) => [...studentQueryKeys.all, "detail", id] as const,
};

export const useStudents = () => {
  return useQuery({
    queryKey: studentQueryKeys.lists(),
    queryFn: () => studentService.getAllStudents(),
  });
};

export const useStudentById = (id: string) => {
  return useQuery({
    queryKey: studentQueryKeys.detail(id),
    queryFn: () => studentService.getStudentById(id),
    enabled: !!id,
  });
};

export const useStudentByCode = (code: string) => {
  return useQuery({
    queryKey: [...studentQueryKeys.all, "code", code],
    queryFn: () => studentService.getStudentByCode(code),
    enabled: !!code,
  });
};

export const useStudentByUserId = (userId: string) => {
  return useQuery({
    queryKey: [...studentQueryKeys.all, "user", userId],
    queryFn: () => studentService.getStudentByUserId(userId),
    enabled: !!userId,
  });
};

export const useTrainingProgram = (userId: string) => {
  return useQuery({
    queryKey: [...studentQueryKeys.all, "training-program", userId],
    queryFn: () => studentService.getTrainingProgram(userId),
    enabled: !!userId,
  });
};

export const useCreateStudent = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: CreateStudentRequest) =>
      studentService.createStudent(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: studentQueryKeys.all });
    },
  });
};

export const useUpdateStudent = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: UpdateStudentRequest }) =>
      studentService.updateStudent(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: studentQueryKeys.all });
    },
  });
};

export const useDeleteStudent = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => studentService.deleteStudent(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: studentQueryKeys.all });
    },
  });
};
