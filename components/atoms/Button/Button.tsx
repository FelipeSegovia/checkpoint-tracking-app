import { Pressable, StyleSheet, Text, View, type PressableProps } from 'react-native';

import { borders, colors, spacing, typography } from '@/quarks';

type ButtonProps = PressableProps & {
  children: React.ReactNode;
};

function ButtonRoot({ children, style, disabled, ...props }: ButtonProps) {
  return (
    <Pressable
      accessibilityRole="button"
      disabled={disabled}
      style={(state) => [
        styles.button,
        state.pressed ? styles.pressed : null,
        disabled ? styles.disabled : null,
        typeof style === 'function' ? style(state) : style,
      ]}
      {...props}
    >
      <View style={styles.content}>{children}</View>
    </Pressable>
  );
}

function ButtonText({ children }: { children: string }) {
  return <Text style={styles.text}>{children}</Text>;
}

function ButtonIcon({ children }: { children: React.ReactNode }) {
  return <View style={styles.icon}>{children}</View>;
}

export const Button = Object.assign(ButtonRoot, {
  Text: ButtonText,
  Icon: ButtonIcon,
});

const styles = StyleSheet.create({
  button: {
    backgroundColor: colors.primary,
    borderCurve: 'continuous',
    borderRadius: borders.radius.md,
    boxShadow: `0 0 10px ${colors.glow}`,
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.sm + 2,
  },
  pressed: {
    opacity: 0.88,
    transform: [{ scale: 0.98 }],
  },
  disabled: {
    opacity: 0.5,
  },
  content: {
    alignItems: 'center',
    flexDirection: 'row',
    gap: spacing.xs,
    justifyContent: 'center',
  },
  text: {
    color: colors.textOnPrimary,
    fontSize: typography.fontSize.base,
    fontWeight: typography.fontWeight.bold,
  },
  icon: {
    alignItems: 'center',
    justifyContent: 'center',
  },
});
