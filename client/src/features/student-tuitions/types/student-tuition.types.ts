export interface StudentTuition {
  id: string;
  studentId: string;
  tuitionId: string;
  endow?: number;
  createdAt: string;
  updatedAt: string;
}

export interface CreateStudentTuitionRequest {
  studentId: string;
  tuitionId: string;
  endow?: number;
}

export interface UpdateStudentTuitionRequest {
  studentId?: string;
  tuitionId?: string;
  endow?: number;
}

