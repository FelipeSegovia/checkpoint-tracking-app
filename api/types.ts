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
  supervisorId: string | null;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
};

export type EstablishmentResponse = {
  id: string;
  name: string;
  address: string;
  supervisorId: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
};

export type CheckpointResponse = {
  id: string;
  name: string;
  establishmentId: string;
  qrPayload: string;
  qrCodeBase64: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
};

export type CreateUserRequest = {
  firstName: string;
  lastName: string;
  birthdate: string; // dd-mm-YYYY
  identityNumber: string;
  mobilePhone: string;
  email: string;
  password: string;
  role: UserRole;
  supervisorId?: string;
};

export type UpdateUserRequest = {
  firstName?: string;
  lastName?: string;
  birthdate?: string;
  identityNumber?: string;
  mobilePhone?: string;
  email?: string;
  password?: string;
};

export type CreateEstablishmentRequest = {
  name: string;
  address: string;
  supervisorId?: string;
};

export type UpdateEstablishmentRequest = {
  name?: string;
  address?: string;
};

export type CreateCheckpointRequest = {
  name: string;
  establishmentId: string;
};

export type UpdateCheckpointRequest = {
  name?: string;
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
