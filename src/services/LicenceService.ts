// ============================================
// SERVICE DE GESTION DE LICENCE
// ============================================

import * as SecureStore from 'expo-secure-store';
import * as Crypto from 'expo-crypto';
import { Platform } from 'react-native';
import { LICENCE, STORAGE_KEYS } from '../constants';
import type { Licence, LicenceStatus } from '../types/licence';

export class LicenceService {
  private static instance: LicenceService;
  private cachedLicence: Licence | null = null;
  private deviceId: string | null = null;

  private constructor() {}

  static getInstance(): LicenceService {
    if (!LicenceService.instance) {
      LicenceService.instance = new LicenceService();
    }
    return LicenceService.instance;
  }

  async init(): Promise<void> {
    await this.getDeviceId();
    await this.loadLicence();
  }

  async getDeviceId(): Promise<string> {
    if (this.deviceId) return this.deviceId;

    try {
      let id = await SecureStore.getItemAsync(STORAGE_KEYS.DEVICE_ID);
      if (!id) {
        id = await Crypto.randomUUID();
        await SecureStore.setItemAsync(STORAGE_KEYS.DEVICE_ID, id);
      }
      this.deviceId = id;
      return id;
    } catch {
      const fallback = Platform.OS + '-' + Date.now().toString();
      this.deviceId = fallback;
      return fallback;
    }
  }

  async loadLicence(): Promise<Licence | null> {
    try {
      const data = await SecureStore.getItemAsync(STORAGE_KEYS.LICENCE);
      if (data) {
        this.cachedLicence = JSON.parse(data);
        return this.cachedLicence;
      }
      return null;
    } catch {
      return null;
    }
  }

  async startTrial(): Promise<Licence> {
    const deviceId = await this.getDeviceId();
    const now = new Date();
    const expiry = new Date(now);
    expiry.setDate(expiry.getDate() + LICENCE.TRIAL_DAYS);

    const newLicence: Licence = {
      id: await Crypto.randomUUID(),
      deviceId,
      activatedAt: now,
      expiresAt: expiry,
      isActive: true,
      trialUsed: true,
      lastVerification: now,
    };

    await this.saveLicence(newLicence);
    this.cachedLicence = newLicence;
    return newLicence;
  }

  // ✅ Méthode activateLicence - CORRECTE
  async activateLicence(code: string): Promise<boolean> {
    if (!code || code.length < 6) {
      return false;
    }

    // Validation simple du code
    if (!code.startsWith('STOCKIA-')) {
      return false;
    }

    const deviceId = await this.getDeviceId();
    const now = new Date();
    const expiry = new Date(now);
    expiry.setDate(expiry.getDate() + LICENCE.PERIOD_DAYS);

    const newLicence: Licence = {
      id: await Crypto.randomUUID(),
      deviceId,
      activatedAt: now,
      expiresAt: expiry,
      isActive: true,
      trialUsed: true,
      activationCode: code,
      lastVerification: now,
    };

    await this.saveLicence(newLicence);
    this.cachedLicence = newLicence;
    return true;
  }

  async saveLicence(licence: Licence): Promise<void> {
    await SecureStore.setItemAsync(STORAGE_KEYS.LICENCE, JSON.stringify(licence));
    this.cachedLicence = licence;
  }

  async checkLicence(): Promise<LicenceStatus> {
    const licence = await this.loadLicence();
    
    if (!licence) {
      return {
        isValid: false,
        isExpired: true,
        isTrial: false,
        remainingDays: 0,
      };
    }

    const now = new Date();
    const expiry = new Date(licence.expiresAt);
    const remainingDays = Math.ceil((expiry.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));
    const isExpired = remainingDays <= 0;

    return {
      isValid: licence.isActive && !isExpired,
      isExpired: isExpired,
      isTrial: licence.trialUsed || false,
      remainingDays: Math.max(0, remainingDays),
      expiresAt: expiry,
      activatedAt: licence.activatedAt,
    };
  }

  async isLicenceValid(): Promise<boolean> {
    const status = await this.checkLicence();
    return status.isValid;
  }

  async getRemainingDays(): Promise<number> {
    const status = await this.checkLicence();
    return status.remainingDays;
  }

  async getPrice(): Promise<number> {
    return LICENCE.PRICE;
  }

  async getWhatsAppNumber(): Promise<string> {
    return '+24383009563';
  }

  async clearLicence(): Promise<void> {
    await SecureStore.deleteItemAsync(STORAGE_KEYS.LICENCE);
    this.cachedLicence = null;
  }
}

export default LicenceService.getInstance();
