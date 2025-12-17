import { http } from "@/libs/http.libs";
import type { Department, PageResponse, DepartmentSearchParams, CreateDepartmentRequest, UpdateDepartmentRequest } from "../types/department.types";

export const departmentService = {
  getDepartments: async (params?: DepartmentSearchParams): Promise<PageResponse<Department>> => {
    const response = await http.get<any>("/departments", { params });
    // Handle legacy list response just in case, though we updated backend to return Page
    if (Array.isArray(response.data)) {
      return {
        content: response.data,
        totalPages: 1,
        totalElements: response.data.length,
        size: response.data.length,
        number: 0,
        numberOfElements: response.data.length,
        first: true,
        last: true,
        empty: response.data.length === 0,
      };
    }
    return response.data;
  },

  getDepartment: async (id: string): Promise<Department> => {
    const response = await http.get<Department>(`/departments/${id}`);
    return response.data;
  },

  createDepartment: async (data: CreateDepartmentRequest): Promise<Department> => {
    const response = await http.post<Department>("/departments", data);
    return response.data;
  },

  updateDepartment: async (id: string, data: UpdateDepartmentRequest): Promise<Department> => {
    const response = await http.put<Department>(`/departments/${id}`, data);
    return response.data;
  },

  deleteDepartment: async (id: string): Promise<void> => {
    await http.delete(`/departments/${id}`);
  }
};
