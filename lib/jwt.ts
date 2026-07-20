/**
 * Decodifica el payload de un JWT sin verificar la firma.
 * Solo se usa para leer claims (p. ej. `sub`) del token ya emitido por el backend.
 */
export function decodeJwtPayload(token: string): { sub: string } {
  const parts = token.split('.');
  if (parts.length < 2 || !parts[1]) {
    throw new Error('Token JWT inválido');
  }

  const base64 = parts[1].replace(/-/g, '+').replace(/_/g, '/');
  const padded = base64.padEnd(base64.length + ((4 - (base64.length % 4)) % 4), '=');
  const json = atob(padded);
  const payload = JSON.parse(json) as { sub?: string };

  if (!payload.sub) {
    throw new Error('El token JWT no contiene el claim sub');
  }

  return { sub: payload.sub };
}
