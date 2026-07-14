import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import { StyleSheet, View } from 'react-native';

import { borders, colors } from '@/quarks';

export function LogoMark() {
  return (
    <View style={styles.glow}>
      <View style={styles.mark}>
        <MaterialCommunityIcons name="shield" size={28} color={colors.textOnPrimary} />

      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  glow: {
    alignItems: 'center',
    boxShadow: `0 0 14px ${colors.glow}`,
    justifyContent: 'center',
  },
  mark: {
    alignItems: 'center',
    backgroundColor: colors.primary,
    borderCurve: 'continuous',
    borderRadius: borders.radius.lg,
    height: 56,
    justifyContent: 'center',
    width: 56,
  },
});
