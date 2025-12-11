import { http } from "@/libs/http.libs";
import { API_PATHS } from "@/constants/api-path.constants";
import type {
  TimeRegister,
  CreateTimeRegisterRequest,
  UpdateTimeRegisterRequest,
} from "../types/time-register.types";

export const timeRegisterService = {
  getAllTimeRegisters: async (): Promise<TimeRegister[]> => {
    const response = await http.get<TimeRegister[]>(
      API_PATHS.TIME_REGISTERS.GET_ALL
    );
    return response.data;
  },

  getTimeRegisterById: async (id: string): Promise<TimeRegister> => {
    const response = await http.get<TimeRegister>(
      API_PATHS.TIME_REGISTERS.GET_BY_ID(id)
    );
    return response.data;
  },

  getByTypeSemester: async (typeSemester: string): Promise<TimeRegister[]> => {
    const response = await http.get<TimeRegister[]>(
      API_PATHS.TIME_REGISTERS.GET_BY_TYPE_SEMESTER(typeSemester)
    );
    return response.data;
  },

  getByTypeRegister: async (typeRegister: string): Promise<TimeRegister[]> => {
    const response = await http.get<TimeRegister[]>(
      API_PATHS.TIME_REGISTERS.GET_BY_TYPE_REGISTER(typeRegister)
    );
    return response.data;
  },

  searchByBothTypes: async (
    typeSemester: string,
    typeRegister: string
  ): Promise<TimeRegister[]> => {
    const response = await http.get<TimeRegister[]>(
      API_PATHS.TIME_REGISTERS.SEARCH,
      {
        params: { typeSemester, typeRegister },
      }
    );
    return response.data;
  },

  createTimeRegister: async (
    data: CreateTimeRegisterRequest
  ): Promise<TimeRegister> => {
    const response = await http.post<TimeRegister>(
      API_PATHS.TIME_REGISTERS.CREATE,
      data
    );
    return response.data;
  },

  updateTimeRegister: async (
    id: string,
    data: UpdateTimeRegisterRequest
  ): Promise<TimeRegister> => {
    const response = await http.put<TimeRegister>(
      API_PATHS.TIME_REGISTERS.UPDATE(id),
      data
    );
    return response.data;
  },

  deleteTimeRegister: async (id: string): Promise<void> => {
    await http.delete(API_PATHS.TIME_REGISTERS.DELETE(id));
  },
};

