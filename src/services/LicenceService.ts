import * as SecureStore from 'expo-secure-store';
import * as Crypto from 'expo-crypto';
import { Platform } from 'react-native';
import { LICENCE, STORAGE_KEYS } from '../constants';

interface Licence {
  id: string;
  deviceId: string;
  activatedAt: Date;
  expiresAt: Date;
  isActive: boolean;
  trialUsed: boolean;
}

export class LicenceService {
  private static instance: LicenceService;
  private cachedLicence: Licence | null = null;

  static getInstance(): LicenceService {
    if (!LicenceService.instance) {
      LicenceService.instance = new LicenceService();
    }
    return LicenceService.instance;
  }

  async getDeviceId(): Promise<string> {
    let id = await SecureStore.getItemAsync(STORAGE_KEYS.DEVICE_ID);
    if (!id) {
      id = await Crypto.randomUUID();
      await SecureStore.setItemAsync(STORAGE_KEYS.DEVICE_ID, id);
    }
    return id;
  }

  async loadLicence(): Promise<Licence | null> {
    const data = await SecureStore.getItemAsync(STORAGE_KEYS.LICENCE);
    if (data) {
      this.cachedLicence = JSON.parse(data);
      return this.cachedLicence;
    }
    return null;
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
    };

    await SecureStore.setItemAsync(STORAGE_KEYS.LICENCE, JSON.stringify(newLicence));
    this.cachedLicence = newLicence;
    return newLicence;
  }

  async checkLicence(): Promise<{ isValid: boolean; remainingDays: number }> {
    const licence = await this.loadLicence();
    if (!licence) {
      return { isValid: false, remainingDays: 0 };
    }

    const now = new Date();
    const expiry = new Date(licence.expiresAt);
    const remainingDays = Math.ceil((expiry.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));
    const isValid = licence.isActive && remainingDays > 0;

    return { isValid, remainingDays: Math.max(0, remainingDays) };
  }

  async activateLicence(code: string): Promise<boolean> {
    if (!code.startsWith('STOCKIA-') || code.length < 14) {
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
    };

    await SecureStore.setItemAsync(STORAGE_KEYS.LICENCE, JSON.stringify(newLicence));
    this.cachedLicence = newLicence;
    return true;
  }
}

export default LicenceService.getInstance();
