import { http } from "@/libs/http.libs";
import { API_PATHS } from "@/constants/api-path.constants";
import type {
  Tuition,
  CreateTuitionRequest,
  UpdateTuitionRequest,
} from "../types/tuition.types";

export const tuitionService = {
  getAllTuitions: async (): Promise<Tuition[]> => {
    const response = await http.get<Tuition[]>(API_PATHS.TUITIONS.GET_ALL);
    return response.data;
  },

  getTuitionById: async (id: string): Promise<Tuition> => {
    const response = await http.get<Tuition>(API_PATHS.TUITIONS.GET_BY_ID(id));
    return response.data;
  },

  createTuition: async (data: CreateTuitionRequest): Promise<Tuition> => {
    const response = await http.post<Tuition>(API_PATHS.TUITIONS.CREATE, data);
    return response.data;
  },

  updateTuition: async (
    id: string,
    data: UpdateTuitionRequest
  ): Promise<Tuition> => {
    const response = await http.put<Tuition>(API_PATHS.TUITIONS.UPDATE(id), data);
    return response.data;
  },

  deleteTuition: async (id: string): Promise<void> => {
    await http.delete(API_PATHS.TUITIONS.DELETE(id));
  },
};

