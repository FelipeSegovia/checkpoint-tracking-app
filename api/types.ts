export type UserRole = 'admin' | 'supervisor' | 'colaborador';

export type UserResponse = {
  id: string;
  firstName: string;
  lastName: string;
  birthdate: string;
  identityNumber: string;
  mobilePhone: string;
  email: string;
  role: UserRole;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
};

export type ErrorResponse = {
  statusCode: number;
  message: string | string[];
  error: string;
};

export type LoginRequest = {
  identityNumber: string;
  password: string;
};

export type LoginResponse = {
  accessToken: string;
  role: UserRole;
};
