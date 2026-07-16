import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import { StyleSheet, View } from 'react-native';

import { StatCard } from '@/components/atoms/StatCard';
import { colors, spacing } from '@/quarks';

type TeamStatsProps = {
  totalCollaborators: number;
  activeCollaborators: number;
};

function padCount(value: number): string {
  return String(value).padStart(2, '0');
}

export function TeamStats({
  totalCollaborators,
  activeCollaborators,
}: TeamStatsProps) {
  return (
    <View style={styles.row}>
      <StatCard
        icon={
          <MaterialCommunityIcons
            color={colors.primary}
            name="account-group-outline"
            size={28}
          />
        }
        label="Total Colaboradores"
        value={padCount(totalCollaborators)}
      />
      <StatCard
        icon={
          <MaterialCommunityIcons
            color={colors.primary}
            name="shield-account-outline"
            size={28}
          />
        }
        label="Colaboradores Activos"
        value={padCount(activeCollaborators)}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    gap: spacing.sm,
  },
});
