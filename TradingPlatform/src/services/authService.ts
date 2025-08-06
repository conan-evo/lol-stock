import AsyncStorage from '@react-native-async-storage/async-storage';
import * as SecureStore from 'expo-secure-store';
import * as LocalAuthentication from 'expo-local-authentication';
import { User, AuthState, ApiResponse } from '../types';

const API_BASE_URL = 'https://api.tradingplatform.com'; // Replace with actual API URL
const TOKEN_KEY = 'auth_token';
const USER_KEY = 'user_data';
const BIOMETRIC_KEY = 'biometric_enabled';

class AuthService {
  private static instance: AuthService;
  
  public static getInstance(): AuthService {
    if (!AuthService.instance) {
      AuthService.instance = new AuthService();
    }
    return AuthService.instance;
  }

  // Mock API calls - replace with actual API endpoints
  async login(email: string, password: string): Promise<ApiResponse<{ user: User; token: string }>> {
    try {
      // Mock successful login for demo
      const mockUser: User = {
        id: '1',
        email,
        firstName: 'John',
        lastName: 'Doe',
        accountType: 'individual',
        kycStatus: 'approved',
        twoFactorEnabled: false,
        createdAt: new Date().toISOString(),
      };
      
      const token = 'mock_jwt_token_' + Date.now();
      
      // Store securely
      await SecureStore.setItemAsync(TOKEN_KEY, token);
      await AsyncStorage.setItem(USER_KEY, JSON.stringify(mockUser));
      
      return {
        success: true,
        data: { user: mockUser, token },
      };
    } catch (error) {
      return {
        success: false,
        data: { user: {} as User, token: '' },
        message: 'Login failed',
      };
    }
  }

  async register(userData: {
    email: string;
    password: string;
    firstName: string;
    lastName: string;
  }): Promise<ApiResponse<{ user: User; token: string }>> {
    try {
      // Mock successful registration
      const mockUser: User = {
        id: Date.now().toString(),
        email: userData.email,
        firstName: userData.firstName,
        lastName: userData.lastName,
        accountType: 'individual',
        kycStatus: 'pending',
        twoFactorEnabled: false,
        createdAt: new Date().toISOString(),
      };
      
      const token = 'mock_jwt_token_' + Date.now();
      
      await SecureStore.setItemAsync(TOKEN_KEY, token);
      await AsyncStorage.setItem(USER_KEY, JSON.stringify(mockUser));
      
      return {
        success: true,
        data: { user: mockUser, token },
      };
    } catch (error) {
      return {
        success: false,
        data: { user: {} as User, token: '' },
        message: 'Registration failed',
      };
    }
  }

  async logout(): Promise<void> {
    try {
      await SecureStore.deleteItemAsync(TOKEN_KEY);
      await AsyncStorage.removeItem(USER_KEY);
      await AsyncStorage.removeItem(BIOMETRIC_KEY);
    } catch (error) {
      console.error('Logout error:', error);
    }
  }

  async getStoredAuth(): Promise<{ user: User | null; token: string | null }> {
    try {
      const token = await SecureStore.getItemAsync(TOKEN_KEY);
      const userString = await AsyncStorage.getItem(USER_KEY);
      const user = userString ? JSON.parse(userString) : null;
      
      return { user, token };
    } catch (error) {
      return { user: null, token: null };
    }
  }

  async verifyToken(token: string): Promise<boolean> {
    try {
      // Mock token verification - replace with actual API call
      return token.startsWith('mock_jwt_token_');
    } catch (error) {
      return false;
    }
  }

  // Biometric authentication
  async isBiometricSupported(): Promise<boolean> {
    try {
      const compatible = await LocalAuthentication.hasHardwareAsync();
      const enrolled = await LocalAuthentication.isEnrolledAsync();
      return compatible && enrolled;
    } catch (error) {
      return false;
    }
  }

  async enableBiometric(): Promise<boolean> {
    try {
      const result = await LocalAuthentication.authenticateAsync({
        promptMessage: 'Enable biometric authentication',
        cancelLabel: 'Cancel',
      });
      
      if (result.success) {
        await AsyncStorage.setItem(BIOMETRIC_KEY, 'true');
        return true;
      }
      return false;
    } catch (error) {
      return false;
    }
  }

  async authenticateWithBiometric(): Promise<boolean> {
    try {
      const isEnabled = await AsyncStorage.getItem(BIOMETRIC_KEY);
      if (isEnabled !== 'true') return false;
      
      const result = await LocalAuthentication.authenticateAsync({
        promptMessage: 'Authenticate with biometrics',
        cancelLabel: 'Cancel',
      });
      
      return result.success;
    } catch (error) {
      return false;
    }
  }

  async isBiometricEnabled(): Promise<boolean> {
    try {
      const isEnabled = await AsyncStorage.getItem(BIOMETRIC_KEY);
      return isEnabled === 'true';
    } catch (error) {
      return false;
    }
  }

  // Two-factor authentication
  async enableTwoFactor(): Promise<ApiResponse<{ qrCode: string; secret: string }>> {
    try {
      // Mock 2FA setup
      return {
        success: true,
        data: {
          qrCode: 'mock_qr_code_data',
          secret: 'MOCK2FASECRET123',
        },
      };
    } catch (error) {
      return {
        success: false,
        data: { qrCode: '', secret: '' },
        message: '2FA setup failed',
      };
    }
  }

  async verifyTwoFactor(code: string): Promise<ApiResponse<boolean>> {
    try {
      // Mock 2FA verification
      const isValid = code === '123456'; // Mock validation
      return {
        success: isValid,
        data: isValid,
        message: isValid ? 'Verification successful' : 'Invalid code',
      };
    } catch (error) {
      return {
        success: false,
        data: false,
        message: 'Verification failed',
      };
    }
  }

  // Password reset
  async requestPasswordReset(email: string): Promise<ApiResponse<boolean>> {
    try {
      // Mock password reset request
      return {
        success: true,
        data: true,
        message: 'Password reset email sent',
      };
    } catch (error) {
      return {
        success: false,
        data: false,
        message: 'Password reset failed',
      };
    }
  }

  async resetPassword(token: string, newPassword: string): Promise<ApiResponse<boolean>> {
    try {
      // Mock password reset
      return {
        success: true,
        data: true,
        message: 'Password reset successful',
      };
    } catch (error) {
      return {
        success: false,
        data: false,
        message: 'Password reset failed',
      };
    }
  }
}

export default AuthService.getInstance();