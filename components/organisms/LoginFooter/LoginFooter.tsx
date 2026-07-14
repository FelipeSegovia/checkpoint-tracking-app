import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import { StyleSheet, Text, View } from 'react-native';

import { StatusItem } from '@/components/molecules/StatusItem';
import { colors, spacing, typography } from '@/quarks';

export function LoginFooter() {
  return (
    <View style={styles.footer}>
      <View style={styles.statusRow}>
        <StatusItem
          icon={<MaterialCommunityIcons name="shield-check-outline" size={18} color={colors.status} />}
          label="Encrypted"
        />
        <StatusItem
          icon={<MaterialCommunityIcons name="sync" size={18} color={colors.status} />}
          label="Auth V2"
        />
        <StatusItem
          icon={<MaterialCommunityIcons name="circle-outline" size={18} color={colors.status} />}
          label="Live Monitor"
        />
      </View>
      <Text style={styles.copyright}>
        © 2026 Ronda Segura v1.0.0 | Propiedad de Seguridad Central
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  footer: {
    alignItems: 'center',
    gap: spacing.sm,
  },
  statusRow: {
    flexDirection: 'row',
    gap: spacing.lg,
    justifyContent: 'center',
  },
  copyright: {
    color: colors.textMuted,
    fontSize: typography.fontSize.xs,
    textAlign: 'center',
  },
});
