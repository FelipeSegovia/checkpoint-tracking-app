import { Redirect, useRouter } from 'expo-router';
import { useState } from 'react';
import { ActivityIndicator, KeyboardAvoidingView, Platform, StyleSheet, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { getErrorMessage } from '@/api/errors';
import { DotGrid } from '@/components/atoms/DotGrid';
import { LoginFooter } from '@/components/organisms/LoginFooter';
import { LoginForm } from '@/components/organisms/LoginForm';
import { LoginHeader } from '@/components/organisms/LoginHeader';
import { useAuth } from '@/contexts/auth-context';
import { colors, spacing } from '@/quarks';

export function LoginPage() {
  const { replace } = useRouter();
  const { signIn, isAuthenticated, isLoading: isAuthLoading } = useAuth();
  const insets = useSafeAreaInsets();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | undefined>();

  if (isAuthLoading) {
    return (
      <View style={[styles.screen, styles.centered]}>
        <ActivityIndicator color={colors.primary} size="large" />
      </View>
    );
  }

  if (isAuthenticated) {
    return <Redirect href="/(tabs)" />;
  }

  const handleSubmit = async ({
    rut,
    password,
  }: {
    rut: string;
    password: string;
  }) => {
    setErrorMessage(undefined);
    setIsSubmitting(true);

    try {
      await signIn({ identityNumber: rut, password });
      replace('/(tabs)');
    } catch (error) {
      setErrorMessage(getErrorMessage(error));
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <View style={styles.screen}>
      <DotGrid />
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        style={styles.flex}
      >
        <View
          style={[
            styles.content,
            {
              paddingTop: Math.max(insets.top, spacing.md),
              paddingBottom: Math.max(insets.bottom, spacing.md),
            },
          ]}
        >
          <View style={styles.main}>
            <LoginHeader />
            <LoginForm
              errorMessage={errorMessage}
              isSubmitting={isSubmitting}
              onSubmit={handleSubmit}
            />
          </View>
          <LoginFooter />
        </View>
      </KeyboardAvoidingView>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: {
    backgroundColor: colors.background,
    flex: 1,
  },
  centered: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  flex: {
    flex: 1,
  },
  content: {
    flex: 1,
    paddingHorizontal: spacing.lg,
  },
  main: {
    flex: 1,
    gap: spacing.md,
    justifyContent: 'center',
  },
});
