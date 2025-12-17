import { http } from "@/libs/http.libs";
import type {
  Major,
  PageResponse,
  MajorSearchParams,
  CreateMajorRequest,
  UpdateMajorRequest,
} from "../types/major.types";

export const majorService = {
  getMajors: async (
    params?: MajorSearchParams
  ): Promise<PageResponse<Major>> => {
    const response = await http.get<any>("/majors", { params });
    if (Array.isArray(response.data)) {
      return {
        content: response.data,
        totalPages: 1,
        totalElements: response.data.length,
        size: response.data.length,
        number: 0,
        numberOfElements: response.data.length,
        first: true,
        last: true,
        empty: response.data.length === 0,
      };
    }
    return response.data;
  },

  getAllMajors: async (): Promise<Major[]> => {
    const response = await http.get<Major[]>("/majors", {
      params: { page: 0, size: 10000 },
    });
    if (Array.isArray(response.data)) {
      return response.data;
    }
    return response.data.content || [];
  },

  getMajor: async (id: string): Promise<Major> => {
    const response = await http.get<Major>(`/majors/${id}`);
    return response.data;
  },

  createMajor: async (data: CreateMajorRequest): Promise<Major> => {
    const response = await http.post<Major>("/majors", data);
    return response.data;
  },

  updateMajor: async (id: string, data: UpdateMajorRequest): Promise<Major> => {
    const response = await http.put<Major>(`/majors/${id}`, data);
    return response.data;
  },

  deleteMajor: async (id: string): Promise<void> => {
    await http.delete(`/majors/${id}`);
  },
};
