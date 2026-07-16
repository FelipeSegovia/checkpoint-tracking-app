import { apiRequest } from '@/api/client';
import type { LoginRequest, LoginResponse } from '@/api/types';

export function login(credentials: LoginRequest): Promise<LoginResponse> {
  return apiRequest<LoginResponse>('/auth/login', {
    method: 'POST',
    body: credentials,
  });
}

export function logout(token: string): Promise<void> {
  return apiRequest<void>('/auth/logout', {
    method: 'POST',
    auth: true,
    token,
  });
}
