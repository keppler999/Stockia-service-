import { useState } from 'react';
import AuthService from '../services/AuthService';
import type { User } from '../types';

export function useAuth() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const login = async (username: string, password: string): Promise<User | null> => {
    setLoading(true);
    setError(null);
    try {
      const user = await AuthService.login(username, password);
      return user;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erreur de connexion');
      return null;
    } finally {
      setLoading(false);
    }
  };

  const logout = async () => {
    await AuthService.logout();
  };

  const getCurrentUser = async () => {
    return await AuthService.getCurrentUser();
  };

  const isBiometricAvailable = async () => {
    return await AuthService.isBiometricAvailable();
  };

  const authenticateWithBiometric = async () => {
    return await AuthService.authenticateWithBiometric();
  };

  return {
    login,
    logout,
    getCurrentUser,
    isBiometricAvailable,
    authenticateWithBiometric,
    loading,
    error,
  };
}
