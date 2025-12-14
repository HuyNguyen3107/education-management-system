import { http } from "@/libs/http.libs";
import { API_PATHS } from "@/constants/api-path.constants";
import type {
  PrerequisiteSubject,
  CreatePrerequisiteSubjectRequest,
  UpdatePrerequisiteSubjectRequest,
} from "../types/prerequisite-subject.types";

export const prerequisiteSubjectService = {
  getAllPrerequisiteSubjects: async (): Promise<PrerequisiteSubject[]> => {
    const response = await http.get<PrerequisiteSubject[]>(
      API_PATHS.PREREQUISITE_SUBJECTS.GET_ALL
    );
    return response.data;
  },

  getPrerequisiteSubjectById: async (
    id: string
  ): Promise<PrerequisiteSubject> => {
    const response = await http.get<PrerequisiteSubject>(
      API_PATHS.PREREQUISITE_SUBJECTS.GET_BY_ID(id)
    );
    return response.data;
  },

  getByRegisterCode: async (
    registerCode: string
  ): Promise<PrerequisiteSubject[]> => {
    const response = await http.get<PrerequisiteSubject[]>(
      API_PATHS.PREREQUISITE_SUBJECTS.GET_BY_REGISTER_CODE(registerCode)
    );
    return response.data;
  },

  getByPrerequisiteCode: async (
    prerequisiteCode: string
  ): Promise<PrerequisiteSubject[]> => {
    const response = await http.get<PrerequisiteSubject[]>(
      API_PATHS.PREREQUISITE_SUBJECTS.GET_BY_PREREQUISITE_CODE(prerequisiteCode)
    );
    return response.data;
  },

  searchByBothCodes: async (
    registerCode: string,
    prerequisiteCode: string
  ): Promise<PrerequisiteSubject[]> => {
    const response = await http.get<PrerequisiteSubject[]>(
      API_PATHS.PREREQUISITE_SUBJECTS.SEARCH,
      {
        params: { registerCode, prerequisiteCode },
      }
    );
    return response.data;
  },

  createPrerequisiteSubject: async (
    data: CreatePrerequisiteSubjectRequest
  ): Promise<PrerequisiteSubject> => {
    const response = await http.post<PrerequisiteSubject>(
      API_PATHS.PREREQUISITE_SUBJECTS.CREATE,
      data
    );
    return response.data;
  },

  updatePrerequisiteSubject: async (
    id: string,
    data: UpdatePrerequisiteSubjectRequest
  ): Promise<PrerequisiteSubject> => {
    const response = await http.put<PrerequisiteSubject>(
      API_PATHS.PREREQUISITE_SUBJECTS.UPDATE(id),
      data
    );
    return response.data;
  },

  deletePrerequisiteSubject: async (id: string): Promise<void> => {
    await http.delete(API_PATHS.PREREQUISITE_SUBJECTS.DELETE(id));
  },
};

