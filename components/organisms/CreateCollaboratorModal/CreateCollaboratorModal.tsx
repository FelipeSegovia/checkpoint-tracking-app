import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import { useCallback, useEffect, useState } from 'react';
import {
  ActivityIndicator,
  KeyboardAvoidingView,
  Modal,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { createUser, getErrorMessage } from '@/api';
import { Button } from '@/components/atoms/Button';
import { FormField } from '@/components/molecules/FormField';
import { useAuth } from '@/contexts/auth-context';
import { borders, colors, spacing, typography } from '@/quarks';
import { formatRut, getRutError, isValidRut } from '@/utils/rut';

type CreateCollaboratorModalProps = {
  visible: boolean;
  onClose: () => void;
  onCreated: () => void;
};

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const BIRTHDATE_REGEX = /^\d{2}-\d{2}-\d{4}$/;

function isValidBirthdate(value: string): boolean {
  if (!BIRTHDATE_REGEX.test(value)) return false;

  const [day, month, year] = value.split('-').map(Number);
  const date = new Date(year, month - 1, day);

  return (
    date.getFullYear() === year &&
    date.getMonth() === month - 1 &&
    date.getDate() === day
  );
}

export function CreateCollaboratorModal({
  visible,
  onClose,
  onCreated,
}: CreateCollaboratorModalProps) {
  const { accessToken } = useAuth();
  const insets = useSafeAreaInsets();

  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [identityNumber, setIdentityNumber] = useState('');
  const [email, setEmail] = useState('');
  const [mobilePhone, setMobilePhone] = useState('');
  const [birthdate, setBirthdate] = useState('');
  const [password, setPassword] = useState('');

  const [firstNameError, setFirstNameError] = useState<string | undefined>();
  const [lastNameError, setLastNameError] = useState<string | undefined>();
  const [identityNumberError, setIdentityNumberError] = useState<
    string | undefined
  >();
  const [emailError, setEmailError] = useState<string | undefined>();
  const [mobilePhoneError, setMobilePhoneError] = useState<
    string | undefined
  >();
  const [birthdateError, setBirthdateError] = useState<string | undefined>();
  const [passwordError, setPasswordError] = useState<string | undefined>();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | undefined>();

  const resetFields = useCallback(() => {
    setFirstName('');
    setLastName('');
    setIdentityNumber('');
    setEmail('');
    setMobilePhone('');
    setBirthdate('');
    setPassword('');
    setFirstNameError(undefined);
    setLastNameError(undefined);
    setIdentityNumberError(undefined);
    setEmailError(undefined);
    setMobilePhoneError(undefined);
    setBirthdateError(undefined);
    setPasswordError(undefined);
    setSubmitError(undefined);
    setIsSubmitting(false);
  }, []);

  useEffect(() => {
    if (visible) {
      resetFields();
    }
  }, [visible, resetFields]);

  const resetAndClose = useCallback(() => {
    resetFields();
    onClose();
  }, [onClose, resetFields]);

  const handleClose = useCallback(() => {
    if (isSubmitting) return;
    resetAndClose();
  }, [isSubmitting, resetAndClose]);

  const handleCreate = useCallback(async () => {
    const trimmedFirstName = firstName.trim();
    const trimmedLastName = lastName.trim();
    const trimmedEmail = email.trim().toLowerCase();
    const trimmedPhone = mobilePhone.trim();
    const trimmedBirthdate = birthdate.trim();
    let hasError = false;

    if (!trimmedFirstName) {
      setFirstNameError('El nombre es obligatorio');
      hasError = true;
    }
    if (!trimmedLastName) {
      setLastNameError('El apellido es obligatorio');
      hasError = true;
    }

    const rutError = getRutError(identityNumber);
    if (!identityNumber.trim()) {
      setIdentityNumberError('El RUT es obligatorio');
      hasError = true;
    } else if (rutError || !isValidRut(identityNumber)) {
      setIdentityNumberError(rutError ?? 'RUT inválido');
      hasError = true;
    }

    if (!trimmedEmail) {
      setEmailError('El correo es obligatorio');
      hasError = true;
    } else if (!EMAIL_REGEX.test(trimmedEmail)) {
      setEmailError('Correo inválido');
      hasError = true;
    }

    if (!trimmedPhone) {
      setMobilePhoneError('El teléfono es obligatorio');
      hasError = true;
    } else if (!/^\d{1,9}$/.test(trimmedPhone)) {
      setMobilePhoneError('Solo dígitos, máximo 9');
      hasError = true;
    }

    if (!trimmedBirthdate) {
      setBirthdateError('La fecha de nacimiento es obligatoria');
      hasError = true;
    } else if (!isValidBirthdate(trimmedBirthdate)) {
      setBirthdateError('Formato inválido (dd-mm-YYYY)');
      hasError = true;
    }

    if (!password) {
      setPasswordError('La contraseña es obligatoria');
      hasError = true;
    } else if (password.length < 8) {
      setPasswordError('Mínimo 8 caracteres');
      hasError = true;
    }

    if (hasError) return;

    if (!accessToken) {
      setSubmitError('Sesión no válida. Vuelve a iniciar sesión.');
      return;
    }

    setFirstNameError(undefined);
    setLastNameError(undefined);
    setIdentityNumberError(undefined);
    setEmailError(undefined);
    setMobilePhoneError(undefined);
    setBirthdateError(undefined);
    setPasswordError(undefined);
    setSubmitError(undefined);
    setIsSubmitting(true);

    try {
      await createUser(
        {
          firstName: trimmedFirstName,
          lastName: trimmedLastName,
          birthdate: trimmedBirthdate,
          identityNumber,
          mobilePhone: trimmedPhone,
          email: trimmedEmail,
          password,
          role: 'colaborador',
        },
        { token: accessToken },
      );
      resetAndClose();
      onCreated();
    } catch (error) {
      setSubmitError(getErrorMessage(error));
    } finally {
      setIsSubmitting(false);
    }
  }, [
    accessToken,
    birthdate,
    email,
    firstName,
    identityNumber,
    lastName,
    mobilePhone,
    onCreated,
    password,
    resetAndClose,
  ]);

  const canCreate =
    firstName.trim().length > 0 &&
    lastName.trim().length > 0 &&
    identityNumber.trim().length > 0 &&
    email.trim().length > 0 &&
    mobilePhone.trim().length > 0 &&
    birthdate.trim().length > 0 &&
    password.length >= 8 &&
    !isSubmitting;

  return (
    <Modal
      animationType="slide"
      onRequestClose={handleClose}
      presentationStyle="formSheet"
      visible={visible}
    >
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        style={[
          styles.screen,
          {
            paddingBottom: Math.max(insets.bottom, spacing.md),
            paddingTop: spacing.lg,
          },
        ]}
      >
        <View style={styles.header}>
          <Text style={styles.title}>Nuevo Colaborador</Text>
          <Pressable
            accessibilityLabel="Cerrar"
            accessibilityRole="button"
            disabled={isSubmitting}
            hitSlop={8}
            onPress={handleClose}
          >
            <MaterialCommunityIcons
              color={colors.textSecondary}
              name="close"
              size={24}
            />
          </Pressable>
        </View>

        <ScrollView
          contentContainerStyle={styles.formContent}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
          <FormField
            autoCapitalize="words"
            autoCorrect={false}
            editable={!isSubmitting}
            error={firstNameError}
            label="Nombre"
            onChangeText={(value) => {
              setFirstName(value);
              if (firstNameError) setFirstNameError(undefined);
            }}
            placeholder="Ej: Juan"
            returnKeyType="next"
            value={firstName}
          />

          <FormField
            autoCapitalize="words"
            autoCorrect={false}
            editable={!isSubmitting}
            error={lastNameError}
            label="Apellido"
            onChangeText={(value) => {
              setLastName(value);
              if (lastNameError) setLastNameError(undefined);
            }}
            placeholder="Ej: Pérez"
            returnKeyType="next"
            value={lastName}
          />

          <FormField
            autoCapitalize="characters"
            autoCorrect={false}
            editable={!isSubmitting}
            error={identityNumberError}
            label="RUT"
            onChangeText={(value) => {
              setIdentityNumber(formatRut(value));
              if (identityNumberError) setIdentityNumberError(undefined);
            }}
            placeholder="12.345.678-9"
            returnKeyType="next"
            value={identityNumber}
          />

          <FormField
            autoCapitalize="none"
            autoCorrect={false}
            editable={!isSubmitting}
            error={emailError}
            keyboardType="email-address"
            label="Correo"
            onChangeText={(value) => {
              setEmail(value);
              if (emailError) setEmailError(undefined);
            }}
            placeholder="colaborador@empresa.cl"
            returnKeyType="next"
            value={email}
          />

          <FormField
            editable={!isSubmitting}
            error={mobilePhoneError}
            keyboardType="phone-pad"
            label="Teléfono"
            maxLength={9}
            onChangeText={(value) => {
              setMobilePhone(value.replace(/\D/g, '').slice(0, 9));
              if (mobilePhoneError) setMobilePhoneError(undefined);
            }}
            placeholder="912345678"
            returnKeyType="next"
            value={mobilePhone}
          />

          <FormField
            editable={!isSubmitting}
            error={birthdateError}
            keyboardType="numbers-and-punctuation"
            label="Fecha de nacimiento"
            onChangeText={(value) => {
              setBirthdate(value);
              if (birthdateError) setBirthdateError(undefined);
            }}
            placeholder="dd-mm-YYYY"
            returnKeyType="next"
            value={birthdate}
          />

          <FormField
            editable={!isSubmitting}
            error={passwordError}
            label="Contraseña"
            onChangeText={(value) => {
              setPassword(value);
              if (passwordError) setPasswordError(undefined);
            }}
            placeholder="Mínimo 8 caracteres"
            returnKeyType="done"
            secureTextEntry
            value={password}
          />

          {submitError ? (
            <Text style={styles.submitError}>{submitError}</Text>
          ) : null}

          <View style={styles.actions}>
            <Pressable
              accessibilityRole="button"
              disabled={isSubmitting}
              onPress={handleClose}
              style={({ pressed }) => [
                styles.cancelButton,
                pressed ? styles.pressed : null,
              ]}
            >
              <Text style={styles.cancelText}>Cancelar</Text>
            </Pressable>

            <Button
              disabled={!canCreate}
              onPress={() => {
                void handleCreate();
              }}
              style={styles.submitButton}
            >
              {isSubmitting ? (
                <ActivityIndicator color={colors.textOnPrimary} />
              ) : (
                <>
                  <Button.Icon>
                    <MaterialCommunityIcons
                      color={colors.textOnPrimary}
                      name="plus"
                      size={18}
                    />
                  </Button.Icon>
                  <Button.Text>Crear</Button.Text>
                </>
              )}
            </Button>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </Modal>
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
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  title: {
    color: colors.text,
    fontSize: typography.fontSize.xl,
    fontWeight: typography.fontWeight.bold,
  },
  formContent: {
    gap: spacing.md,
    paddingBottom: spacing.xl,
  },
  submitError: {
    color: colors.error,
    fontSize: typography.fontSize.sm,
    textAlign: 'center',
  },
  actions: {
    flexDirection: 'row',
    gap: spacing.sm,
  },
  cancelButton: {
    alignItems: 'center',
    borderColor: colors.surfaceBorder,
    borderCurve: 'continuous',
    borderRadius: borders.radius.md,
    borderWidth: borders.width.thin,
    flex: 1,
    justifyContent: 'center',
    paddingVertical: spacing.sm + 2,
  },
  cancelText: {
    color: colors.text,
    fontSize: typography.fontSize.base,
    fontWeight: typography.fontWeight.semibold,
  },
  submitButton: {
    flex: 1,
  },
  pressed: {
    opacity: 0.88,
    transform: [{ scale: 0.98 }],
  },
});
