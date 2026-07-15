import { apiRequest } from '@/api/client';
import type {
  CreateEstablishmentRequest,
  EstablishmentResponse,
  UserResponse,
} from '@/api/types';

type TokenOption = {
  token: string;
};

type ListEstablishmentsOptions = TokenOption & {
  isActive?: boolean;
};

export function getEstablishments({
  token,
  isActive = true,
}: ListEstablishmentsOptions): Promise<EstablishmentResponse[]> {
  const query = new URLSearchParams({ isActive: String(isActive) });
  return apiRequest<EstablishmentResponse[]>(`/establishments?${query}`, {
    auth: true,
    token,
  });
}

export function getEstablishmentById(
  id: string,
  { token }: TokenOption,
): Promise<EstablishmentResponse> {
  return apiRequest<EstablishmentResponse>(`/establishments/${id}`, {
    auth: true,
    token,
  });
}

export function getEstablishmentCollaborators(
  id: string,
  { token }: TokenOption,
): Promise<UserResponse[]> {
  return apiRequest<UserResponse[]>(`/establishments/${id}/collaborators`, {
    auth: true,
    token,
  });
}

export function createEstablishment(
  data: CreateEstablishmentRequest,
  { token }: TokenOption,
): Promise<EstablishmentResponse> {
  return apiRequest<EstablishmentResponse>('/establishments', {
    method: 'POST',
    body: data,
    auth: true,
    token,
  });
}
