import { http } from "@/libs/http.libs";
import type {
  Subject,
  CreateSubjectRequest,
  UpdateSubjectRequest,
} from "../types/subject.types";

const API_BASE = "/subjects";

export const subjectService = {
  getAllSubjects: async (): Promise<Subject[]> => {
    const response = await http.get<Subject[]>(API_BASE);
    return response.data;
  },

  getSubjectById: async (id: string): Promise<Subject> => {
    const response = await http.get<Subject>(`${API_BASE}/${id}`);
    return response.data;
  },

  getSubjectByCode: async (subjectCode: string): Promise<Subject> => {
    const response = await http.get<Subject>(`${API_BASE}/code/${subjectCode}`);
    return response.data;
  },

  getSubjectsByMajorId: async (majorId: string): Promise<Subject[]> => {
    const response = await http.get<Subject[]>(`${API_BASE}/major/${majorId}`);
    return response.data;
  },

  getSubjectsBySpecializationId: async (specializationId: string): Promise<Subject[]> => {
    const response = await http.get<Subject[]>(`${API_BASE}/specialization/${specializationId}`);
    return response.data;
  },

  getSubjectsBySemester: async (semester: string): Promise<Subject[]> => {
    const response = await http.get<Subject[]>(`${API_BASE}/semester/${semester}`);
    return response.data;
  },

  createSubject: async (data: CreateSubjectRequest): Promise<Subject> => {
    const response = await http.post<Subject>(API_BASE, data);
    return response.data;
  },

  updateSubject: async (id: string, data: UpdateSubjectRequest): Promise<Subject> => {
    const response = await http.put<Subject>(`${API_BASE}/${id}`, data);
    return response.data;
  },

  deleteSubject: async (id: string): Promise<void> => {
    await http.delete(`${API_BASE}/${id}`);
  },
};

