import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { subjectService } from "../services/subject.services";
import type {
  CreateSubjectRequest,
  UpdateSubjectRequest,
} from "../types/subject.types";

export const subjectQueryKeys = {
  all: ["subjects"] as const,
  lists: () => [...subjectQueryKeys.all, "list"] as const,
  detail: (id: string) => [...subjectQueryKeys.all, "detail", id] as const,
  byMajor: (majorId: string) => [...subjectQueryKeys.all, "major", majorId] as const,
  bySpecialization: (specializationId: string) => [...subjectQueryKeys.all, "specialization", specializationId] as const,
  bySemester: (semester: string) => [...subjectQueryKeys.all, "semester", semester] as const,
};

export const useSubjects = () => {
  return useQuery({
    queryKey: subjectQueryKeys.lists(),
    queryFn: () => subjectService.getAllSubjects(),
  });
};

export const useSubjectById = (id: string) => {
  return useQuery({
    queryKey: subjectQueryKeys.detail(id),
    queryFn: () => subjectService.getSubjectById(id),
    enabled: !!id,
  });
};

export const useSubjectsByMajor = (majorId: string) => {
  return useQuery({
    queryKey: subjectQueryKeys.byMajor(majorId),
    queryFn: () => subjectService.getSubjectsByMajorId(majorId),
    enabled: !!majorId,
  });
};

export const useSubjectsBySpecialization = (specializationId: string) => {
  return useQuery({
    queryKey: subjectQueryKeys.bySpecialization(specializationId),
    queryFn: () => subjectService.getSubjectsBySpecializationId(specializationId),
    enabled: !!specializationId,
  });
};

export const useSubjectsBySemester = (semester: string) => {
  return useQuery({
    queryKey: subjectQueryKeys.bySemester(semester),
    queryFn: () => subjectService.getSubjectsBySemester(semester),
    enabled: !!semester,
  });
};

export const useCreateSubject = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: CreateSubjectRequest) =>
      subjectService.createSubject(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: subjectQueryKeys.all });
    },
  });
};

export const useUpdateSubject = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: UpdateSubjectRequest }) =>
      subjectService.updateSubject(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: subjectQueryKeys.all });
    },
  });
};

export const useDeleteSubject = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => subjectService.deleteSubject(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: subjectQueryKeys.all });
    },
  });
};

