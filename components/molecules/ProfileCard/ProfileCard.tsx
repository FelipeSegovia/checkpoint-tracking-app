import { StyleSheet, Text, View } from 'react-native';

import { InfoRow } from '@/components/molecules/InfoRow';
import { borders, colors, spacing, typography } from '@/quarks';
import { formatRut } from '@/utils/rut';

type ProfileCardProps = {
  firstName: string;
  lastName: string;
  identityNumber: string;
  email: string;
  mobilePhone: string;
  birthdate: string;
  roleLabel: string;
};

function formatBirthdateDisplay(value: string): string {
  const match = /^(\d{4})-(\d{2})-(\d{2})$/.exec(value);
  if (!match) return value;
  const [, year, month, day] = match;
  return `${day}-${month}-${year}`;
}

export function ProfileCard({
  firstName,
  lastName,
  identityNumber,
  email,
  mobilePhone,
  birthdate,
  roleLabel,
}: ProfileCardProps) {
  return (
    <View style={styles.card}>
      <View style={styles.header}>
        <Text style={styles.fullName}>
          {firstName} {lastName}
        </Text>
        <Text style={styles.hint}>
          Edición disponible próximamente
        </Text>
      </View>

      <InfoRow label="RUT" value={formatRut(identityNumber)} />
      <InfoRow label="Correo" value={email} />
      <InfoRow label="Teléfono" value={mobilePhone} />
      <InfoRow
        label="Fecha de nacimiento"
        value={formatBirthdateDisplay(birthdate)}
      />
      <InfoRow label="Rol" value={roleLabel} />
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: colors.surface,
    borderColor: colors.surfaceBorder,
    borderCurve: 'continuous',
    borderRadius: borders.radius.lg,
    borderWidth: borders.width.thin,
    gap: spacing.md,
    padding: spacing.md,
  },
  header: {
    gap: spacing.xxs,
    marginBottom: spacing.xs,
  },
  fullName: {
    color: colors.text,
    fontSize: typography.fontSize.lg,
    fontWeight: typography.fontWeight.bold,
  },
  hint: {
    color: colors.textMuted,
    fontSize: typography.fontSize.xs,
    fontWeight: typography.fontWeight.medium,
  },
});
