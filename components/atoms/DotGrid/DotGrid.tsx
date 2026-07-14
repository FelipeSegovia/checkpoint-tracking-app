import { Dimensions, StyleSheet, View } from 'react-native';

import { colors } from '@/quarks';

const DOT_SIZE = 1.5;
const GAP = 20;
const { width, height } = Dimensions.get('window');
const COLS = Math.ceil(width / GAP) + 1;
const ROWS = Math.ceil(height / GAP) + 1;

const DOTS = Array.from({ length: COLS * ROWS }, (_, index) => ({
  key: index,
  left: (index % COLS) * GAP,
  top: Math.floor(index / COLS) * GAP,
}));

export function DotGrid() {
  return (
    <View pointerEvents="none" style={StyleSheet.absoluteFill}>
      {DOTS.map((dot) => (
        <View
          key={dot.key}
          style={[styles.dot, { left: dot.left, top: dot.top }]}
        />
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  dot: {
    backgroundColor: colors.textMuted,
    borderRadius: DOT_SIZE,
    height: DOT_SIZE,
    opacity: 0.4,
    position: 'absolute',
    width: DOT_SIZE,
  },
});
