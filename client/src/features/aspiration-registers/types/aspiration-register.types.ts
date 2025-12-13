export interface AspirationRegister {
  id: string;
  subjectCode: string;
  studentId: string;
  reason: string;
  semester: string;
  createdAt: string;
  updatedAt: string;
}

export interface CreateAspirationRegisterRequest {
  subjectCode: string;
  studentId: string;
  reason: string;
  semester: string;
}

export interface UpdateAspirationRegisterRequest {
  subjectCode?: string;
  studentId?: string;
  reason?: string;
  semester?: string;
}

