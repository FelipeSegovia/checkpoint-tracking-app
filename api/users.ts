import { apiRequest } from '@/api/client';
import type {
  CreateUserRequest,
  UpdateUserRequest,
  UserResponse,
} from '@/api/types';

type TokenOption = {
  token: string;
};

type ListUsersOptions = TokenOption & {
  isActive?: boolean;
};

export function getUsers({
  token,
  isActive,
}: ListUsersOptions): Promise<UserResponse[]> {
  const query =
    isActive === undefined
      ? ''
      : `?${new URLSearchParams({ isActive: String(isActive) })}`;

  return apiRequest<UserResponse[]>(`/users${query}`, {
    auth: true,
    token,
  });
}

export function getUserById(
  id: string,
  { token }: TokenOption,
): Promise<UserResponse> {
  return apiRequest<UserResponse>(`/users/${id}`, {
    auth: true,
    token,
  });
}

export function getMyProfile({
  userId,
  token,
}: {
  userId: string;
  token: string;
}): Promise<UserResponse> {
  return getUserById(userId, { token });
}

export function createUser(
  data: CreateUserRequest,
  { token }: TokenOption,
): Promise<UserResponse> {
  return apiRequest<UserResponse>('/users', {
    method: 'POST',
    body: data,
    auth: true,
    token,
  });
}

export function updateUser(
  id: string,
  data: UpdateUserRequest,
  { token }: TokenOption,
): Promise<UserResponse> {
  return apiRequest<UserResponse>(`/users/${id}`, {
    method: 'PATCH',
    body: data,
    auth: true,
    token,
  });
}

export function deleteUser(id: string, { token }: TokenOption): Promise<void> {
  return apiRequest<void>(`/users/${id}`, {
    method: 'DELETE',
    auth: true,
    token,
  });
}
