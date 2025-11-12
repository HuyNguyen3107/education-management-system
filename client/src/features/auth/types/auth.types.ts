export interface LoginRequest {
  email: string;
  password: string;
}

export interface LoginResponse {
  token: string;
  message: string;
  id: string;
  email: string;
  name: string;
  phone: string;
  dateOfBirth: string;
  online: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface User {
  id: string;
  email: string;
  name: string;
  phone: string;
  dateOfBirth: string;
  online: boolean;
  createdAt: string;
  updatedAt: string;
}
