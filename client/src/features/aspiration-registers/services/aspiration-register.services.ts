import { http } from "@/libs/http.libs";
import type {
  AspirationRegister,
  CreateAspirationRegisterRequest,
  UpdateAspirationRegisterRequest,
} from "../types/aspiration-register.types";

const API_BASE = "/aspiration-registers";

export const aspirationRegisterService = {
  getAllAspirationRegisters: async (): Promise<AspirationRegister[]> => {
    const response = await http.get<AspirationRegister[]>(API_BASE);
    return response.data;
  },

  getAspirationRegisterById: async (
    id: string
  ): Promise<AspirationRegister> => {
    const response = await http.get<AspirationRegister>(`${API_BASE}/${id}`);
    return response.data;
  },

  createAspirationRegister: async (
    data: CreateAspirationRegisterRequest
  ): Promise<AspirationRegister> => {
    const response = await http.post<AspirationRegister>(API_BASE, data);
    return response.data;
  },

  updateAspirationRegister: async (
    id: string,
    data: UpdateAspirationRegisterRequest
  ): Promise<AspirationRegister> => {
    const response = await http.put<AspirationRegister>(
      `${API_BASE}/${id}`,
      data
    );
    return response.data;
  },

  deleteAspirationRegister: async (id: string): Promise<void> => {
    await http.delete(`${API_BASE}/${id}`);
  },

  getByStudentId: async (studentId: string): Promise<AspirationRegister[]> => {
    const response = await http.get<AspirationRegister[]>(
      `${API_BASE}/student/${studentId}`
    );
    return response.data;
  },

  getAvailableSubjects: async (studentId: string): Promise<any[]> => {
    const response = await http.get<any[]>(
      `${API_BASE}/available-subjects/${studentId}`
    );
    return response.data;
  },
};
