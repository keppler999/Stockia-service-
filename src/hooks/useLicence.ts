// ============================================
// HOOK useLicence
// ============================================

import { useState, useEffect } from 'react';
import LicenceService from '../services/LicenceService';
import type { LicenceStatus } from '../types/licence';

export function useLicence() {
  const [status, setStatus] = useState<LicenceStatus | null>(null);
  const [loading, setLoading] = useState(true);

  const checkLicence = async () => {
    setLoading(true);
    try {
      const licenceStatus = await LicenceService.checkLicence();
      setStatus(licenceStatus);
    } catch (error) {
      console.error('Erreur vérification licence:', error);
    } finally {
      setLoading(false);
    }
  };

  const activateLicence = async (code: string): Promise<boolean> => {
    try {
      const success = await LicenceService.activateLicence(code);
      if (success) {
        await checkLicence();
      }
      return success;
    } catch (error) {
      console.error('Erreur activation licence:', error);
      return false;
    }
  };

  const startTrial = async () => {
    try {
      await LicenceService.startTrial();
      await checkLicence();
    } catch (error) {
      console.error('Erreur démarrage essai:', error);
    }
  };

  const getDeviceId = async (): Promise<string> => {
    return await LicenceService.getDeviceId();
  };

  useEffect(() => {
    checkLicence();
  }, []);

  return {
    status,
    loading,
    checkLicence,
    activateLicence,
    startTrial,
    getDeviceId,
    isValid: status?.isValid || false,
    remainingDays: status?.remainingDays || 0,
    isExpired: status?.isExpired || false,
    isTrial: status?.isTrial || false,
  };
}
