import { http } from "@/libs/http.libs";
import type {
  StudentCreditClass,
  CreateStudentCreditClassRequest,
  UpdateStudentCreditClassRequest,
} from "../types/student-credit-class.types";

const API_BASE = "/student-credit-classes";

export const studentCreditClassService = {
  getAllStudentCreditClasses: async (): Promise<StudentCreditClass[]> => {
    const response = await http.get<StudentCreditClass[]>(API_BASE);
    return response.data;
  },

  getStudentCreditClassById: async (id: string): Promise<StudentCreditClass> => {
    const response = await http.get<StudentCreditClass>(`${API_BASE}/${id}`);
    return response.data;
  },

  getStudentCreditClassesByStudentId: async (studentId: string): Promise<StudentCreditClass[]> => {
    const response = await http.get<StudentCreditClass[]>(`${API_BASE}/student/${studentId}`);
    return response.data;
  },

  getStudentCreditClassesByCreditClassId: async (creditClassId: string): Promise<StudentCreditClass[]> => {
    const response = await http.get<StudentCreditClass[]>(`${API_BASE}/credit-class/${creditClassId}`);
    return response.data;
  },

  createStudentCreditClass: async (data: CreateStudentCreditClassRequest): Promise<StudentCreditClass> => {
    const response = await http.post<StudentCreditClass>(API_BASE, data);
    return response.data;
  },

  updateStudentCreditClass: async (id: string, data: UpdateStudentCreditClassRequest): Promise<StudentCreditClass> => {
    const response = await http.put<StudentCreditClass>(`${API_BASE}/${id}`, data);
    return response.data;
  },

  deleteStudentCreditClass: async (id: string): Promise<void> => {
    await http.delete(`${API_BASE}/${id}`);
  },
};

