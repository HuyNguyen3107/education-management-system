import { http } from "@/libs/http.libs";
import type {
  StudentTuition,
  CreateStudentTuitionRequest,
  UpdateStudentTuitionRequest,
} from "../types/student-tuition.types";

const API_BASE = "/student-tuitions";

export const studentTuitionService = {
  getAllStudentTuitions: async (): Promise<StudentTuition[]> => {
    const response = await http.get<StudentTuition[]>(API_BASE);
    return response.data;
  },

  getStudentTuitionById: async (id: string): Promise<StudentTuition> => {
    const response = await http.get<StudentTuition>(`${API_BASE}/${id}`);
    return response.data;
  },

  createStudentTuition: async (data: CreateStudentTuitionRequest): Promise<StudentTuition> => {
    const response = await http.post<StudentTuition>(API_BASE, data);
    return response.data;
  },

  updateStudentTuition: async (id: string, data: UpdateStudentTuitionRequest): Promise<StudentTuition> => {
    const response = await http.put<StudentTuition>(`${API_BASE}/${id}`, data);
    return response.data;
  },

  deleteStudentTuition: async (id: string): Promise<void> => {
    await http.delete(`${API_BASE}/${id}`);
  },
};

