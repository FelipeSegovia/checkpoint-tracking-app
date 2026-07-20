import { StyleSheet, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { EmptyState } from '@/components/atoms/EmptyState';
import { colors, spacing, typography } from '@/quarks';

export function CollaboratorRoutesPage() {
  const insets = useSafeAreaInsets();

  return (
    <View
      style={[
        styles.screen,
        {
          paddingTop: Math.max(insets.top, spacing.lg),
          paddingBottom: Math.max(insets.bottom, spacing.lg),
        },
      ]}
    >
      <View style={styles.header}>
        <Text style={styles.title}>Rutas</Text>
        <Text style={styles.subtitle}>
          Consulta el estado de tus rondas asignadas.
        </Text>
      </View>

      <EmptyState
        description="Pronto podrás ver aquí el detalle y el progreso de tus rondas de vigilancia."
        icon="map-outline"
        title="Sin información por ahora"
      />
    </View>
  );
}

const styles = StyleSheet.create({
  screen: {
    backgroundColor: colors.background,
    flex: 1,
    gap: spacing.lg,
    paddingHorizontal: spacing.md,
  },
  header: {
    gap: spacing.xs,
  },
  title: {
    color: colors.text,
    fontSize: typography.fontSize.xl,
    fontWeight: typography.fontWeight.bold,
  },
  subtitle: {
    color: colors.textSecondary,
    fontSize: typography.fontSize.sm,
  },
});
