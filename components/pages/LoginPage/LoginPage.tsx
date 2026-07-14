import { useRouter } from 'expo-router';
import { KeyboardAvoidingView, Platform, StyleSheet, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { DotGrid } from '@/components/atoms/DotGrid';
import { LoginFooter } from '@/components/organisms/LoginFooter';
import { LoginForm } from '@/components/organisms/LoginForm';
import { LoginHeader } from '@/components/organisms/LoginHeader';
import { colors, spacing } from '@/quarks';

export function LoginPage() {
  const { replace } = useRouter();
  const insets = useSafeAreaInsets();

  const handleSubmit = () => {
    replace('/(tabs)');
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
            <LoginForm onSubmit={handleSubmit} />
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
