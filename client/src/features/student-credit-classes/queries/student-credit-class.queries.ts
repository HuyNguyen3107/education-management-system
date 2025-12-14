import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { studentCreditClassService } from "../services/student-credit-class.services";
import type {
  CreateStudentCreditClassRequest,
  UpdateStudentCreditClassRequest,
} from "../types/student-credit-class.types";

export const studentCreditClassQueryKeys = {
  all: ["student-credit-classes"] as const,
  lists: () => [...studentCreditClassQueryKeys.all, "list"] as const,
  detail: (id: string) => [...studentCreditClassQueryKeys.all, "detail", id] as const,
  byStudent: (studentId: string) => [...studentCreditClassQueryKeys.all, "student", studentId] as const,
  byCreditClass: (creditClassId: string) => [...studentCreditClassQueryKeys.all, "credit-class", creditClassId] as const,
};

export const useStudentCreditClasses = () => {
  return useQuery({
    queryKey: studentCreditClassQueryKeys.lists(),
    queryFn: () => studentCreditClassService.getAllStudentCreditClasses(),
  });
};

export const useStudentCreditClassById = (id: string) => {
  return useQuery({
    queryKey: studentCreditClassQueryKeys.detail(id),
    queryFn: () => studentCreditClassService.getStudentCreditClassById(id),
    enabled: !!id,
  });
};

export const useStudentCreditClassesByStudent = (studentId: string) => {
  return useQuery({
    queryKey: studentCreditClassQueryKeys.byStudent(studentId),
    queryFn: () => studentCreditClassService.getStudentCreditClassesByStudentId(studentId),
    enabled: !!studentId,
  });
};

export const useStudentCreditClassesByCreditClass = (creditClassId: string) => {
  return useQuery({
    queryKey: studentCreditClassQueryKeys.byCreditClass(creditClassId),
    queryFn: () => studentCreditClassService.getStudentCreditClassesByCreditClassId(creditClassId),
    enabled: !!creditClassId,
  });
};

export const useCreateStudentCreditClass = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: CreateStudentCreditClassRequest) =>
      studentCreditClassService.createStudentCreditClass(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: studentCreditClassQueryKeys.all });
    },
  });
};

export const useUpdateStudentCreditClass = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: UpdateStudentCreditClassRequest }) =>
      studentCreditClassService.updateStudentCreditClass(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: studentCreditClassQueryKeys.all });
    },
  });
};

export const useDeleteStudentCreditClass = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => studentCreditClassService.deleteStudentCreditClass(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: studentCreditClassQueryKeys.all });
    },
  });
};

