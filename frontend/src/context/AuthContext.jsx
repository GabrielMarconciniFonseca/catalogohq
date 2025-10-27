import PropTypes from 'prop-types';
import { createContext, useContext, useEffect, useMemo, useState } from 'react';
import { login as loginRequest, registerUser, setAuthToken } from '../services/auth.js';

const AuthContext = createContext();
const STORAGE_KEY = 'catalogo.auth';

function getStoredSession() {
  if (typeof window === 'undefined') {
    return null;
  }
  const stored = window.localStorage.getItem(STORAGE_KEY);
  if (!stored) {
    return null;
  }
  try {
    const parsed = JSON.parse(stored);
    if (parsed?.token) {
      setAuthToken(parsed.token);
    }
    return parsed;
  } catch (error) {
    return null;
  }
}

export function AuthProvider({ children }) {
  const [session, setSession] = useState(() => getStoredSession());
  const [authError, setAuthError] = useState(null);

  useEffect(() => {
    if (session?.token) {
      setAuthToken(session.token);
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(session));
    } else {
      setAuthToken(null);
      window.localStorage.removeItem(STORAGE_KEY);
    }
  }, [session]);

  const login = async (credentials) => {
    setAuthError(null);
    const response = await loginRequest({
      username: credentials.username.trim(),
      password: credentials.password,
    });
    setSession(response);
    return response;
  };

  const register = async (payload) => {
    setAuthError(null);
    const response = await registerUser({
      username: payload.username.trim(),
      password: payload.password,
      fullName: payload.fullName.trim(),
    });
    setSession(response);
    return response;
  };

  const logout = () => {
    setSession(null);
    setAuthError(null);
  };

  const loginWithGoogle = () => {
    const url = import.meta.env.VITE_GOOGLE_AUTH_URL || '/api/auth/google';
    if (typeof window !== 'undefined') {
      window.location.href = url;
    }
  };

  const value = useMemo(
    () => ({
      user: session,
      isAuthenticated: Boolean(session?.token),
      error: authError,
      setError: setAuthError,
      login,
      register,
      loginWithGoogle,
      logout,
    }),
    [session, authError, login, register, loginWithGoogle, logout],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

AuthProvider.propTypes = {
  children: PropTypes.node.isRequired,
};

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth deve ser utilizado dentro de um AuthProvider.');
  }
  return context;
}
