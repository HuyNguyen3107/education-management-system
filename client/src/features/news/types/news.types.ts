export interface News {
  id: string;
  title: string;
  content: string;
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

export interface NewsParams {
  page?: number;
  size?: number;
  search?: string;
  sort?: string;
}

export interface CreateNewsRequest {
  title: string;
  content: string;
}

export interface UpdateNewsRequest extends CreateNewsRequest {}
