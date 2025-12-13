import { http } from "@/libs/http.libs";
import type {
  Class,
  CreateClassRequest,
  UpdateClassRequest,
} from "../types/class.types";

const API_BASE = "/classes";

export const classService = {
  getAllClasses: async (): Promise<Class[]> => {
    const response = await http.get<Class[]>(API_BASE);
    return response.data;
  },

  getClassById: async (id: string): Promise<Class> => {
    const response = await http.get<Class>(`${API_BASE}/${id}`);
    return response.data;
  },

  getClassByCode: async (classCode: string): Promise<Class> => {
    const response = await http.get<Class>(`${API_BASE}/code/${classCode}`);
    return response.data;
  },

  getClassesByTeacherId: async (teacherId: string): Promise<Class[]> => {
    const response = await http.get<Class[]>(`${API_BASE}/teacher/${teacherId}`);
    return response.data;
  },

  getClassesByMajorId: async (majorId: string): Promise<Class[]> => {
    const response = await http.get<Class[]>(`${API_BASE}/major/${majorId}`);
    return response.data;
  },

  getClassesBySpecializationId: async (specializationId: string): Promise<Class[]> => {
    const response = await http.get<Class[]>(`${API_BASE}/specialization/${specializationId}`);
    return response.data;
  },

  createClass: async (data: CreateClassRequest): Promise<Class> => {
    const response = await http.post<Class>(API_BASE, data);
    return response.data;
  },

  updateClass: async (id: string, data: UpdateClassRequest): Promise<Class> => {
    const response = await http.put<Class>(`${API_BASE}/${id}`, data);
    return response.data;
  },

  deleteClass: async (id: string): Promise<void> => {
    await http.delete(`${API_BASE}/${id}`);
  },
};

