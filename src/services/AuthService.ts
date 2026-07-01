// ============================================
// SERVICE D'AUTHENTIFICATION
// ============================================

import * as LocalAuthentication from 'expo-local-authentication';
import * as SecureStore from 'expo-secure-store';
import * as Crypto from 'expo-crypto';
import { STORAGE_KEYS } from '../constants';
import DatabaseService from './DatabaseService';
import { hashPassword, verifyPassword } from '../utils/encryption';

export interface User {
  id: string;
  username: string;
  email: string;
  role: 'admin' | 'manager' | 'cashier';
  isBiometric: boolean;
  pinCode?: string;
  lastLogin?: Date;
  createdAt: Date;
}

export class AuthService {
  private static instance: AuthService;
  private currentUser: User | null = null;

  private constructor() {}

  static getInstance(): AuthService {
    if (!AuthService.instance) {
      AuthService.instance = new AuthService();
    }
    return AuthService.instance;
  }

  async login(username: string, password: string): Promise<User | null> {
    try {
      const user = await DatabaseService.queryOne(
        'SELECT * FROM users WHERE username = ?',
        [username]
      );

      if (!user) return null;

      const isValid = await verifyPassword(password, user.password_hash);
      if (!isValid) return null;

      // Mettre à jour last_login
      await DatabaseService.execute(
        'UPDATE users SET last_login = ? WHERE id = ?',
        [new Date().toISOString(), user.id]
      );

      const userData: User = {
        id: user.id,
        username: user.username,
        email: user.email,
        role: user.role,
        isBiometric: user.is_biometric === 1,
        pinCode: user.pin_code || undefined,
        lastLogin: user.last_login ? new Date(user.last_login) : undefined,
        createdAt: new Date(user.created_at),
      };

      this.currentUser = userData;
      await SecureStore.setItemAsync(STORAGE_KEYS.USER, JSON.stringify(userData));
      return userData;
    } catch (error) {
      console.error('❌ Erreur login:', error);
      return null;
    }
  }

  async register(data: {
    username: string;
    email: string;
    password: string;
    role?: 'admin' | 'manager' | 'cashier';
  }): Promise<User | null> {
    try {
      const id = await Crypto.randomUUID();
      const passwordHash = await hashPassword(data.password);

      await DatabaseService.execute(
        INSERT INTO users (
          id, username, email, password_hash, role, is_biometric
        ) VALUES (?, ?, ?, ?, ?, ?),
        [
          id,
          data.username,
          data.email,
          passwordHash,
          data.role || 'cashier',
          0,
        ]
      );

      return await this.login(data.username, data.password);
    } catch (error) {
      console.error('❌ Erreur registration:', error);
      return null;
    }
  }

  async getCurrentUser(): Promise<User | null> {
    if (this.currentUser) return this.currentUser;

    try {
      const data = await SecureStore.getItemAsync(STORAGE_KEYS.USER);
      if (data) {
        this.currentUser = JSON.parse(data);
        return this.currentUser;
      }
      return null;
    } catch {
      return null;
    }
  }

  async logout(): Promise<void> {
    await SecureStore.deleteItemAsync(STORAGE_KEYS.USER);
    this.currentUser = null;
  }

  async isBiometricAvailable(): Promise<boolean> {
    try {
      const compatible = await LocalAuthentication.hasHardwareAsync();
      const enrolled = await LocalAuthentication.isEnrolledAsync();
      return compatible && enrolled;
    } catch {
      return false;
    }
  }

  async authenticateWithBiometric(): Promise<boolean> {
    try {
      const result = await LocalAuthentication.authenticateAsync({
        promptMessage: 'Authentifiez-vous pour accéder à Stockia',
        fallbackLabel: 'Utiliser le code PIN',
      });
      return result.success;
    } catch {
      return false;
    }
  }

  async setPIN(pin: string): Promise<void> {
    await SecureStore.setItemAsync('@stockia_pin', pin);
    if (this.currentUser) {
      await DatabaseService.execute(
        'UPDATE users SET pin_code = ? WHERE id = ?',
        [pin, this.currentUser.id]
      );
    }
  }

  async verifyPIN(pin: string): Promise<boolean> {
    const stored = await SecureStore.getItemAsync('@stockia_pin');
    return stored === pin;
  }

  async hasPIN(): Promise<boolean> {
    const stored = await SecureStore.getItemAsync('@stockia_pin');
    return stored !== null;
  }

  async changePassword(
    currentPassword: string,
    newPassword: string
  ): Promise<boolean> {
    try {
      const user = await this.getCurrentUser();
      if (!user) return false;

      const dbUser = await DatabaseService.queryOne(
        'SELECT * FROM users WHERE id = ?',
        [user.id]
      );

      if (!dbUser) return false;

      const isValid = await verifyPassword(currentPassword, dbUser.password_hash);
      if (!isValid) return false;

      const newHash = await hashPassword(newPassword);
      await DatabaseService.execute(
        'UPDATE users SET password_hash = ? WHERE id = ?',
        [newHash, user.id]
      );

      return true;
    } catch {
      return false;
    }
  }

  async getAllUsers(): Promise<User[]> {
    try {
      const users = await DatabaseService.query(
        'SELECT * FROM users ORDER BY username'
      );
      return users.map((u: any) => ({
        id: u.id,
        username: u.username,
        email: u.email,
        role: u.role,
        isBiometric: u.is_biometric === 1,
        pinCode: u.pin_code || undefined,
        lastLogin: u.last_login ? new Date(u.last_login) : undefined,
        createdAt: new Date(u.created_at),
      }));
    } catch {
      return [];
    }
  }

  async deleteUser(id: string): Promise<boolean> {
    try {
      const current = await this.getCurrentUser();
      if (current?.id === id) return false; // Ne pas supprimer soi-même

      await DatabaseService.execute('DELETE FROM users WHERE id = ?', [id]);
      return true;
    } catch {
      return false;
    }
  }

  async updateUserRole(id: string, role: 'admin' | 'manager' | 'cashier'): Promise<boolean> {
    try {
      await DatabaseService.execute(
        'UPDATE users SET role = ? WHERE id = ?',
        [role, id]
      );
      return true;
    } catch {
      return false;
    }
  }

  async isAdmin(): Promise<boolean> {
    const user = await this.getCurrentUser();
    return user?.role === 'admin';
  }
}

export default AuthService.getInstance();
