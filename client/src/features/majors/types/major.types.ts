export interface Major {
  id: string;
  name: string;
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

export interface MajorSearchParams {
  page?: number;
  size?: number;
  keyword?: string;
}

export interface CreateMajorRequest {
  name: string;
}

export interface UpdateMajorRequest {
  name: string;
}
