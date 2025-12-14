export interface Specialization {
  id: string;
  name: string;
  majorId: string;
  majorName: string;
  createdAt: string;
  updatedAt: string;
}

export interface CreateSpecializationRequest {
  name: string;
  majorId: string;
}

export interface UpdateSpecializationRequest {
  name: string;
  majorId: string;
}

export interface SpecializationResponse {
  content: Specialization[];
  totalPages: number;
  totalElements: number;
  size: number;
  number: number;
  numberOfElements: number;
  first: boolean;
  last: boolean;
  empty: boolean;
}

// Dummy export to ensure this file is treated as a module
export const _SPECIALIZATION_TYPES_CHECK = true;
