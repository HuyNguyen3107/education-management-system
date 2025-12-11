import { http } from "@/libs/http.libs";
import { API_PATHS } from "@/constants/api-path.constants";
import type {
  Student,
  CreateStudentRequest,
  UpdateStudentRequest,
} from "../types/student.types";

export const studentService = {
  getAllStudents: async (): Promise<Student[]> => {
    const response = await http.get<Student[]>(API_PATHS.STUDENTS.GET_ALL);
    return response.data;
  },

  getStudentById: async (id: string): Promise<Student> => {
    const response = await http.get<Student>(API_PATHS.STUDENTS.GET_BY_ID(id));
    return response.data;
  },

  getStudentByCode: async (code: string): Promise<Student> => {
    const response = await http.get<Student>(API_PATHS.STUDENTS.GET_BY_CODE(code));
    return response.data;
  },

  getStudentByUserId: async (userId: string): Promise<Student> => {
    const response = await http.get<Student>(API_PATHS.STUDENTS.GET_BY_USER_ID(userId));
    return response.data;
  },

  createStudent: async (data: CreateStudentRequest): Promise<Student> => {
    const response = await http.post<Student>(API_PATHS.STUDENTS.CREATE, data);
    return response.data;
  },

  updateStudent: async (id: string, data: UpdateStudentRequest): Promise<Student> => {
    const response = await http.put<Student>(API_PATHS.STUDENTS.UPDATE(id), data);
    return response.data;
  },

  deleteStudent: async (id: string): Promise<void> => {
    await http.delete(API_PATHS.STUDENTS.DELETE(id));
  },
};

