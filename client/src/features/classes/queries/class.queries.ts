import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { classService } from "../services/class.services";
import type {
  CreateClassRequest,
  UpdateClassRequest,
} from "../types/class.types";

export const classQueryKeys = {
  all: ["classes"] as const,
  lists: () => [...classQueryKeys.all, "list"] as const,
  detail: (id: string) => [...classQueryKeys.all, "detail", id] as const,
  byTeacher: (teacherId: string) => [...classQueryKeys.all, "teacher", teacherId] as const,
  byMajor: (majorId: string) => [...classQueryKeys.all, "major", majorId] as const,
  bySpecialization: (specializationId: string) => [...classQueryKeys.all, "specialization", specializationId] as const,
};

export const useClasses = () => {
  return useQuery({
    queryKey: classQueryKeys.lists(),
    queryFn: () => classService.getAllClasses(),
  });
};

export const useClassById = (id: string) => {
  return useQuery({
    queryKey: classQueryKeys.detail(id),
    queryFn: () => classService.getClassById(id),
    enabled: !!id,
  });
};

export const useClassesByTeacher = (teacherId: string) => {
  return useQuery({
    queryKey: classQueryKeys.byTeacher(teacherId),
    queryFn: () => classService.getClassesByTeacherId(teacherId),
    enabled: !!teacherId,
  });
};

export const useClassesByMajor = (majorId: string) => {
  return useQuery({
    queryKey: classQueryKeys.byMajor(majorId),
    queryFn: () => classService.getClassesByMajorId(majorId),
    enabled: !!majorId,
  });
};

export const useClassesBySpecialization = (specializationId: string) => {
  return useQuery({
    queryKey: classQueryKeys.bySpecialization(specializationId),
    queryFn: () => classService.getClassesBySpecializationId(specializationId),
    enabled: !!specializationId,
  });
};

export const useCreateClass = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: CreateClassRequest) => classService.createClass(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: classQueryKeys.all });
    },
  });
};

export const useUpdateClass = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: UpdateClassRequest }) =>
      classService.updateClass(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: classQueryKeys.all });
    },
  });
};

export const useDeleteClass = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => classService.deleteClass(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: classQueryKeys.all });
    },
  });
};

