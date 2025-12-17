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

  getStudentCreditClassById: async (
    id: string
  ): Promise<StudentCreditClass> => {
    const response = await http.get<StudentCreditClass>(`${API_BASE}/${id}`);
    return response.data;
  },

  getStudentCreditClassesByStudentId: async (
    studentId: string
  ): Promise<StudentCreditClass[]> => {
    const response = await http.get<StudentCreditClass[]>(
      `${API_BASE}/student/${studentId}`
    );
    return response.data;
  },

  getStudentCreditClassesByCreditClassId: async (
    creditClassId: string
  ): Promise<StudentCreditClass[]> => {
    const response = await http.get<StudentCreditClass[]>(
      `${API_BASE}/credit-class/${creditClassId}`
    );
    return response.data;
  },

  getRegistrationInfo: async (studentId: string): Promise<any[]> => {
    const response = await http.get<any[]>(
      `${API_BASE}/registration-info/${studentId}`
    );
    return response.data;
  },

  getWeeklySchedule: async (
    studentId: string,
    startDate: string,
    endDate: string
  ): Promise<any[]> => {
    // We added a new endpoint for this: /schedule/{studentId}
    // This endpoint returns enriched CreditClass details including schedule.
    // Filtering by date range will be done on the client side for now,
    // as the schedule in DB is generic (e.g. "Monday, Period 1-3") and not specific dates.
    // However, if we need specific dates, we might need to expand the recurrence logic.
    // For now, let's fetch all and filter/display.
    const response = await http.get<any[]>(`${API_BASE}/schedule/${studentId}`);
    return response.data;
  },

  getExamSchedule: async (studentId: string): Promise<any[]> => {
    const response = await http.get<any[]>(
      `${API_BASE}/exam-schedule/${studentId}`
    );
    return response.data;
  },

  getGrades: async (studentId: string): Promise<any[]> => {
    const response = await http.get<any[]>(`${API_BASE}/grades/${studentId}`);
    return response.data;
  },

  createStudentCreditClass: async (
    data: CreateStudentCreditClassRequest
  ): Promise<StudentCreditClass> => {
    const response = await http.post<StudentCreditClass>(API_BASE, data);
    return response.data;
  },

  updateStudentCreditClass: async (
    id: string,
    data: UpdateStudentCreditClassRequest
  ): Promise<StudentCreditClass> => {
    const response = await http.put<StudentCreditClass>(
      `${API_BASE}/${id}`,
      data
    );
    return response.data;
  },

  deleteStudentCreditClass: async (id: string): Promise<void> => {
    await http.delete(`${API_BASE}/${id}`);
  },
};
