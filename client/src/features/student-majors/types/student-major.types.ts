export interface StudentMajor {
  id: string;
  studentId: string;
  studentCode?: string;
  studentName?: string;
  majorId: string;
  majorName?: string;
  specializationId?: string | null;
  specializationName?: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface CreateStudentMajorRequest {
  studentId: string;
  majorId: string;
  specializationId?: string | null;
}

export interface UpdateStudentMajorRequest {
  studentId: string;
  majorId: string;
  specializationId?: string | null;
}
