import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
  KeyboardAvoidingView,
  Platform,
  SafeAreaView,
  ActivityIndicator,
  ScrollView,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { useAuth } from '../store/AuthContext';
import { useNavigation } from '@react-navigation/native';

export default function RegisterScreen() {
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [acceptTerms, setAcceptTerms] = useState(false);

  const { register, state } = useAuth();
  const navigation = useNavigation();

  const validateForm = () => {
    if (!firstName.trim()) {
      Alert.alert('Error', 'Please enter your first name');
      return false;
    }
    if (!lastName.trim()) {
      Alert.alert('Error', 'Please enter your last name');
      return false;
    }
    if (!email.trim()) {
      Alert.alert('Error', 'Please enter your email');
      return false;
    }
    if (!email.includes('@') || !email.includes('.')) {
      Alert.alert('Error', 'Please enter a valid email address');
      return false;
    }
    if (password.length < 8) {
      Alert.alert('Error', 'Password must be at least 8 characters long');
      return false;
    }
    if (password !== confirmPassword) {
      Alert.alert('Error', 'Passwords do not match');
      return false;
    }
    if (!acceptTerms) {
      Alert.alert('Error', 'Please accept the terms and conditions');
      return false;
    }
    return true;
  };

  const handleRegister = async () => {
    if (!validateForm()) return;

    setIsLoading(true);
    const success = await register({
      firstName: firstName.trim(),
      lastName: lastName.trim(),
      email: email.trim().toLowerCase(),
      password,
    });
    setIsLoading(false);

    if (!success) {
      Alert.alert('Registration Failed', 'Unable to create account. Please try again.');
    }
  };

  const navigateToLogin = () => {
    navigation.navigate('Login' as never);
  };

  return (
    <SafeAreaView style={styles.container}>
      <LinearGradient
        colors={['#1a1a2e', '#16213e', '#0f3460']}
        style={styles.gradient}
      >
        <KeyboardAvoidingView
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
          style={styles.keyboardView}
        >
          <ScrollView
            contentContainerStyle={styles.scrollContent}
            showsVerticalScrollIndicator={false}
          >
            <View style={styles.content}>
              {/* Header */}
              <View style={styles.header}>
                <TouchableOpacity
                  style={styles.backButton}
                  onPress={navigateToLogin}
                >
                  <Ionicons name="arrow-back" size={24} color="#ffffff" />
                </TouchableOpacity>
                <View style={styles.logoContainer}>
                  <Ionicons name="trending-up" size={50} color="#00d4aa" />
                </View>
                <Text style={styles.title}>Create Account</Text>
                <Text style={styles.subtitle}>Join thousands of smart traders</Text>
              </View>

              {/* Registration Form */}
              <View style={styles.form}>
                <View style={styles.nameRow}>
                  <View style={[styles.inputContainer, styles.halfWidth]}>
                    <Ionicons name="person-outline" size={20} color="#8e8e93" style={styles.inputIcon} />
                    <TextInput
                      style={styles.input}
                      placeholder="First Name"
                      placeholderTextColor="#8e8e93"
                      value={firstName}
                      onChangeText={setFirstName}
                      autoCapitalize="words"
                      autoComplete="given-name"
                    />
                  </View>
                  <View style={[styles.inputContainer, styles.halfWidth]}>
                    <Ionicons name="person-outline" size={20} color="#8e8e93" style={styles.inputIcon} />
                    <TextInput
                      style={styles.input}
                      placeholder="Last Name"
                      placeholderTextColor="#8e8e93"
                      value={lastName}
                      onChangeText={setLastName}
                      autoCapitalize="words"
                      autoComplete="family-name"
                    />
                  </View>
                </View>

                <View style={styles.inputContainer}>
                  <Ionicons name="mail-outline" size={20} color="#8e8e93" style={styles.inputIcon} />
                  <TextInput
                    style={styles.input}
                    placeholder="Email"
                    placeholderTextColor="#8e8e93"
                    value={email}
                    onChangeText={setEmail}
                    keyboardType="email-address"
                    autoCapitalize="none"
                    autoComplete="email"
                  />
                </View>

                <View style={styles.inputContainer}>
                  <Ionicons name="lock-closed-outline" size={20} color="#8e8e93" style={styles.inputIcon} />
                  <TextInput
                    style={styles.input}
                    placeholder="Password"
                    placeholderTextColor="#8e8e93"
                    value={password}
                    onChangeText={setPassword}
                    secureTextEntry={!showPassword}
                    autoComplete="new-password"
                  />
                  <TouchableOpacity
                    onPress={() => setShowPassword(!showPassword)}
                    style={styles.eyeIcon}
                  >
                    <Ionicons
                      name={showPassword ? "eye-outline" : "eye-off-outline"}
                      size={20}
                      color="#8e8e93"
                    />
                  </TouchableOpacity>
                </View>

                <View style={styles.inputContainer}>
                  <Ionicons name="lock-closed-outline" size={20} color="#8e8e93" style={styles.inputIcon} />
                  <TextInput
                    style={styles.input}
                    placeholder="Confirm Password"
                    placeholderTextColor="#8e8e93"
                    value={confirmPassword}
                    onChangeText={setConfirmPassword}
                    secureTextEntry={!showConfirmPassword}
                    autoComplete="new-password"
                  />
                  <TouchableOpacity
                    onPress={() => setShowConfirmPassword(!showConfirmPassword)}
                    style={styles.eyeIcon}
                  >
                    <Ionicons
                      name={showConfirmPassword ? "eye-outline" : "eye-off-outline"}
                      size={20}
                      color="#8e8e93"
                    />
                  </TouchableOpacity>
                </View>

                {/* Password Requirements */}
                <View style={styles.passwordRequirements}>
                  <Text style={styles.requirementsTitle}>Password must contain:</Text>
                  <View style={styles.requirement}>
                    <Ionicons
                      name={password.length >= 8 ? "checkmark-circle" : "ellipse-outline"}
                      size={16}
                      color={password.length >= 8 ? "#00d4aa" : "#8e8e93"}
                    />
                    <Text style={[styles.requirementText, password.length >= 8 && styles.requirementMet]}>
                      At least 8 characters
                    </Text>
                  </View>
                  <View style={styles.requirement}>
                    <Ionicons
                      name={/[A-Z]/.test(password) ? "checkmark-circle" : "ellipse-outline"}
                      size={16}
                      color={/[A-Z]/.test(password) ? "#00d4aa" : "#8e8e93"}
                    />
                    <Text style={[styles.requirementText, /[A-Z]/.test(password) && styles.requirementMet]}>
                      One uppercase letter
                    </Text>
                  </View>
                  <View style={styles.requirement}>
                    <Ionicons
                      name={/[0-9]/.test(password) ? "checkmark-circle" : "ellipse-outline"}
                      size={16}
                      color={/[0-9]/.test(password) ? "#00d4aa" : "#8e8e93"}
                    />
                    <Text style={[styles.requirementText, /[0-9]/.test(password) && styles.requirementMet]}>
                      One number
                    </Text>
                  </View>
                </View>

                {/* Terms and Conditions */}
                <TouchableOpacity
                  style={styles.termsContainer}
                  onPress={() => setAcceptTerms(!acceptTerms)}
                >
                  <Ionicons
                    name={acceptTerms ? "checkbox" : "square-outline"}
                    size={20}
                    color={acceptTerms ? "#00d4aa" : "#8e8e93"}
                  />
                  <Text style={styles.termsText}>
                    I agree to the{' '}
                    <Text style={styles.termsLink}>Terms of Service</Text> and{' '}
                    <Text style={styles.termsLink}>Privacy Policy</Text>
                  </Text>
                </TouchableOpacity>

                <TouchableOpacity
                  style={[styles.registerButton, isLoading && styles.registerButtonDisabled]}
                  onPress={handleRegister}
                  disabled={isLoading || state.loading}
                >
                  {isLoading || state.loading ? (
                    <ActivityIndicator color="#ffffff" />
                  ) : (
                    <Text style={styles.registerButtonText}>Create Account</Text>
                  )}
                </TouchableOpacity>
              </View>

              {/* Login Link */}
              <View style={styles.loginContainer}>
                <Text style={styles.loginText}>Already have an account? </Text>
                <TouchableOpacity onPress={navigateToLogin}>
                  <Text style={styles.loginLink}>Sign In</Text>
                </TouchableOpacity>
              </View>
            </View>
          </ScrollView>
        </KeyboardAvoidingView>
      </LinearGradient>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  gradient: {
    flex: 1,
  },
  keyboardView: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    paddingHorizontal: 30,
    paddingVertical: 40,
  },
  header: {
    alignItems: 'center',
    marginBottom: 30,
  },
  backButton: {
    position: 'absolute',
    top: 0,
    left: 0,
    padding: 8,
  },
  logoContainer: {
    backgroundColor: 'rgba(0, 212, 170, 0.1)',
    borderRadius: 40,
    padding: 15,
    marginBottom: 16,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#ffffff',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: '#8e8e93',
    textAlign: 'center',
  },
  form: {
    width: '100%',
  },
  nameRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderRadius: 12,
    marginBottom: 16,
    paddingHorizontal: 16,
    height: 56,
  },
  halfWidth: {
    width: '48%',
  },
  inputIcon: {
    marginRight: 12,
  },
  input: {
    flex: 1,
    color: '#ffffff',
    fontSize: 16,
    height: '100%',
  },
  eyeIcon: {
    padding: 4,
  },
  passwordRequirements: {
    marginBottom: 20,
  },
  requirementsTitle: {
    color: '#8e8e93',
    fontSize: 14,
    marginBottom: 8,
  },
  requirement: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 4,
  },
  requirementText: {
    color: '#8e8e93',
    fontSize: 12,
    marginLeft: 8,
  },
  requirementMet: {
    color: '#00d4aa',
  },
  termsContainer: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 24,
  },
  termsText: {
    color: '#8e8e93',
    fontSize: 14,
    marginLeft: 12,
    flex: 1,
    lineHeight: 20,
  },
  termsLink: {
    color: '#00d4aa',
    textDecorationLine: 'underline',
  },
  registerButton: {
    backgroundColor: '#00d4aa',
    borderRadius: 12,
    height: 56,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 20,
  },
  registerButtonDisabled: {
    backgroundColor: 'rgba(0, 212, 170, 0.5)',
  },
  registerButtonText: {
    color: '#ffffff',
    fontSize: 18,
    fontWeight: '600',
  },
  loginContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: 20,
  },
  loginText: {
    color: '#8e8e93',
    fontSize: 16,
  },
  loginLink: {
    color: '#00d4aa',
    fontSize: 16,
    fontWeight: '600',
  },
});