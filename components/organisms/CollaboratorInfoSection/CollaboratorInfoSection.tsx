import { StyleSheet, View } from 'react-native';

import { SectionHeader } from '@/components/atoms/SectionHeader';
import { InfoRow } from '@/components/molecules/InfoRow';
import { borders, colors, spacing } from '@/quarks';
import { formatRut } from '@/utils/rut';

type CollaboratorInfoSectionProps = {
  identityNumber: string;
  email: string;
  mobilePhone: string;
  birthdate: string;
};

function formatBirthdateDisplay(value: string): string {
  // API returns YYYY-MM-DD
  const match = /^(\d{4})-(\d{2})-(\d{2})$/.exec(value);
  if (!match) return value;
  const [, year, month, day] = match;
  return `${day}-${month}-${year}`;
}

export function CollaboratorInfoSection({
  identityNumber,
  email,
  mobilePhone,
  birthdate,
}: CollaboratorInfoSectionProps) {
  return (
    <View style={styles.container}>
      <SectionHeader title="Información Personal" />
      <View style={styles.card}>
        <InfoRow label="RUT" value={formatRut(identityNumber)} />
        <InfoRow label="Correo" value={email} />
        <InfoRow label="Teléfono" value={mobilePhone} />
        <InfoRow
          label="Fecha de nacimiento"
          value={formatBirthdateDisplay(birthdate)}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    gap: spacing.sm,
  },
  card: {
    backgroundColor: colors.surface,
    borderColor: colors.surfaceBorder,
    borderCurve: 'continuous',
    borderRadius: borders.radius.md,
    borderWidth: borders.width.thin,
    gap: spacing.md,
    padding: spacing.md,
  },
});
