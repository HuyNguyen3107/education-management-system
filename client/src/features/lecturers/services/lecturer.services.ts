import { http } from "@/libs/http.libs";
import { API_PATHS } from "@/constants/api-path.constants";
import type {
  Lecturer,
  CreateLecturerRequest,
  UpdateLecturerRequest,
} from "../types/lecturer.types";

export const lecturerService = {
  getAllLecturers: async (): Promise<Lecturer[]> => {
    const response = await http.get<Lecturer[]>(API_PATHS.TEACHERS.GET_ALL);
    return response.data;
  },

  getLecturerById: async (id: string): Promise<Lecturer> => {
    const response = await http.get<Lecturer>(API_PATHS.TEACHERS.GET_BY_ID(id));
    return response.data;
  },

  createLecturer: async (data: CreateLecturerRequest): Promise<Lecturer> => {
    const response = await http.post<Lecturer>(API_PATHS.TEACHERS.CREATE, data);
    return response.data;
  },

  updateLecturer: async (id: string, data: UpdateLecturerRequest): Promise<Lecturer> => {
    const response = await http.put<Lecturer>(API_PATHS.TEACHERS.UPDATE(id), data);
    return response.data;
  },

  deleteLecturer: async (id: string): Promise<void> => {
    await http.delete(API_PATHS.TEACHERS.DELETE(id));
  },
};

