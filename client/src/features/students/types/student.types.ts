export interface Student {
  id: string;
  studentCode: string;
  userId: string;
  createdAt: string;
  updatedAt: string;
}

export interface StudentWithUser extends Student {
  user?: {
    id: string;
    email: string;
    fullName: string;
    phone: string;
    dateOfBirth: string;
    gender: string;
    address: string;
    status: string;
    academicYear?: string;
    educationLevel?: string;
  };
}

export interface CreateStudentRequest {
  studentCode: string;
  userId: string;
}

export interface UpdateStudentRequest {
  studentCode?: string;
  userId?: string;
}

