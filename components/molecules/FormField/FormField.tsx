import { StyleSheet, Text, View, type TextInputProps } from 'react-native';

import { Label } from '@/components/atoms/Label';
import { TextInput } from '@/components/atoms/TextInput';
import { colors, spacing, typography } from '@/quarks';

type FormFieldProps = TextInputProps & {
  label: string;
  error?: string;
  rightAdornment?: React.ReactNode;
};

export function FormField({
  label,
  error,
  rightAdornment,
  ...inputProps
}: FormFieldProps) {
  return (
    <View style={styles.field}>
      <Label>{label}</Label>
      <TextInput
        rightAdornment={rightAdornment}
        style={error ? styles.inputError : undefined}
        {...inputProps}
      />
      {error ? <Text style={styles.error}>{error}</Text> : null}
    </View>
  );
}

const styles = StyleSheet.create({
  field: {
    gap: spacing.xs,
  },
  inputError: {
    borderColor: colors.error,
  },
  error: {
    color: colors.error,
    fontSize: typography.fontSize.sm,
  },
});
