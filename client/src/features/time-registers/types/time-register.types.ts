export interface TimeRegister {
  id: string;
  typeSemester: string | null;
  typeRegister: string | null;
  openTime: string;
  endTime: string;
  createdAt: string;
  updatedAt: string;
}

export interface CreateTimeRegisterRequest {
  typeSemester?: string;
  typeRegister?: string;
  openTime: string;
  endTime: string;
}

export interface UpdateTimeRegisterRequest {
  typeSemester?: string;
  typeRegister?: string;
  openTime?: string;
  endTime?: string;
}

