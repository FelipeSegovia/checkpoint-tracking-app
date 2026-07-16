import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import { StyleSheet, View } from 'react-native';

import { StatCard } from '@/components/atoms/StatCard';
import { colors, spacing } from '@/quarks';

type EstablishmentStatsProps = {
  totalEstablishments: number;
  activeCheckpoints: number;
  guardsOnDuty: number;
};

function padCount(value: number): string {
  return String(value).padStart(2, '0');
}

export function EstablishmentStats({
  totalEstablishments,
  activeCheckpoints,
  guardsOnDuty,
}: EstablishmentStatsProps) {
  return (
    <View style={styles.row}>
      <StatCard
        icon={
          <MaterialCommunityIcons
            color={colors.primary}
            name="storefront-outline"
            size={28}
          />
        }
        label="Total Establecimientos"
        value={padCount(totalEstablishments)}
      />
      <StatCard
        icon={
          <MaterialCommunityIcons
            color={colors.primary}
            name="map-marker-radius-outline"
            size={28}
          />
        }
        label="Checkpoints Activos"
        value={padCount(activeCheckpoints)}
      />
      <StatCard
        icon={
          <MaterialCommunityIcons
            color={colors.primary}
            name="shield-account-outline"
            size={28}
          />
        }
        label="Guardias en Turno"
        value={padCount(guardsOnDuty)}
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
