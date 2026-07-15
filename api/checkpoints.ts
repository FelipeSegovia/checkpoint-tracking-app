import { apiRequest } from '@/api/client';
import type { CheckpointResponse, CreateCheckpointRequest } from '@/api/types';

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
