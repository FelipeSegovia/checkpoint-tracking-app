import Ionicons from '@expo/vector-icons/Ionicons';
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import { useState } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';

import { Button } from '@/components/atoms/Button';
import { FormField } from '@/components/molecules/FormField';
import { borders, colors, spacing, typography } from '@/quarks';
import { formatRut, getRutError, isValidRut } from '@/utils/rut';

type LoginFormProps = {
  onSubmit?: (credentials: { rut: string; password: string }) => void;
  onForgotPassword?: () => void;
};

export function LoginForm({ onSubmit, onForgotPassword }: LoginFormProps) {
  const [rut, setRut] = useState('');
  const [password, setPassword] = useState('');
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);
  const [rutTouched, setRutTouched] = useState(false);

  const rutError = rutTouched ? getRutError(rut) : undefined;
  const canSubmit = isValidRut(rut) && password.length > 0;

  const handleRutChange = (value: string) => {
    setRut(formatRut(value));
  };

  const handleSubmit = () => {
    setRutTouched(true);
    if (!canSubmit) return;
    onSubmit?.({ rut, password });
  };

  const togglePasswordVisibility = () => {
    setIsPasswordVisible((prev) => !prev);
  };

  return (
    <View style={styles.card}>
      <View style={styles.fields}>
        <FormField
          autoCapitalize="characters"
          autoCorrect={false}
          error={rutError}
          keyboardType="default"
          label="Rut de colaborador"
          maxLength={12}
          onBlur={() => setRutTouched(true)}
          onChangeText={handleRutChange}
          placeholder="12.345.678-9"
          returnKeyType="next"
          value={rut}
        />
        <FormField
          autoCapitalize="none"
          autoCorrect={false}
          label="Contraseña"
          onChangeText={setPassword}
          onSubmitEditing={handleSubmit}
          placeholder="••••••••"
          returnKeyType="go"
          rightAdornment={
            <Pressable
              accessibilityLabel={
                isPasswordVisible ? 'Ocultar contraseña' : 'Mostrar contraseña'
              }
              accessibilityRole="button"
              hitSlop={8}
              onPress={togglePasswordVisibility}
            >
              <Ionicons
                color={colors.textMuted}
                name={isPasswordVisible ? 'eye-off-outline' : 'eye-outline'}
                size={20}
              />
            </Pressable>
          }
          secureTextEntry={!isPasswordVisible}
          value={password}
        />
      </View>

      <Button disabled={!canSubmit} onPress={handleSubmit}>
        <Button.Text>Iniciar Sesión</Button.Text>
        <Button.Icon>
          <MaterialCommunityIcons
            name="login"
            size={20}
            color={colors.textOnPrimary}
          />
        </Button.Icon>
      </Button>

      <Pressable accessibilityRole="link" onPress={onForgotPassword}>
        <Text style={styles.forgotPassword}>¿Olvidaste tu contraseña?</Text>
      </Pressable>

      <View style={styles.divider}>
        <View style={styles.dividerLine} />
        <Text style={styles.dividerText}>Acceso restringido</Text>
        <View style={styles.dividerLine} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: colors.surface,
    borderColor: colors.surfaceBorder,
    borderCurve: 'continuous',
    borderRadius: borders.radius.xl,
    borderStyle: 'dashed',
    borderWidth: borders.width.thin,
    gap: spacing.md,
    padding: spacing.md,
  },
  fields: {
    gap: spacing.sm,
  },
  forgotPassword: {
    color: colors.link,
    fontSize: typography.fontSize.md,
    textAlign: 'center',
  },
  divider: {
    alignItems: 'center',
    flexDirection: 'row',
    gap: spacing.sm,
  },
  dividerLine: {
    backgroundColor: colors.surfaceBorder,
    flex: 1,
    height: StyleSheet.hairlineWidth,
  },
  dividerText: {
    color: colors.textMuted,
    fontSize: typography.fontSize.xs,
    fontWeight: typography.fontWeight.medium,
    letterSpacing: typography.letterSpacing.wider,
    textTransform: 'uppercase',
  },
});
