export interface Department {
  id: string;
  name: string;
  majorId: string;
  majorName?: string;
  createdAt: string;
  updatedAt: string;
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

export interface DepartmentSearchParams {
  page?: number;
  size?: number;
  keyword?: string;
  majorId?: string;
}

export interface CreateDepartmentRequest {
  name: string;
  majorId: string;
}

export interface UpdateDepartmentRequest {
  name: string;
  majorId: string;
}
