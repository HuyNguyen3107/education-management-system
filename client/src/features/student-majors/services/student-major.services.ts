import { http } from "@/libs/http.libs";
import type {
  StudentMajor,
  CreateStudentMajorRequest,
  UpdateStudentMajorRequest,
} from "../types/student-major.types";

export const studentMajorService = {
  getAll: async (): Promise<StudentMajor[]> => {
    const response = await http.get<StudentMajor[]>("/student-majors");
    return response.data;
  },

  getByStudentId: async (studentId: string): Promise<StudentMajor[]> => {
    const response = await http.get<StudentMajor[]>(
      `/student-majors/student/${studentId}`
    );
    return response.data;
  },

  getById: async (id: string): Promise<StudentMajor> => {
    const response = await http.get<StudentMajor>(`/student-majors/${id}`);
    return response.data;
  },

  create: async (data: CreateStudentMajorRequest): Promise<StudentMajor> => {
    const response = await http.post<StudentMajor>("/student-majors", data);
    return response.data;
  },

  update: async (
    id: string,
    data: UpdateStudentMajorRequest
  ): Promise<StudentMajor> => {
    const response = await http.put<StudentMajor>(
      `/student-majors/${id}`,
      data
    );
    return response.data;
  },

  delete: async (id: string): Promise<void> => {
    await http.delete(`/student-majors/${id}`);
  },
};
