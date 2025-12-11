import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { prerequisiteSubjectService } from "../services/prerequisite-subject.services";
import type {
  CreatePrerequisiteSubjectRequest,
  UpdatePrerequisiteSubjectRequest,
} from "../types/prerequisite-subject.types";

export const prerequisiteSubjectQueryKeys = {
  all: ["prerequisiteSubjects"] as const,
  lists: () => [...prerequisiteSubjectQueryKeys.all, "list"] as const,
  detail: (id: string) => [
    ...prerequisiteSubjectQueryKeys.all,
    "detail",
    id,
  ] as const,
  byRegisterCode: (registerCode: string) => [
    ...prerequisiteSubjectQueryKeys.all,
    "registerCode",
    registerCode,
  ] as const,
  byPrerequisiteCode: (prerequisiteCode: string) => [
    ...prerequisiteSubjectQueryKeys.all,
    "prerequisiteCode",
    prerequisiteCode,
  ] as const,
};

export const usePrerequisiteSubjects = () => {
  return useQuery({
    queryKey: prerequisiteSubjectQueryKeys.lists(),
    queryFn: () => prerequisiteSubjectService.getAllPrerequisiteSubjects(),
  });
};

export const usePrerequisiteSubjectById = (id: string) => {
  return useQuery({
    queryKey: prerequisiteSubjectQueryKeys.detail(id),
    queryFn: () => prerequisiteSubjectService.getPrerequisiteSubjectById(id),
    enabled: !!id,
  });
};

export const usePrerequisiteSubjectsByRegisterCode = (registerCode: string) => {
  return useQuery({
    queryKey: prerequisiteSubjectQueryKeys.byRegisterCode(registerCode),
    queryFn: () => prerequisiteSubjectService.getByRegisterCode(registerCode),
    enabled: !!registerCode,
  });
};

export const usePrerequisiteSubjectsByPrerequisiteCode = (
  prerequisiteCode: string
) => {
  return useQuery({
    queryKey: prerequisiteSubjectQueryKeys.byPrerequisiteCode(prerequisiteCode),
    queryFn: () =>
      prerequisiteSubjectService.getByPrerequisiteCode(prerequisiteCode),
    enabled: !!prerequisiteCode,
  });
};

export const useCreatePrerequisiteSubject = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: CreatePrerequisiteSubjectRequest) =>
      prerequisiteSubjectService.createPrerequisiteSubject(data),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: prerequisiteSubjectQueryKeys.all,
      });
    },
  });
};

export const useUpdatePrerequisiteSubject = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({
      id,
      data,
    }: {
      id: string;
      data: UpdatePrerequisiteSubjectRequest;
    }) => prerequisiteSubjectService.updatePrerequisiteSubject(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: prerequisiteSubjectQueryKeys.all,
      });
    },
  });
};

export const useDeletePrerequisiteSubject = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) =>
      prerequisiteSubjectService.deletePrerequisiteSubject(id),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: prerequisiteSubjectQueryKeys.all,
      });
    },
  });
};

