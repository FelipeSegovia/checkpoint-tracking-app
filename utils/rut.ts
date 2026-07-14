const MAX_RUT_BODY_LENGTH = 8;
const MAX_RUT_LENGTH = MAX_RUT_BODY_LENGTH + 1;

/**
 * Keeps only digits and the letter K as verification digit.
 * K is only allowed as the final character.
 */
export function cleanRut(value: string): string {
  const raw = value.toUpperCase().replace(/[^0-9K]/g, '');
  const digits = raw.replace(/K/g, '');
  const endsWithK = raw.endsWith('K');

  if (endsWithK) {
    if (digits.length === 0) return '';
    return `${digits.slice(0, MAX_RUT_BODY_LENGTH)}K`;
  }

  return digits.slice(0, MAX_RUT_LENGTH);
}

/**
 * Formats a Chilean RUT as the user types: 12.345.678-9
 * The last character is treated as the verification digit whenever length > 1.
 */
export function formatRut(value: string): string {
  const cleaned = cleanRut(value);

  if (cleaned.length === 0) return '';
  if (cleaned.length === 1) return cleaned;

  const body = cleaned.slice(0, -1);
  const dv = cleaned.slice(-1);
  const bodyWithDots = body
    .split('')
    .reverse()
    .join('')
    .replace(/(\d{3})(?=\d)/g, '$1.')
    .split('')
    .reverse()
    .join('');

  return `${bodyWithDots}-${dv}`;
}

/** Validates a Chilean RUT using the modulo-11 check digit. */
export function isValidRut(value: string): boolean {
  const cleaned = cleanRut(value);

  if (cleaned.length < 2) return false;

  const body = cleaned.slice(0, -1);
  const dv = cleaned.slice(-1);

  if (!/^\d+$/.test(body) || body.length < 7 || body.length > MAX_RUT_BODY_LENGTH) {
    return false;
  }

  if (!/^[\dK]$/.test(dv)) return false;

  let sum = 0;
  let multiplier = 2;

  for (let i = body.length - 1; i >= 0; i -= 1) {
    sum += Number(body[i]) * multiplier;
    multiplier = multiplier === 7 ? 2 : multiplier + 1;
  }

  const remainder = 11 - (sum % 11);
  const expectedDv =
    remainder === 11 ? '0' : remainder === 10 ? 'K' : String(remainder);

  return dv === expectedDv;
}

export function getRutError(value: string): string | undefined {
  const cleaned = cleanRut(value);

  if (cleaned.length === 0) return undefined;
  if (cleaned.length < 8) return 'RUT incompleto';
  if (!isValidRut(cleaned)) return 'RUT inválido';
  return undefined;
}
