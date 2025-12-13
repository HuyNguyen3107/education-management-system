export interface Class {
  id: string;
  classCode: string;
  teacherId: string;
  majorId?: string;
  specializationId?: string;
  teacherName?: string;
  majorName?: string;
  specializationName?: string;
  createdAt: string;
  updatedAt: string;
}

export interface ClassSearchParams {
  page?: number;
  size?: number;
  keyword?: string;
  teacherId?: string;
  majorId?: string;
  specializationId?: string;
}

export interface CreateClassRequest {
  classCode: string;
  teacherId: string;
  majorId?: string;
  specializationId?: string;
}

export interface UpdateClassRequest {
  classCode?: string;
  teacherId?: string;
  majorId?: string;
  specializationId?: string;
}
