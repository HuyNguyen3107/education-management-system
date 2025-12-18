import { http } from "@/libs/http.libs";
import type {
  Specialization,
  CreateSpecializationRequest,
  UpdateSpecializationRequest,
} from "../types/specialization.types";

export const specializationService = {
  getSpecializations: async (params?: {
    page?: number;
    size?: number;
    keyword?: string;
    majorId?: string;
  }) => {
    const response = await http.get<any>("/specializations", { params });
    // Handle both array (no pagination) and paginated response
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

  getAllSpecializations: async (): Promise<Specialization[]> => {
    const response = await http.get<any>("/specializations", {
      params: { page: 0, size: 10000 },
    });
    if (Array.isArray(response.data)) {
      return response.data;
    }
    return response.data?.content || [];
  },

  getSpecializationsByMajorId: async (
    majorId: string
  ): Promise<Specialization[]> => {
    const response = await http.get<Specialization[]>("/specializations", {
      params: { majorId },
    });
    return Array.isArray(response.data) ? response.data : [];
  },

  getSpecialization: async (id: string): Promise<Specialization> => {
    const response = await http.get<Specialization>(`/specializations/${id}`);
    return response.data;
  },

  createSpecialization: async (
    data: CreateSpecializationRequest
  ): Promise<Specialization> => {
    const response = await http.post<Specialization>("/specializations", data);
    return response.data;
  },

  updateSpecialization: async (
    id: string,
    data: UpdateSpecializationRequest
  ): Promise<Specialization> => {
    const response = await http.put<Specialization>(
      `/specializations/${id}`,
      data
    );
    return response.data;
  },

  deleteSpecialization: async (id: string): Promise<void> => {
    await http.delete(`/specializations/${id}`);
  },
};
