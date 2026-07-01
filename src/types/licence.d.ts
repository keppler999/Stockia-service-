// ============================================
// TYPES DE LA LICENCE
// ============================================

export interface LicenceConfig {
  price: number;
  currency: string;
  trialDays: number;
  periodDays: number;
  whatsappNumber: string;
  supportEmail: string;
}

export interface LicenceStatus {
  isValid: boolean;
  isExpired: boolean;
  isTrial: boolean;
  remainingDays: number;
  expiresAt?: Date;
  activatedAt?: Date;
}

export interface ActivationCode {
  code: string;
  deviceId: string;
  clientEmail: string;
  generatedAt: Date;
  expiresAt: Date;
  used: boolean;
}

export interface LicenceEvent {
  type: 'activation' | 'expiration' | 'renewal' | 'trial_start' | 'trial_end';
  timestamp: Date;
  deviceId: string;
  details?: any;
}
