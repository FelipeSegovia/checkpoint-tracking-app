import { StyleSheet, TextInput as RNTextInput, type TextInputProps, View } from 'react-native';

import { borders, colors, spacing, typography } from '@/quarks';

type TextInputFieldProps = TextInputProps & {
  rightAdornment?: React.ReactNode;
};

export function TextInput({ rightAdornment, style, ...props }: TextInputFieldProps) {
  return (
    <View style={styles.container}>
      <RNTextInput
        placeholderTextColor={colors.inputPlaceholder}
        selectionColor={colors.primary}
        style={[styles.input, rightAdornment ? styles.inputWithAdornment : null, style]}
        {...props}
      />
      {rightAdornment ? <View style={styles.adornment}>{rightAdornment}</View> : null}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    position: 'relative',
    justifyContent: 'center',
  },
  input: {
    backgroundColor: colors.inputBackground,
    borderColor: colors.inputBorder,
    borderCurve: 'continuous',
    borderRadius: borders.radius.md,
    borderStyle: 'dashed',
    borderWidth: borders.width.thin,
    color: colors.text,
    fontSize: typography.fontSize.base,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm + 2,
  },
  inputWithAdornment: {
    paddingRight: spacing.xxxl,
  },
  adornment: {
    position: 'absolute',
    right: spacing.md,
  },
});
