import { http } from "@/libs/http.libs";
import { API_PATHS } from "@/constants/api-path.constants";
import type {
  LecturerProfile,
  LecturerClass,
  LecturerStudent,
  UpdateGradeRequest,
} from "../types/lecturer-dashboard.types";

export const lecturerServices = {
  getProfile: async () => {
    const response = await http.get<LecturerProfile>(
      API_PATHS.LECTURER.PROFILE
    );
    return response.data;
  },
  getClasses: async () => {
    const response = await http.get<LecturerClass[]>(
      API_PATHS.LECTURER.CLASSES
    );
    return response.data;
  },
  getClassStudents: async (classId: string) => {
    const response = await http.get<LecturerStudent[]>(
      API_PATHS.LECTURER.CLASS_STUDENTS(classId)
    );
    return response.data;
  },
  updateGrade: async (
    classId: string,
    studentId: string,
    data: UpdateGradeRequest
  ) => {
    const response = await http.post(
      API_PATHS.LECTURER.UPDATE_GRADE(classId, studentId),
      data
    );
    return response.data;
  },
  getSchedule: async () => {
    const response = await http.get<LecturerClass[]>(
      API_PATHS.LECTURER.SCHEDULE
    );
    return response.data;
  },
};
