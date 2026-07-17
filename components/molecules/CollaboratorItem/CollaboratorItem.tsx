import Ionicons from '@expo/vector-icons/Ionicons';
import { memo } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';

import { borders, colors, spacing, typography } from '@/quarks';

type CollaboratorItemProps = {
  id?: string;
  firstName: string;
  lastName: string;
  subtitle: string;
  onPress?: (id: string) => void;
  onPressMenu?: () => void;
};

function getInitials(firstName: string, lastName: string): string {
  const first = firstName.trim().charAt(0);
  const last = lastName.trim().charAt(0);
  return `${first}${last}`.toUpperCase() || '?';
}

export const CollaboratorItem = memo(function CollaboratorItem({
  id,
  firstName,
  lastName,
  subtitle,
  onPress,
  onPressMenu,
}: CollaboratorItemProps) {
  const fullName = `${firstName} ${lastName}`.trim();
  const initials = getInitials(firstName, lastName);

  const content = (
    <>
      <View style={styles.avatar}>
        <Text style={styles.initials}>{initials}</Text>
      </View>

      <View style={styles.content}>
        <Text numberOfLines={1} style={styles.name}>
          {fullName}
        </Text>
        <Text numberOfLines={1} style={styles.subtitle}>
          {subtitle}
        </Text>
      </View>

      {onPressMenu ? (
        <Pressable
          accessibilityLabel="Opciones del colaborador"
          accessibilityRole="button"
          hitSlop={8}
          onPress={onPressMenu}
        >
          <Ionicons color={colors.textMuted} name="ellipsis-vertical" size={18} />
        </Pressable>
      ) : null}
    </>
  );

  if (onPress && id) {
    return (
      <Pressable
        accessibilityLabel={fullName}
        accessibilityRole="button"
        onPress={() => onPress(id)}
        style={({ pressed }) => [styles.row, pressed ? styles.pressed : null]}
      >
        {content}
      </Pressable>
    );
  }

  return <View style={styles.row}>{content}</View>;
});

const styles = StyleSheet.create({
  row: {
    alignItems: 'center',
    backgroundColor: colors.surface,
    borderColor: colors.surfaceBorder,
    borderCurve: 'continuous',
    borderRadius: borders.radius.md,
    borderWidth: borders.width.thin,
    flexDirection: 'row',
    gap: spacing.sm,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
  },
  avatar: {
    alignItems: 'center',
    backgroundColor: colors.primaryDark,
    borderCurve: 'continuous',
    borderRadius: borders.radius.xl,
    height: 40,
    justifyContent: 'center',
    width: 40,
  },
  initials: {
    color: colors.primary,
    fontSize: typography.fontSize.sm,
    fontWeight: typography.fontWeight.bold,
  },
  content: {
    flex: 1,
    gap: 2,
  },
  name: {
    color: colors.text,
    fontSize: typography.fontSize.md,
    fontWeight: typography.fontWeight.semibold,
  },
  subtitle: {
    color: colors.textSecondary,
    fontSize: typography.fontSize.sm,
  },
  pressed: {
    opacity: 0.88,
  },
});
