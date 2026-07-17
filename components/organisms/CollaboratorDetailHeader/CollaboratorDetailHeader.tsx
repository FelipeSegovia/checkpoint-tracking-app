import { StyleSheet, Text, View } from 'react-native';

import { StatusBadge } from '@/components/atoms/StatusBadge';
import { borders, colors, spacing, typography } from '@/quarks';

type CollaboratorDetailHeaderProps = {
  firstName: string;
  lastName: string;
  isActive: boolean;
};

function getInitials(firstName: string, lastName: string): string {
  const first = firstName.trim().charAt(0);
  const last = lastName.trim().charAt(0);
  return `${first}${last}`.toUpperCase() || '?';
}

export function CollaboratorDetailHeader({
  firstName,
  lastName,
  isActive,
}: CollaboratorDetailHeaderProps) {
  const fullName = `${firstName} ${lastName}`.trim();
  const initials = getInitials(firstName, lastName);

  return (
    <View style={styles.container}>
      <View style={styles.avatar}>
        <Text style={styles.initials}>{initials}</Text>
      </View>
      <View style={styles.info}>
        <Text style={styles.name}>{fullName}</Text>
        <StatusBadge
          label={isActive ? 'Activo' : 'Inactivo'}
          status={isActive ? 'active' : 'inactive'}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    flexDirection: 'row',
    gap: spacing.md,
  },
  avatar: {
    alignItems: 'center',
    backgroundColor: colors.primaryDark,
    borderColor: colors.primary,
    borderCurve: 'continuous',
    borderRadius: borders.radius.xl,
    borderWidth: borders.width.thin,
    height: 64,
    justifyContent: 'center',
    width: 64,
  },
  initials: {
    color: colors.primary,
    fontSize: typography.fontSize.lg,
    fontWeight: typography.fontWeight.bold,
  },
  info: {
    flex: 1,
    gap: spacing.xs,
  },
  name: {
    color: colors.text,
    fontSize: typography.fontSize.lg,
    fontWeight: typography.fontWeight.bold,
  },
});
