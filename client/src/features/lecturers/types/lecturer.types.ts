export interface Lecturer {
  id: string;
  teacherCode: string;
  userId: string;
  createdAt: string;
  updatedAt: string;
}

export interface LecturerWithUser extends Lecturer {
  user?: {
    id: string;
    email: string;
    fullName: string;
    phone: string;
    dateOfBirth: string;
    gender: string;
    address: string;
    status: string;
  };
}

export interface CreateLecturerRequest {
  teacherCode: string;
  userId: string;
}

export interface UpdateLecturerRequest {
  teacherCode?: string;
  userId?: string;
}

