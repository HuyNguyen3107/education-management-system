export interface User {
  id: string;
  email: string;
  fullName: string;
  dateOfBirth: string;
  gender: string;
  phone: string;
  address: string;
  educationLevel: string;
  academicYear: string;
  status: string;
  role?: string;
  majorId?: string;
  specializationId?: string;
}

export interface Role {
  id: string;
  name: string;
  description: string;
}

export interface UserRole {
  id: string;
  userId: string;
  roleId: string;
  roleName: string;
}

export interface UserWithRoles extends User {
  roles: string[];
}

export interface PageResponse<T> {
  content: T[];
  totalPages: number;
  totalElements: number;
  size: number;
  number: number;
  numberOfElements: number;
  first: boolean;
  last: boolean;
  empty: boolean;
}

export interface UserSearchParams {
  page?: number;
  size?: number;
  search?: string;
  status?: string;
  role?: string;
  sort?: string;
}

export interface CreateUserRequest {
  email: string;
  password?: string;
  fullName: string;
  phone: string;
  dateOfBirth: string;
  gender: string;
  address: string;
  status: string;
  academicYear?: string;
  educationLevel?: string;
  role: string;
}

export interface UpdateUserRequest {
  email?: string;
  password?: string;
  fullName?: string;
  phone?: string;
  dateOfBirth?: string;
  gender?: string;
  address?: string;
  status?: string;
  academicYear?: string;
  educationLevel?: string;
  majorId?: string;
  specializationId?: string;
}
