export interface Tuition {
  id: string;
  price: number;
  semester: string;
  year: string;
  academicYear: string;
  createdAt: string;
  updatedAt: string;
}

export interface CreateTuitionRequest {
  price: number;
  semester: string;
  year: string;
  academicYear: string;
}

export interface UpdateTuitionRequest {
  price?: number;
  semester?: string;
  year?: string;
  academicYear?: string;
}

