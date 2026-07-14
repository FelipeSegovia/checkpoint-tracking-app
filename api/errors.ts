import type { ErrorResponse } from '@/api/types';

export class ApiError extends Error {
  readonly statusCode: number;
  readonly details: string | string[];

  constructor(statusCode: number, message: string | string[], error?: string) {
    const normalized = Array.isArray(message) ? message.join('\n') : message;
    super(normalized || error || 'Error de red');
    this.name = 'ApiError';
    this.statusCode = statusCode;
    this.details = message;
  }

  static async fromResponse(response: Response): Promise<ApiError> {
    let body: Partial<ErrorResponse> | undefined;

    try {
      body = (await response.json()) as ErrorResponse;
    } catch {
      body = undefined;
    }

    const rawMessage = body?.message ?? response.statusText;
    const message = mapApiMessage(response.status, rawMessage);

    return new ApiError(
      body?.statusCode ?? response.status,
      message,
      body?.error,
    );
  }
}

function mapApiMessage(
  status: number,
  message: string | string[],
): string | string[] {
  const text = Array.isArray(message) ? message.join(' ') : message;

  if (status === 401) {
    if (text.toLowerCase().includes('inactive')) {
      return 'Tu cuenta está inactiva. Contacta a tu supervisor.';
    }
    return 'RUT o contraseña incorrectos';
  }

  if (status === 400) {
    return Array.isArray(message)
      ? message
      : text || 'Los datos enviados no son válidos';
  }

  return message;
}

export function getErrorMessage(error: unknown): string {
  if (error instanceof ApiError) return error.message;
  if (error instanceof Error) return error.message;
  return 'Ocurrió un error inesperado';
}
