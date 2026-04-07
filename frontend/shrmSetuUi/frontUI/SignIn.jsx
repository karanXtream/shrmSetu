import React, { useEffect, useMemo, useState } from 'react';
import {
  ActivityIndicator,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { useLogin } from '@/hooks/useAuthMutations';
import { useAuth } from '@/providers/RootProvider';

const resolveDashboardPath = (role) => {
  const normalizedRole = String(role || '').toLowerCase();
  if (normalizedRole === 'worker' || normalizedRole === 'work') {
    return '/(tabs)';
  }
  return '/screens/user-hire';
};

const extractMessage = (error) => {
  const fallback = 'Unable to sign in. Please check your details and try again.';
  if (!error) return fallback;

  if (typeof error === 'string') {
    return error;
  }

  if (typeof error?.message === 'string' && error.message.trim()) {
    return error.message;
  }

  if (typeof error?.data?.message === 'string' && error.data.message.trim()) {
    return error.data.message;
  }

  return fallback;
};

export default function SignIn() {
  const router = useRouter();
  const loginMutation = useLogin();
  const { user, isSignedIn, isLoading } = useAuth();

  const [identifier, setIdentifier] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [localError, setLocalError] = useState('');

  const activeError = useMemo(() => {
    if (localError) {
      return localError;
    }

    if (loginMutation.error) {
      return extractMessage(loginMutation.error);
    }

    return '';
  }, [localError, loginMutation.error]);

  useEffect(() => {
    if (!isLoading && isSignedIn) {
      router.replace(resolveDashboardPath(user?.role));
    }
  }, [isLoading, isSignedIn, user, router]);

  const handleSignIn = async () => {
    const trimmedIdentifier = identifier.trim();

    if (!trimmedIdentifier) {
      setLocalError('Enter email or phone number.');
      return;
    }

    if (!password) {
      setLocalError('Enter password.');
      return;
    }

    setLocalError('');

    try {
      const response = await loginMutation.mutateAsync({
        identifier: trimmedIdentifier,
        password,
      });

      if (!response?.success) {
        throw new Error(response?.message || 'Login failed');
      }

      const role = response?.data?.role || user?.role;
      router.replace(resolveDashboardPath(role));
    } catch (error) {
      setLocalError(extractMessage(error));
    }
  };

  const handleNewUser = () => {
    router.push('/screens/language-selection');
  };

  if (isLoading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#003f87" />
        <Text style={styles.loadingText}>Checking your session...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.headerWrap}>
        <Text style={styles.title}>Sign In</Text>
        <Text style={styles.subtitle}>Welcome back to ShramSetu</Text>
      </View>

      <View style={styles.formCard}>
        <Text style={styles.label}>Email or Phone</Text>
        <View style={styles.inputWrap}>
          <Ionicons name="person-outline" size={18} color="#6b7280" />
          <TextInput
            style={styles.input}
            value={identifier}
            onChangeText={setIdentifier}
            autoCapitalize="none"
            keyboardType="email-address"
            placeholder="Enter email or phone"
            placeholderTextColor="#9ca3af"
          />
        </View>

        <Text style={styles.label}>Password</Text>
        <View style={styles.inputWrap}>
          <Ionicons name="lock-closed-outline" size={18} color="#6b7280" />
          <TextInput
            style={styles.input}
            value={password}
            onChangeText={setPassword}
            secureTextEntry={!showPassword}
            placeholder="Enter password"
            placeholderTextColor="#9ca3af"
          />
          <TouchableOpacity onPress={() => setShowPassword((prev) => !prev)}>
            <Ionicons
              name={showPassword ? 'eye-outline' : 'eye-off-outline'}
              size={18}
              color="#6b7280"
            />
          </TouchableOpacity>
        </View>

        {activeError ? (
          <Text style={styles.errorText}>{activeError}</Text>
        ) : null}

        <TouchableOpacity
          style={[styles.signInButton, loginMutation.isPending && styles.signInButtonDisabled]}
          onPress={handleSignIn}
          disabled={loginMutation.isPending}
        >
          <LinearGradient
            colors={["#003f87", "#005bbf"]}
            style={styles.signInGradient}
          >
            {loginMutation.isPending ? (
              <>
                <ActivityIndicator size="small" color="#fff" />
                <Text style={styles.signInButtonText}>Signing in...</Text>
              </>
            ) : (
              <Text style={styles.signInButtonText}>Sign In</Text>
            )}
          </LinearGradient>
        </TouchableOpacity>

        <View style={styles.newUserRow}>
          <Text style={styles.newUserText}>New user?</Text>
          <TouchableOpacity onPress={handleNewUser}>
            <Text style={styles.newUserLink}> Start here</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f6f8fc',
    justifyContent: 'center',
    paddingHorizontal: 22,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f6f8fc',
  },
  loadingText: {
    marginTop: 10,
    color: '#334155',
    fontSize: 14,
    fontWeight: '500',
  },
  headerWrap: {
    marginBottom: 18,
  },
  title: {
    fontSize: 34,
    fontWeight: '800',
    color: '#0f172a',
  },
  subtitle: {
    marginTop: 6,
    color: '#475569',
    fontSize: 15,
  },
  formCard: {
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 18,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.08,
    shadowRadius: 12,
    elevation: 6,
  },
  label: {
    fontSize: 14,
    color: '#0f172a',
    fontWeight: '600',
    marginTop: 8,
    marginBottom: 8,
  },
  inputWrap: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    borderWidth: 1.5,
    borderColor: '#dbe3ef',
    borderRadius: 12,
    paddingHorizontal: 12,
    paddingVertical: 10,
    backgroundColor: '#f8fafc',
  },
  input: {
    flex: 1,
    color: '#0f172a',
    fontSize: 15,
    paddingVertical: 2,
  },
  errorText: {
    marginTop: 10,
    color: '#dc2626',
    fontSize: 13,
    fontWeight: '500',
  },
  signInButton: {
    marginTop: 16,
    borderRadius: 12,
    overflow: 'hidden',
  },
  signInButtonDisabled: {
    opacity: 0.65,
  },
  signInGradient: {
    minHeight: 48,
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row',
    gap: 8,
  },
  signInButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '700',
  },
  newUserRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 16,
  },
  newUserText: {
    color: '#475569',
    fontSize: 14,
  },
  newUserLink: {
    color: '#003f87',
    fontSize: 14,
    fontWeight: '700',
  },
});
