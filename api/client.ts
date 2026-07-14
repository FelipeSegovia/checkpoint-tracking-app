import { getApiBaseUrl } from '@/api/config';
import { ApiError } from '@/api/errors';

type RequestOptions = {
  method?: 'GET' | 'POST' | 'PATCH' | 'DELETE';
  body?: unknown;
  token?: string | null;
  auth?: boolean;
};

export async function apiRequest<T>(
  path: string,
  { method = 'GET', body, token, auth = false }: RequestOptions = {},
): Promise<T> {
  const headers: Record<string, string> = {
    Accept: 'application/json',
  };

  if (body !== undefined) {
    headers['Content-Type'] = 'application/json';
  }

  if (auth && token) {
    headers.Authorization = `Bearer ${token}`;
  }

  let response: Response;

  try {
    response = await fetch(`${getApiBaseUrl()}${path}`, {
      method,
      headers,
      body: body !== undefined ? JSON.stringify(body) : undefined,
    });
  } catch {
    throw new ApiError(
      0,
      'No se pudo conectar con el servidor. Verifica que el backend esté en marcha.',
    );
  }

  if (response.status === 204) {
    return undefined as T;
  }

  if (!response.ok) {
    throw await ApiError.fromResponse(response);
  }

  return (await response.json()) as T;
}
