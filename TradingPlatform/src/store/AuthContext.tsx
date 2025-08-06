import React, { createContext, useContext, useReducer, useEffect, ReactNode } from 'react';
import { AuthState, User } from '../types';
import AuthService from '../services/authService';

// Actions
type AuthAction =
  | { type: 'LOGIN_START' }
  | { type: 'LOGIN_SUCCESS'; payload: { user: User; token: string } }
  | { type: 'LOGIN_FAILURE'; payload: string }
  | { type: 'LOGOUT' }
  | { type: 'RESTORE_AUTH'; payload: { user: User; token: string } }
  | { type: 'UPDATE_USER'; payload: User };

// Initial state
const initialState: AuthState = {
  isAuthenticated: false,
  user: null,
  token: null,
  loading: true,
};

// Reducer
function authReducer(state: AuthState, action: AuthAction): AuthState {
  switch (action.type) {
    case 'LOGIN_START':
      return {
        ...state,
        loading: true,
      };
    case 'LOGIN_SUCCESS':
      return {
        isAuthenticated: true,
        user: action.payload.user,
        token: action.payload.token,
        loading: false,
      };
    case 'LOGIN_FAILURE':
      return {
        ...state,
        isAuthenticated: false,
        user: null,
        token: null,
        loading: false,
      };
    case 'LOGOUT':
      return {
        isAuthenticated: false,
        user: null,
        token: null,
        loading: false,
      };
    case 'RESTORE_AUTH':
      return {
        isAuthenticated: true,
        user: action.payload.user,
        token: action.payload.token,
        loading: false,
      };
    case 'UPDATE_USER':
      return {
        ...state,
        user: action.payload,
      };
    default:
      return state;
  }
}

// Context types
interface AuthContextType {
  state: AuthState;
  login: (email: string, password: string) => Promise<boolean>;
  register: (userData: {
    email: string;
    password: string;
    firstName: string;
    lastName: string;
  }) => Promise<boolean>;
  logout: () => Promise<void>;
  authenticateWithBiometric: () => Promise<boolean>;
  isBiometricSupported: () => Promise<boolean>;
  enableBiometric: () => Promise<boolean>;
  isBiometricEnabled: () => Promise<boolean>;
  updateUser: (user: User) => void;
}

// Create context
const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Provider component
interface AuthProviderProps {
  children: ReactNode;
}

export function AuthProvider({ children }: AuthProviderProps) {
  const [state, dispatch] = useReducer(authReducer, initialState);

  // Restore authentication on app start
  useEffect(() => {
    const restoreAuth = async () => {
      try {
        const { user, token } = await AuthService.getStoredAuth();
        
        if (user && token) {
          const isValidToken = await AuthService.verifyToken(token);
          if (isValidToken) {
            dispatch({ type: 'RESTORE_AUTH', payload: { user, token } });
          } else {
            await AuthService.logout();
            dispatch({ type: 'LOGOUT' });
          }
        } else {
          dispatch({ type: 'LOGOUT' });
        }
      } catch (error) {
        console.error('Auth restoration error:', error);
        dispatch({ type: 'LOGOUT' });
      }
    };

    restoreAuth();
  }, []);

  const login = async (email: string, password: string): Promise<boolean> => {
    dispatch({ type: 'LOGIN_START' });
    
    try {
      const response = await AuthService.login(email, password);
      
      if (response.success) {
        dispatch({
          type: 'LOGIN_SUCCESS',
          payload: {
            user: response.data.user,
            token: response.data.token,
          },
        });
        return true;
      } else {
        dispatch({ type: 'LOGIN_FAILURE', payload: response.message || 'Login failed' });
        return false;
      }
    } catch (error) {
      dispatch({ type: 'LOGIN_FAILURE', payload: 'Login failed' });
      return false;
    }
  };

  const register = async (userData: {
    email: string;
    password: string;
    firstName: string;
    lastName: string;
  }): Promise<boolean> => {
    dispatch({ type: 'LOGIN_START' });
    
    try {
      const response = await AuthService.register(userData);
      
      if (response.success) {
        dispatch({
          type: 'LOGIN_SUCCESS',
          payload: {
            user: response.data.user,
            token: response.data.token,
          },
        });
        return true;
      } else {
        dispatch({ type: 'LOGIN_FAILURE', payload: response.message || 'Registration failed' });
        return false;
      }
    } catch (error) {
      dispatch({ type: 'LOGIN_FAILURE', payload: 'Registration failed' });
      return false;
    }
  };

  const logout = async (): Promise<void> => {
    try {
      await AuthService.logout();
      dispatch({ type: 'LOGOUT' });
    } catch (error) {
      console.error('Logout error:', error);
      dispatch({ type: 'LOGOUT' });
    }
  };

  const authenticateWithBiometric = async (): Promise<boolean> => {
    try {
      const success = await AuthService.authenticateWithBiometric();
      if (success) {
        // If biometric auth succeeds, we should already have stored auth
        const { user, token } = await AuthService.getStoredAuth();
        if (user && token) {
          dispatch({ type: 'RESTORE_AUTH', payload: { user, token } });
          return true;
        }
      }
      return false;
    } catch (error) {
      console.error('Biometric auth error:', error);
      return false;
    }
  };

  const isBiometricSupported = async (): Promise<boolean> => {
    return await AuthService.isBiometricSupported();
  };

  const enableBiometric = async (): Promise<boolean> => {
    return await AuthService.enableBiometric();
  };

  const isBiometricEnabled = async (): Promise<boolean> => {
    return await AuthService.isBiometricEnabled();
  };

  const updateUser = (user: User): void => {
    dispatch({ type: 'UPDATE_USER', payload: user });
  };

  const value: AuthContextType = {
    state,
    login,
    register,
    logout,
    authenticateWithBiometric,
    isBiometricSupported,
    enableBiometric,
    isBiometricEnabled,
    updateUser,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

// Hook to use auth context
export function useAuth(): AuthContextType {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}