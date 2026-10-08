import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { authApi } from '../services/api/authApi';
import { profileApi } from '../services/api/profileApi';
import { storage } from '../utils/storage';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => authApi.getCurrentUser());
  const [tokens, setTokens] = useState(() => authApi.getTokens());
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Initial verification
    const storedUser = authApi.getCurrentUser();
    const storedTokens = authApi.getTokens();
    if (storedTokens?.access) {
      setUser(storedUser);
      setTokens(storedTokens);
    }
    setIsLoading(false);
  }, []);

  const requestOtp = useCallback(async (identifier) => {
    return await authApi.requestOtp(identifier);
  }, []);

  const verifyOtp = useCallback(async (identifier, code) => {
    const data = await authApi.verifyOtp(identifier, code);
    setUser(data.user);
    setTokens(data.tokens);
    return data;
  }, []);

  const loginPassword = useCallback(async (email, password) => {
    const data = await authApi.loginPassword(email, password);
    setUser(data.user);
    setTokens(data.tokens);
    return data;
  }, []);

  const logout = useCallback(() => {
    authApi.logout();
    setUser(null);
    setTokens(null);
  }, []);

  const updateProfile = useCallback(async (updates) => {
    const updated = await profileApi.updateProfile(updates);
    setUser(updated);
    return updated;
  }, []);

  const isAuthenticated = Boolean(tokens?.access && user);
  const isAdmin = Boolean(user?.is_staff || user?.is_superuser);

  return (
    <AuthContext.Provider
      value={{
        user,
        tokens,
        isAuthenticated,
        isAdmin,
        isLoading,
        requestOtp,
        verifyOtp,
        loginPassword,
        logout,
        updateProfile,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
