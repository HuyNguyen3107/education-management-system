import { http } from "@/libs/http.libs";
import type {
  CreditClass,
  CreateCreditClassRequest,
  UpdateCreditClassRequest,
} from "../types/credit-class.types";

const API_BASE = "/credit-classes";

export const creditClassService = {
  getAllCreditClasses: async (): Promise<CreditClass[]> => {
    const response = await http.get<CreditClass[]>(API_BASE);
    return response.data;
  },

  getCreditClassById: async (id: string): Promise<CreditClass> => {
    const response = await http.get<CreditClass>(`${API_BASE}/${id}`);
    return response.data;
  },

  createCreditClass: async (data: CreateCreditClassRequest): Promise<CreditClass> => {
    const response = await http.post<CreditClass>(API_BASE, data);
    return response.data;
  },

  updateCreditClass: async (id: string, data: UpdateCreditClassRequest): Promise<CreditClass> => {
    const response = await http.put<CreditClass>(`${API_BASE}/${id}`, data);
    return response.data;
  },

  deleteCreditClass: async (id: string): Promise<void> => {
    await http.delete(`${API_BASE}/${id}`);
  },
};

