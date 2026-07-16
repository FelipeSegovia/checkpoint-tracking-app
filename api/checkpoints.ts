import { apiRequest } from '@/api/client';
import type {
  CheckpointResponse,
  CreateCheckpointRequest,
  UpdateCheckpointRequest,
} from '@/api/types';

type TokenOption = {
  token: string;
};

type ListCheckpointsOptions = TokenOption & {
  establishmentId: string;
  isActive?: boolean;
};

export function getCheckpoints({
  token,
  establishmentId,
  isActive = true,
}: ListCheckpointsOptions): Promise<CheckpointResponse[]> {
  const query = new URLSearchParams({
    establishmentId,
    isActive: String(isActive),
  });
  return apiRequest<CheckpointResponse[]>(`/checkpoints?${query}`, {
    auth: true,
    token,
  });
}

export function getCheckpointById(
  id: string,
  { token }: TokenOption,
): Promise<CheckpointResponse> {
  return apiRequest<CheckpointResponse>(`/checkpoints/${id}`, {
    auth: true,
    token,
  });
}

export function createCheckpoint(
  data: CreateCheckpointRequest,
  { token }: TokenOption,
): Promise<CheckpointResponse> {
  return apiRequest<CheckpointResponse>('/checkpoints', {
    method: 'POST',
    body: data,
    auth: true,
    token,
  });
}

export function updateCheckpoint(
  id: string,
  data: UpdateCheckpointRequest,
  { token }: TokenOption,
): Promise<CheckpointResponse> {
  return apiRequest<CheckpointResponse>(`/checkpoints/${id}`, {
    method: 'PATCH',
    body: data,
    auth: true,
    token,
  });
}

export function deleteCheckpoint(
  id: string,
  { token }: TokenOption,
): Promise<void> {
  return apiRequest<void>(`/checkpoints/${id}`, {
    method: 'DELETE',
    auth: true,
    token,
  });
}
